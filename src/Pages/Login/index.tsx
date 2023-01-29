import React from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';

import { baseColor, LargeButton } from '../../styles';
import { loginState } from '../../states/loginState';
import { walletConnect } from '../../func';
import YellowBottomNavigator from '../../Components/YellowBottomNavigator';

import our from '../../images/our.svg';
import chive from '../../images/chive.svg';

const LoginPageContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 600px;

  display: flex;
  flex-direction: column;
`;

// need font and image

export const Login = () => {
  const nav = useNavigate();
  return (
    <LoginPageContainer style={{ backgroundColor: baseColor.yellow, height: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '35vh',
          marginBottom: 'auto',
        }}
      >
        <img src={our} alt="our" style={{ width: '280px', marginBottom: '20px' }} />
        <img src={chive} alt="chive" style={{ width: '280px' }} />
      </div>
      <YellowBottomNavigator>
        <LargeButton
          style={{ fontSize: '16px' }}
          onClick={() => {
            walletConnect();
            nav('/nickname');
          }}
        >
          Connect Wallet
        </LargeButton>
      </YellowBottomNavigator>
    </LoginPageContainer>
  );
};
