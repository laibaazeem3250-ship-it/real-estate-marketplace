import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertyById, deleteProperty, clearCurrentProperty } from '../store/slices/propertySlice';
import { addFavorite } from '../store/slices/favoriteSlice';
import api from '../api/axios';

const PropertyDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: property, loading } = useSelector((state) => state.properties);
  const { user } = useSelector((state) => state.auth);

  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    dispatch(fetchPropertyById(id));
    fetchReviews();
    return () => dispatch(clearCurrentProperty());
  }, [id, dispatch]);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/property/${id}`);
      setReviews(data);
    } catch (err) {
      // silently ignore for now
    }
  };

  const handleFavorite = async () => {
    const result = await dispatch(addFavorite(id));
    if (addFavorite.fulfilled.match(result)) setStatusMsg('Added to favorites!');
    else setStatusMsg(result.payload || 'Could not add favorite');
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this property?')) {
      await dispatch(deleteProperty(id));
      navigate('/');
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inquiries', { propertyId: id, message: inquiryMessage });
      setStatusMsg('Inquiry sent!');
      setInquiryMessage('');
    } catch (err) {
      setStatusMsg(err.response?.data?.message || 'Failed to send inquiry');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { propertyId: id, ...reviewForm });
      setReviewForm({ rating: 5, comment: '' });
      fetchReviews();
    } catch (err) {
      setStatusMsg(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading || !property) return <p>Loading...</p>;

  const isOwner = user && property.owner && (property.owner._id === user._id);

  return (
    <div className="property-detail">
      <h1>{property.title}</h1>
      <p className="property-location">{property.location}</p>
      <p className="property-price">
        ${property.price?.toLocaleString()} {property.listingType === 'rent' ? '/mo' : ''}
      </p>
      <p className="property-meta">
        {property.bedrooms} bd · {property.bathrooms} ba · {property.areaSqft} sqft · {property.propertyType}
      </p>
      <p>{property.description}</p>

      {statusMsg && <p className="status-text">{statusMsg}</p>}

      <div className="action-row">
        {user && !isOwner && <button onClick={handleFavorite}>♥ Save to Favorites</button>}
        {isOwner && <Link to={`/edit-property/${property._id}`} className="btn-view">Edit</Link>}
        {isOwner && <button onClick={handleDelete} className="btn-danger">Delete</button>}
      </div>

      {user && !isOwner && (
        <div className="inquiry-section">
          <h3>Contact Owner</h3>
          <form onSubmit={handleInquirySubmit} className="form">
            <textarea
              placeholder="I'm interested in this property..."
              value={inquiryMessage}
              onChange={(e) => setInquiryMessage(e.target.value)}
              required
            />
            <button type="submit">Send Inquiry</button>
          </form>
        </div>
      )}

      <div className="reviews-section">
        <h3>Reviews</h3>
        {reviews.length === 0 && <p>No reviews yet.</p>}
        {reviews.map((r) => (
          <div key={r._id} className="review-item">
            <strong>{r.user?.name}</strong> — {r.rating}/5
            <p>{r.comment}</p>
          </div>
        ))}

        {user && (
          <form onSubmit={handleReviewSubmit} className="form">
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} stars</option>
              ))}
            </select>
            <textarea
              placeholder="Write a review..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            />
            <button type="submit">Submit Review</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
