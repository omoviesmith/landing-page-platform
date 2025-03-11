import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const categories = [
    'Roofing', 
    'Plumbing', 
    'Painting', 
    'Landscaping', 
    'Electrical', 
    'Carpentry'
  ];

  return (
    <div className="dashboard">
      <h1>Small Business Landing Page Templates</h1>
      
      <div className="categories-section">
        <h2>Select a Category</h2>
        <div className="category-grid">
          {categories.map(category => (
            <Link key={category} to={`/templates/${category}`} className="category-card">
              <h3>{category}</h3>
              <p>View Templates</p>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="admin-link">
        <Link to="/admin">Admin Console</Link>
      </div>
    </div>
  );
}

export default Dashboard;