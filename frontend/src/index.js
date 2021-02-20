import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Gallery from './components/gallery/Gallery';
import Editor from './components/editor/Editor';
import NewTemplateDialog from './components/newTemplateDialog/NewTemplateDialog';
import Login from './components/login/Login';

import {
    BrowserRouter,
    Switch,
    Route
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';



function Router() {
    return (
        <Switch>
            
            <Route path="/gallery/:id">
                <Gallery />
            </Route>

            <Route path="/gallery">
                <Gallery />
            </Route>

            <Route path="/editor">
                <Editor />
            </Route>

            <Route path="/newtemplate">
                <NewTemplateDialog />
            </Route>

            <Route path="/login">
                <Login />
            </Route>

            {/* Note how these two routes are ordered. The more specific
        path="/contact/:id" comes before path="/contact" so that
        route will render when viewing an individual contact
            <Route path="/contact/:id">
                <Contact />
            </Route>
            <Route path="/contact">
                <AllContacts />
            </Route>

            <Route path="/gallery">
                <Gallery />
            </Route>

            <Route path="/:id">
                <Gallery />
            </Route>
            */}

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
