const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const NetlifyAPI = require('netlify');
require('dotenv').config();

const app = express();
const client = new NetlifyAPI(process.env.NETLIFY_API_KEY);

app.use(cors());
app.use(bodyParser.json());

// Get all templates for a category
app.get('/api/templates/:category', (req, res) => {
  const { category } = req.params;
  const templatesPath = path.join(__dirname, '..', 'templates', category);
  
  try {
    const templates = fs.readdirSync(templatesPath)
      .filter(file => fs.statSync(path.join(templatesPath, file)).isDirectory())
      .map(dir => {
        const metaPath = path.join(templatesPath, dir, 'meta.json');
        const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        return {
          id: dir,
          ...meta
        };
      });
    
    res.json(templates);
  } catch (error) {
    console.error(`Error reading templates for ${category}:`, error);
    res.status(500).json({ error: 'Failed to read templates' });
  }
});

// Get a specific template
app.get('/api/templates/:category/:templateId', (req, res) => {
  const { category, templateId } = req.params;
  const templatePath = path.join(__dirname, '..', 'templates', category, templateId);
  
  try {
    const metaPath = path.join(templatePath, 'meta.json');
    const htmlPath = path.join(templatePath, 'index.html');
    
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    const html = fs.readFileSync(htmlPath, 'utf8');
    
    res.json({
      id: templateId,
      ...meta,
      html
    });
  } catch (error) {
    console.error(`Error reading template ${templateId}:`, error);
    res.status(500).json({ error: 'Failed to read template' });
  }
});

// Add a new template
app.post('/api/templates', async (req, res) => {
  const { name, category, description, htmlContent } = req.body;
  
  if (!name || !category || !htmlContent) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Create a template ID from the name
    const templateId = name.toLowerCase().replace(/\s+/g, '-');
    const templatePath = path.join(__dirname, '..', 'templates', category, templateId);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(templatePath)) {
      fs.mkdirSync(templatePath, { recursive: true });
    }
    
    // Write meta.json
    const meta = {
      name,
      description: description || '',
      thumbnail: `/thumbnails/${category}/${templateId}.jpg`,
      previewUrl: `/previews/${category}/${templateId}`,
      createdAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(templatePath, 'meta.json'),
      JSON.stringify(meta, null, 2)
    );
    
    // Write index.html
    fs.writeFileSync(
      path.join(templatePath, 'index.html'),
      htmlContent
    );
    
    res.json({ success: true, templateId });
  } catch (error) {
    console.error('Error adding template:', error);
    res.status(500).json({ error: 'Failed to add template' });
  }
});

// Update and deploy a template
app.post('/api/deploy', async (req, res) => {
  const { category, templateId, businessName, tagline, description, phoneNumber, email, logo } = req.body;
  
  if (!category || !templateId || !businessName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    // Read the template
    const templatePath = path.join(__dirname, '..', 'templates', category, templateId);
    const htmlPath = path.join(templatePath, 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Replace placeholder variables
    html = html
      .replace(/{{businessName}}/g, businessName)
      .replace(/{{tagline}}/g, tagline || '')
      .replace(/{{description}}/g, description || '')
      .replace(/{{phoneNumber}}/g, phoneNumber || '')
      .replace(/{{email}}/g, email || '');
    
    // Create a temporary directory for the site
    const siteName = businessName.toLowerCase().replace(/\s+/g, '-');
    const sitePath = path.join(__dirname, '..', 'tmp', siteName);
    
    if (!fs.existsSync(sitePath)) {
      fs.mkdirSync(sitePath, { recursive: true });
    }
    
    // Write the customized HTML
    fs.writeFileSync(path.join(sitePath, 'index.html'), html);
    
    // Deploy to Netlify
    const deploy = await client.createSiteDeploy({
      site_id: process.env.NETLIFY_SITE_ID,
      dir: sitePath,
      function_dir: path.join(sitePath, 'functions')
    });
    
    // Create a custom domain if needed
    // This would be business-name.your-netlify-site.netlify.app
    const customDomain = `${siteName}.${process.env.NETLIFY_MAIN_DOMAIN}`;
    
    res.json({
      success: true,
      url: deploy.deploy_url || `https://${customDomain}`
    });
  } catch (error) {
    console.error('Error deploying site:', error);
    res.status(500).json({ error: 'Failed to deploy site' });
  }
});

// For local development
if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports.handler = serverless(app);