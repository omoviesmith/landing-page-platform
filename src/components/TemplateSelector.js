import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { fetchTemplates } from '../services/api';

function TemplateSelector() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { category } = useParams();
  const history = useHistory();

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await fetchTemplates(category);
        setTemplates(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading templates:', error);
        setLoading(false);
      }
    };

    loadTemplates();
  }, [category]);

  const selectTemplate = (templateId) => {
    history.push(`/edit/${category}/${templateId}`);
  };

  if (loading) return <div>Loading templates...</div>;

  return (
    <div className="template-selector">
      <h1>{category} Templates</h1>
      <div className="template-grid">
        {templates.map(template => (
          <div key={template.id} className="template-card" onClick={() => selectTemplate(template.id)}>
            <img src={template.thumbnail} alt={template.name} />
            <h3>{template.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TemplateSelector;