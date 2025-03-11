const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
// Remove the NetlifyAPI import since we'll handle deployments differently
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Get all templates for a category
app.get('/api/templates/:category', (req, res) => {
  const { category } = req.params;
  
  // Return a mock list of templates for testing
  const templates = [
    {
      id: 'professional-roofing',
      name: 'Professional Roofing',
      description: 'A professional template for roofing companies',
      thumbnail: 'https://via.placeholder.com/300x200?text=Roofing+Template',
      previewUrl: 'https://via.placeholder.com/800x600?text=Roofing+Preview'
    },
    {
      id: 'modern-roofing',
      name: 'Modern Roofing',
      description: 'A modern template with clean design',
      thumbnail: 'https://via.placeholder.com/300x200?text=Modern+Roofing',
      previewUrl: 'https://via.placeholder.com/800x600?text=Modern+Roofing+Preview'
    }
  ];
  
  res.json(templates);
});

// Get a specific template
app.get('/api/templates/:category/:templateId', (req, res) => {
  const { category, templateId } = req.params;
  
  // Return mock template data for testing
  const template = {
    id: templateId,
    name: templateId === 'professional-roofing' ? 'Professional Roofing' : 'Modern Roofing',
    description: 'A professional template for roofing companies',
    thumbnail: `https://via.placeholder.com/300x200?text=${templateId}`,
    previewUrl: `https://via.placeholder.com/800x600?text=${templateId}+Preview`,
    html: `<!DOCTYPE html>
    <html>
      <head>
        <title>{{businessName}} - Professional Roofing</title>
      </head>
      <body>
        <h1>{{businessName}}</h1>
        <p>{{tagline}}</p>
        <p>{{description}}</p>
        <p>Contact: {{phoneNumber}} | {{email}}</p>
      </body>
    </html>`
  };
  
  res.json(template);
});

// Add a new template
app.post('/api/templates', async (req, res) => {
  const { name, category, description, htmlContent } = req.body;
  
  if (!name || !category || !htmlContent) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // For now, just acknowledge the template addition
  res.json({ 
    success: true, 
    templateId: name.toLowerCase().replace(/\s+/g, '-'),
    message: 'Template created successfully'
  });
});

// Update and deploy a template
app.post('/api/deploy', async (req, res) => {
  const { category, templateId, businessName, tagline, description, phoneNumber, email } = req.body;
  
  if (!category || !templateId || !businessName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // In a real implementation, this would create and deploy a site
  // For now, we'll mock the response
  const siteName = businessName.toLowerCase().replace(/\s+/g, '-');
  
  res.json({
    success: true,
    url: `https://${siteName}.netlify.app`,
    message: 'Site deployed successfully!'
  });
});

// Handle status route for checking API health
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// This allows us to use this API in netlify functions
module.exports.handler = serverless(app);