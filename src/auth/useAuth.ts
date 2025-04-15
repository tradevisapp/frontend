import { useAuth0 } from '@auth0/auth0-react';

export const useAuth = () => {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    user,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  const logoutWithRedirect = () => 
    logout({ logoutParams: { returnTo: window.location.origin } });

  return {
    isAuthenticated,
    user,
    loading: isLoading,
    login: loginWithRedirect,
    logout: logoutWithRedirect,
    getAccessToken: getAccessTokenSilently,
  };
}; 