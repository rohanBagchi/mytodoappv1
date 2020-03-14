import React from 'react'
import { Layout, Button } from 'antd';

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

export default function Header() {
  const identity = useIdentityContext()
  const name = identity?.user?.user_metadata?.full_name || 'NoName';
  
  const isLoggedIn = identity?.isLoggedIn;
  return (
    <StyledHeader>
      <Greeting> hello {name}!</Greeting>

      <Button onClick={() => identity.logoutUser()}>
        LOG OUT
      </Button>
    </StyledHeader>
  )
}
