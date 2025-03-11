import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/.netlify/functions/api';

export const fetchTemplates = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/templates/${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
};

export const fetchTemplate = async (category, templateId) => {
  try {
    const response = await axios.get(`${API_URL}/templates/${category}/${templateId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching template:', error);
    throw error;
  }
};

export const addTemplate = async (templateData) => {
  const formData = new FormData();
  
  // Add fields to formData
  Object.keys(templateData).forEach(key => {
    if (key === 'thumbnail' && templateData[key]) {
      formData.append('thumbnail', templateData[key]);
    } else {
      formData.append(key, templateData[key]);
    }
  });
  
  try {
    const response = await axios.post(`${API_URL}/templates`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding template:', error);
    throw error;
  }
};

export const updateAndDeploy = async (deployData) => {
  const formData = new FormData();
  
  // Add fields to formData
  Object.keys(deployData).forEach(key => {
    if (key === 'logo' && deployData[key]) {
      formData.append('logo', deployData[key]);
    } else {
      formData.append(key, deployData[key]);
    }
  });
  
  try {
    const response = await axios.post(`${API_URL}/deploy`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deploying site:', error);
    throw error;
  }
};