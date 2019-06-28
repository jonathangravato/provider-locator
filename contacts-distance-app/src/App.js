import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProviderSearch from './components/ProviderSearch';
import NotFound from './components/NotFound';

function App() {

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={ProviderSearch} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );

}

export default App;
