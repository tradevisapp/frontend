import React from 'react';
import { Auth0Provider as Auth0ProviderBase } from '@auth0/auth0-react';
import { auth0Config } from './auth0-config';

interface Auth0ProviderProps {
  children: React.ReactNode;
}

export const Auth0Provider: React.FC<Auth0ProviderProps> = ({ children }) => {
  return (
    <Auth0ProviderBase
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
      }}
    >
      {children}
    </Auth0ProviderBase>
  );
}; 