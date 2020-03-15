import React from 'react';
import './App.css';
import { IdentityContextProvider } from 'react-netlify-identity-widget'
import 'react-netlify-identity-widget/styles.css'
import Todos from 'domains/Todos';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Layout } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import ProtectedView from './ProtectedView';
import { StyledContent } from 'CommonStyles';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  uri: "https://hasura-app-with-netlify.herokuapp.com/v1/graphql",
  cache: new InMemoryCache(),
  request: (operation) => {
    const credentials = localStorage.getItem('gotrue.user')
    const user = credentials && JSON.parse(credentials);
    const token = user?.token?.access_token;
    console.log("token", token)

    operation.setContext({
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
  },
});

function App() {
  const url = process.env.REACT_APP_NETLIFY_IDENTITY_URL // should look something like "https://foo.netlify.com"
  if (!url)
    throw new Error(
      'process.env.REACT_APP_NETLIFY_IDENTITY_URL is blank2, which means you probably forgot to set it in your Netlify environment variables',
    )

  return (
    <IdentityContextProvider url={url}>
      <ApolloProvider client={client}>
        <Router>
          <Layout style={{ height: "100vh" }}>
            <ProtectedView>
              <StyledContent>
                <Todos />
              </StyledContent>
            </ProtectedView>
          </Layout>
        </Router>
      </ApolloProvider>
    </IdentityContextProvider>
  );
}

export default App;
