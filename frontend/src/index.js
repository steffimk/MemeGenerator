import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Gallery from './components/gallery/Gallery'
import {
    BrowserRouter,
    Switch,
    Route
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';



function Router() {
    return (
        <div>
            <Switch>
                {/* If the current URL is /about, this route is rendered
            while the rest are ignored */}
                <Route path="/gallery">
                    <Gallery />
                </Route>

                <Route path="/editor">
                    <App />
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

                */}

                {/* If none of the previous routes render anything,
            this route acts as a fallback.

            Important: A route with path="/" will *always* match
            the URL because all URLs begin with a /. So that's
            why we put this one last of all */}
                <Route path="/">
                    <App />
                </Route>
            </Switch>
        </div>
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
