import React from 'react';
import './App.css';
import { IdentityContextProvider } from 'react-netlify-identity-widget'
import 'react-netlify-identity-widget/styles.css'
import Todos from 'domains/Todos';
import { Layout } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import ProtectedView from './ProtectedView';
import { StyledContent } from 'CommonStyles';

function App() {
  const url = process.env.REACT_APP_NETLIFY_IDENTITY_URL // should look something like "https://foo.netlify.com"
  if (!url)
    throw new Error(
      'process.env.REACT_APP_NETLIFY_IDENTITY_URL is blank2, which means you probably forgot to set it in your Netlify environment variables',
    )

  return (
    <IdentityContextProvider url={url}>
        <Router>
          <Layout style={{ height: "100vh" }}>
            <ProtectedView>
              <StyledContent>
                <Todos />
              </StyledContent>
            </ProtectedView>
          </Layout>
        </Router>
    </IdentityContextProvider>
  );
}

export default App;
