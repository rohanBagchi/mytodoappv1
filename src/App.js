import React from 'react';
import logo from './logo.svg';
import './App.css';
import { IdentityContextProvider } from 'react-netlify-identity-widget'
import 'react-netlify-identity-widget/styles.css'
import AuthStatusView from './AuthStatusView';

function App() {
  const url = process.env.REACT_APP_NETLIFY_IDENTITY_URL // should look something like "https://foo.netlify.com"
  if (!url)
    throw new Error(
      'process.env.REACT_APP_NETLIFY_IDENTITY_URL is blank2, which means you probably forgot to set it in your Netlify environment variables',
    )

  return (
    <IdentityContextProvider url={url}>
      <div className="App">
        <AuthStatusView />
      </div>
    </IdentityContextProvider>
  );
}

export default App;
