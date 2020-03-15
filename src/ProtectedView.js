import React from 'react'
import { IdentityModal, useIdentityContext } from 'react-netlify-identity-widget'
import { Layout, Button } from 'antd';
import styled from 'styled-components';
import { StyledContent } from 'CommonStyles';
import { ApolloProvider } from "react-apollo";
import { Init } from './InitApollo';

const { Header } = Layout;
const Greeting = styled.span`
  color: #ffffff;
`;

const StyledHeader = styled(Header)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default function ProtectedView(props) {
  const identity = useIdentityContext()
  const client = Init(identity);

  const [dialog, setDialog] = React.useState(false)
  const name = identity?.user?.user_metadata?.full_name || 'NoName';

  const isLoggedIn = identity?.isLoggedIn;

  const renderIdentityModal = () => (
    <IdentityModal
      showDialog={dialog}
      onCloseDialog={() => setDialog(false)}
      onLogin={(user) => console.log('hello ', user && user.user_metadata)}
      onSignup={(user) => console.log('welcome ', user && user.user_metadata)}
      onLogout={() => console.log('bye ', name)}
    />
  );

  if (isLoggedIn) return (
    <React.Fragment>
      <StyledHeader>
        <Greeting> hello {name}!</Greeting>

        <Button onClick={() => setDialog(true)}>
          LOG OUT
        </Button>
      </StyledHeader>
      <ApolloProvider client={client}>
        {props.children}
      </ApolloProvider>
      {renderIdentityModal()}
    </React.Fragment>
  )

  return (
    <StyledContent>
      <h1> hello! try logging in! </h1>
      <Button type="primary" onClick={() => setDialog(true)}>
        LOG IN
      </Button>
      {renderIdentityModal()}
    </StyledContent>
  );
}