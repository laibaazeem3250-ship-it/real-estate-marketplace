import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties } from '../store/slices/propertySlice';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.properties);
  const [filters, setFilters] = useState({ location: '', listingType: '', propertyType: '' });

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchProperties(filters));
  };

  return (
    <div>
      <h1>Find Your Next Property</h1>

      <form onSubmit={handleFilterSubmit} className="filter-bar">
        <input
          type="text"
          name="location"
          placeholder="Search by location..."
          value={filters.location}
          onChange={handleFilterChange}
        />
        <select name="listingType" value={filters.listingType} onChange={handleFilterChange}>
          <option value="">Sale or Rent</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
        <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange}>
          <option value="">Any Type</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading properties...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="property-grid">
        {items.length === 0 && !loading ? (
          <p>No properties found.</p>
        ) : (
          items.map((property) => <PropertyCard key={property._id} property={property} />)
        )}
      </div>
    </div>
  );
};

export default Home;
