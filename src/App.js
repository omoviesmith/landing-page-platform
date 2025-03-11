import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TemplateSelector from './components/TemplateSelector';
import TemplateEditor from './components/TemplateEditor';
import AdminConsole from './components/AdminConsole';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/templates/:category" element={<TemplateSelector />} />
        <Route path="/edit/:category/:templateId" element={<TemplateEditor />} />
        <Route path="/admin" element={<AdminConsole />} />
      </Routes>
    </Router>
  );
}

export default App;