import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, removeFavorite } from '../store/slices/favoriteSlice';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  if (loading) return <p>Loading favorites...</p>;

  return (
    <div>
      <h1>My Favorites</h1>
      {items.length === 0 && <p>You haven't saved any properties yet.</p>}
      <div className="property-grid">
        {items.map((fav) => (
          <div key={fav._id} className="property-card">
            <div className="property-info">
              <h3>{fav.property?.title}</h3>
              <p className="property-location">{fav.property?.location}</p>
              <p className="property-price">${fav.property?.price?.toLocaleString()}</p>
              <div className="action-row">
                <Link to={`/properties/${fav.property?._id}`} className="btn-view">View</Link>
                <button onClick={() => dispatch(removeFavorite(fav._id))} className="btn-danger">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
