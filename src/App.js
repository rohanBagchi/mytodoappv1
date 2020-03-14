import React from 'react';
import './App.css';
import { IdentityContextProvider } from 'react-netlify-identity-widget'
import 'react-netlify-identity-widget/styles.css'
import Todos from './Todos';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Layout } from 'antd';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import ProtectedView from './ProtectedView';

const { Header, Content } = Layout;

const client = new ApolloClient({
  uri: "https://hasura-app-with-netlify.herokuapp.com/v1/graphql",

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
  }
});

const StyledContent = styled(Content)`
  padding: 0 50px;
`;

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
            <StyledContent>
              <ProtectedView>
                <Todos />
              </ProtectedView>
            </StyledContent>
          </Layout>
        </Router>
      </ApolloProvider>
    </IdentityContextProvider>
  );
}

export default App;
