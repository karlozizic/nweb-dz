import React from 'react';
import './App.css';
import {BrowserRouter, HashRouter, Route, Routes} from "react-router-dom";
import GiftCardsPage from "./GiftCardsPage";
import GenerateGiftCardPage from "./GenerateGiftCardPage";
import GiftCardPage from "./GiftCardPage";
import {Auth0Provider} from "@auth0/auth0-react";

function App() {
  return (
      <Auth0Provider
          domain={process.env.REACT_APP_AUTH0_DOMAIN!}
          clientId={process.env.REACT_APP_AUTH0_USER_AUTH_CLIENT_ID!}
          authorizationParams={{
              redirect_uri: window.location.origin,
              audience: process.env.REACT_APP_AUTH0_AUDIENCE
          }}
          useRefreshTokens={true}
          cacheLocation="localstorage"
          onRedirectCallback={(appState) => {
              if (appState?.returnTo) {
                  window.location.hash = appState.returnTo;
              }
          }}
      >

          <HashRouter>
            <Routes>
                <Route path="/" element={<GiftCardsPage />} />
                <Route path="/generateGiftCard" element={<GenerateGiftCardPage />} />
                <Route path="/giftCard/:id" element={<GiftCardPage/>} />
                <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </HashRouter>
      </Auth0Provider>
  );
}

export default App;
