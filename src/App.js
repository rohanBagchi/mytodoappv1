import React from 'react';
import './App.css';
import { IdentityContextProvider } from 'react-netlify-identity-widget'
import 'react-netlify-identity-widget/styles.css'
import Todos from 'domains/Todos';
import { Layout } from 'antd';
import ProtectedView from './ProtectedView';
import { StyledContent } from 'CommonStyles';

function App() {
  const url = process.env.REACT_APP_NETLIFY_IDENTITY_URL
  if (!url)
    throw new Error(
      'process.env.REACT_APP_NETLIFY_IDENTITY_URL is blank2, which means you probably forgot to set it in your Netlify environment variables',
    )

  return (
    <IdentityContextProvider url={url}>
      <Layout style={{ height: "100vh" }}>
        <ProtectedView>
          <StyledContent>
            <Todos />
          </StyledContent>
        </ProtectedView>
      </Layout>
    </IdentityContextProvider>
  );
}

export default App;
