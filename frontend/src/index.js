import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Gallery from './components/gallery/Gallery';
import Editor from './components/editor/Editor';
import NewTemplateDialog from './components/newTemplateDialog/NewTemplateDialog';
import Login from './components/login/Login';

import { BrowserRouter, Switch, Route } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import AccountHistory from './components/accountHistory/AccountHistory';
import Meme from './components/Meme';

function Router() {
  return (
    <Switch>

      <Route path="/login">
        <Login />
      </Route>

      <Route path="/editor/:id">
        <Editor />
      </Route>

      <Route path="/editor">
        <Editor />
      </Route>

      <Route path="/history/:id">
        <AccountHistory />
      </Route>

      <Route path="/history">
        <AccountHistory />
      </Route>

      <Route path="/newtemplate">
        <NewTemplateDialog />
      </Route>

      <Route path="/meme/:id">
          <Meme />
      </Route>

      <Route path="/:id">
        <Gallery />
      </Route>

      <Route path="/">
        <Gallery />
      </Route>

    </Switch>
  );
}

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <Router />
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
