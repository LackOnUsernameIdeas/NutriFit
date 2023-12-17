import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./polyfills";
import "./assets/base.scss";
import Main from "./DemoPages/Main";
import configureStore from "./config/configureStore";
import * as serviceWorker from "./serviceWorker";

const store = configureStore();
const rootElement = document.getElementById("root");

const renderApp = (Component: React.ComponentType) => (
  <Provider store={store}>
    <HashRouter>
      <Component />
    </HashRouter>
  </Provider>
);

const root = createRoot(rootElement).render(renderApp(Main));

if (module.hot) {
  module.hot.accept("./DemoPages/Main", () => {
    const NextApp = require("./DemoPages/Main").default;
    root.render(renderApp(NextApp));
  });
}
serviceWorker.unregister();

