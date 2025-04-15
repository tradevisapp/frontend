export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || 'your-tenant-name.auth0.com',
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || 'your-client-id',
  audience: process.env.REACT_APP_AUTH0_AUDIENCE || 'https://your-api-identifier',
  redirectUri: window.location.origin,
}; 