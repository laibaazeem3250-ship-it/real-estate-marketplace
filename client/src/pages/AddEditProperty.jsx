import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createProperty, updateProperty } from '../store/slices/propertySlice';
import api from '../api/axios';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  listingType: 'sale',
  propertyType: 'house',
  location: '',
  bedrooms: '',
  bathrooms: '',
  areaSqft: '',
  images: '',
};

const AddEditProperty = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEditMode) {
      api.get(`/properties/${id}`).then(({ data }) => {
        setFormData({
          ...data,
          images: (data.images || []).join(', '),
        });
      });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      ...formData,
      price: Number(formData.price),
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      areaSqft: Number(formData.areaSqft) || 0,
      images: formData.images
        ? formData.images.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };

    const action = isEditMode
      ? updateProperty({ id, propertyData: payload })
      : createProperty(payload);

    const result = await dispatch(action);
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(`/properties/${result.payload._id}`);
    } else {
      setError(result.payload || 'Something went wrong');
    }
  };

  return (
    <div className="form-page">
      <h2>{isEditMode ? 'Edit Property' : 'Add New Property'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />

        <select name="listingType" value={formData.listingType} onChange={handleChange}>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>

        <select name="propertyType" value={formData.propertyType} onChange={handleChange}>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>

        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input type="number" name="bedrooms" placeholder="Bedrooms" value={formData.bedrooms} onChange={handleChange} />
        <input type="number" name="bathrooms" placeholder="Bathrooms" value={formData.bathrooms} onChange={handleChange} />
        <input type="number" name="areaSqft" placeholder="Area (sqft)" value={formData.areaSqft} onChange={handleChange} />
        <input
          type="text"
          name="images"
          placeholder="Image URLs (comma-separated)"
          value={formData.images}
          onChange={handleChange}
        />

        {error && <p className="error-text">{error}</p>}
        <button type="submit">{isEditMode ? 'Update Property' : 'Create Property'}</button>
      </form>
    </div>
  );
};

export default AddEditProperty;
