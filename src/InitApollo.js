import ApolloClient from "apollo-boost";
import { InMemoryCache } from 'apollo-cache-inmemory';

export const Init = (identity) => {
  const customFetch = (uri, options) => {
    const credentials = localStorage.getItem('gotrue.user')
    const user = credentials && JSON.parse(credentials);
    const access_token = user?.token?.access_token;
    const refresh_token = user?.token?.refresh_token;
    const tokenExpiresAt = user?.token?.expires_at;
  
    const hasTokenExpired = new Date() > new Date(tokenExpiresAt);
  
    return fetch(uri, options).then(response => response);
  }
  
  const client = new ApolloClient({
    uri: "https://hasura-app-with-netlify.herokuapp.com/v1/graphql",
    fetch: customFetch,
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

  return client;
};