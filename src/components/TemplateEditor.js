import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { fetchTemplate, updateAndDeploy } from '../services/api';

const validationSchema = Yup.object({
  businessName: Yup.string().required('Business name is required'),
  tagline: Yup.string().required('Tagline is required'),
  description: Yup.string().required('Description is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

function TemplateEditor() {
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deployUrl, setDeployUrl] = useState('');
  const [deploying, setDeploying] = useState(false);
  const { category, templateId } = useParams();

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const data = await fetchTemplate(category, templateId);
        setTemplate(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading template:', error);
        setLoading(false);
      }
    };

    loadTemplate();
  }, [category, templateId]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setDeploying(true);
    try {
      const { url } = await updateAndDeploy({
        category,
        templateId,
        ...values,
      });
      setDeployUrl(url);
    } catch (error) {
      console.error('Error deploying site:', error);
    }
    setDeploying(false);
    setSubmitting(false);
  };

  if (loading) return <div>Loading editor...</div>;
  if (!template) return <div>Template not found</div>;

  return (
    <div className="template-editor">
      <h1>Customize Your {category} Template</h1>
      
      <div className="editor-container">
        <div className="form-section">
          <Formik
            initialValues={{
              businessName: '',
              tagline: '',
              description: '',
              phoneNumber: '',
              email: '',
              logo: null,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue }) => (
              <Form>
                <div className="form-group">
                  <label htmlFor="businessName">Business Name</label>
                  <Field id="businessName" name="businessName" className="form-control" />
                  {errors.businessName && touched.businessName ? <div className="error">{errors.businessName}</div> : null}
                </div>

                <div className="form-group">
                  <label htmlFor="tagline">Tagline</label>
                  <Field id="tagline" name="tagline" className="form-control" />
                  {errors.tagline && touched.tagline ? <div className="error">{errors.tagline}</div> : null}
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <Field as="textarea" id="description" name="description" className="form-control" />
                  {errors.description && touched.description ? <div className="error">{errors.description}</div> : null}
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <Field id="phoneNumber" name="phoneNumber" className="form-control" />
                  {errors.phoneNumber && touched.phoneNumber ? <div className="error">{errors.phoneNumber}</div> : null}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <Field id="email" name="email" type="email" className="form-control" />
                  {errors.email && touched.email ? <div className="error">{errors.email}</div> : null}
                </div>

                <div className="form-group">
                  <label htmlFor="logo">Logo</label>
                  <input
                    id="logo"
                    name="logo"
                    type="file"
                    onChange={(event) => {
                      setFieldValue("logo", event.currentTarget.files[0]);
                    }}
                    className="form-control"
                  />
                </div>
                
                <button type="submit" className="btn btn-primary" disabled={deploying}>
                  {deploying ? 'Deploying...' : 'Update & Deploy'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
        
        <div className="preview-section">
          <h3>Template Preview</h3>
          <iframe src={template.previewUrl} title="Template Preview" className="template-preview"></iframe>
        </div>
      </div>

      {deployUrl && (
        <div className="deploy-info">
          <h3>Deployment Successful!</h3>
          <p>Your landing page is available at:</p>
          <a href={deployUrl} target="_blank" rel="noopener noreferrer">{deployUrl}</a>
        </div>
      )}
    </div>
  );
}

export default TemplateEditor;