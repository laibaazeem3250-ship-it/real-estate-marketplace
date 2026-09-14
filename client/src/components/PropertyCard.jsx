import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <div className="property-card">
      <div className="property-image">
        {property.images?.[0] ? (
          <img src={property.images[0]} alt={property.title} />
        ) : (
          <div className="image-placeholder">No image</div>
        )}
      </div>
      <div className="property-info">
        <h3>{property.title}</h3>
        <p className="property-location">{property.location}</p>
        <p className="property-price">
          ${property.price?.toLocaleString()} {property.listingType === 'rent' ? '/mo' : ''}
        </p>
        <p className="property-meta">
          {property.bedrooms} bd · {property.bathrooms} ba · {property.areaSqft} sqft
        </p>
        <Link to={`/properties/${property._id}`} className="btn-view">View Details</Link>
      </div>
    </div>
  );
};

export default PropertyCard;
