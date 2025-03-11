import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TemplateSelector from './components/TemplateSelector';
import TemplateEditor from './components/TemplateEditor';
import AdminConsole from './components/AdminConsole';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/templates/:category" component={TemplateSelector} />
        <Route path="/edit/:category/:templateId" component={TemplateEditor} />
        <Route path="/admin" component={AdminConsole} />
      </Switch>
    </Router>
  );
}

export default App;