import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { addTemplate } from '../services/api';

const validationSchema = Yup.object({
  name: Yup.string().required('Template name is required'),
  category: Yup.string().required('Category is required'),
  htmlContent: Yup.string().required('HTML content is required'),
});

function AdminConsole() {
  const [addSuccess, setAddSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await addTemplate(values);
      setAddSuccess(true);
      setError('');
      resetForm();
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding template:', error);
      setError('Failed to add template. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="admin-console">
      <h1>Admin Console - Add New Template</h1>
      
      {addSuccess && <div className="success-message">Template added successfully!</div>}
      {error && <div className="error-message">{error}</div>}
      
      <Formik
        initialValues={{
          name: '',
          category: '',
          description: '',
          htmlContent: '',
          thumbnail: null,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form>
            <div className="form-group">
              <label htmlFor="name">Template Name</label>
              <Field id="name" name="name" className="form-control" />
              {errors.name && touched.name ? <div className="error">{errors.name}</div> : null}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <Field as="select" id="category" name="category" className="form-control">
                <option value="">Select Category</option>
                <option value="Roofing">Roofing</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Painting">Painting</option>
                <option value="Landscaping">Landscaping</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
              </Field>
              {errors.category && touched.category ? <div className="error">{errors.category}</div> : null}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <Field as="textarea" id="description" name="description" className="form-control" />
            </div>

            <div className="form-group">
              <label htmlFor="htmlContent">HTML Content</label>
              <Field as="textarea" id="htmlContent" name="htmlContent" className="form-control code-editor" rows="15" />
              {errors.htmlContent && touched.htmlContent ? <div className="error">{errors.htmlContent}</div> : null}
            </div>

            <div className="form-group">
              <label htmlFor="thumbnail">Thumbnail Image</label>
              <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                onChange={(event) => {
                  setFieldValue("thumbnail", event.currentTarget.files[0]);
                }}
                className="form-control"
              />
            </div>
            
            <button type="submit" className="btn btn-primary">Add Template</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AdminConsole;