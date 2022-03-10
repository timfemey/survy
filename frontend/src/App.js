import Header from "./Header";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CreatePoll from "./CreatePoll";
import ViewPoll from "./ViewPoll";
import React, { Suspense, lazy } from "react";
const Polls = lazy(() => import("./Polls"));

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Suspense fallback={<h2>Loading...</h2>}>
          <Route exact path="/" component={Polls} />
          <Route path="/polls/" component={CreatePoll} />
          <Route path="/poll/:poll" component={ViewPoll} />
        </Suspense>
      </Switch>
    </Router>
  );
}

export default App;
