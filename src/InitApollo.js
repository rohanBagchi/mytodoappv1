import ApolloClient from "apollo-boost";
import { InMemoryCache } from 'apollo-cache-inmemory';

let identity;

const forceReload = () => window.location.reload();

export const Init = (identity2) => {
  identity = identity2;

  const customFetch = (uri, options) => {
    const credentials = localStorage.getItem('gotrue.user')
    if (!credentials) {
      forceReload();
    }

    const user = credentials && JSON.parse(credentials);
    const tokenExpiresAt = user?.token?.expires_at;
  
    const hasTokenExpired = new Date() > new Date(tokenExpiresAt);
    
    if (!hasTokenExpired) {
      return identity
        .getFreshJWT()
        .then(r => {
          return fetch(uri, options).then(response => response);
        })
        .catch(e => {
          identity.logoutUser();
        });
    } else {
      return fetch(uri, options).then(response => response);
    }
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