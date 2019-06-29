import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProviderSearch from './components/ProviderSearch';
import SearchPromAll from './components/SearchPromAll';
import ProviderCard from './components/ProviderCard';
import NotFound from './components/NotFound';

function App() {

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={ProviderSearch} />
          <Route exact path="/promall" component={SearchPromAll} />
          <Route exact path="/card" component={ProviderCard} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );

}

export default App;
