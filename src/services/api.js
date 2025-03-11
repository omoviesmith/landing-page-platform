import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/.netlify/functions/api';

export const fetchTemplates = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/api/templates/${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

export const fetchTemplate = async (category, templateId) => {
  try {
    const response = await axios.get(`${API_URL}/api/templates/${category}/${templateId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching template:', error);
    throw error;
  }
};

export const addTemplate = async (templateData) => {
  try {
    const response = await axios.post(`${API_URL}/api/templates`, templateData);
    return response.data;
  } catch (error) {
    console.error('Error adding template:', error);
    throw error;
  }
};

export const updateAndDeploy = async (deployData) => {
  try {
    // Convert file objects to FormData if needed
    const formData = new FormData();
    
    Object.keys(deployData).forEach(key => {
      if (key === 'logo' && deployData[key] instanceof File) {
        formData.append('logo', deployData[key]);
      } else {
        formData.append(key, deployData[key]);
      }
    });
    
    const response = await axios.post(`${API_URL}/api/deploy`, deployData);
    return response.data;
  } catch (error) {
    console.error('Error deploying site:', error);
    throw error;
  }
};

// Add a health check function
export const checkApiStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/status`);
    return response.data;
  } catch (error) {
    console.error('API status check failed:', error);
    throw error;
  }
};