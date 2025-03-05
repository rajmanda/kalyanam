import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../../environments/environment';

export const authConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: environment.oauthConfig.redirectUri,
  clientId: environment.oauthConfig.clientId,
  scope: 'openid profile email',
  responseType: 'token id_token',
  showDebugInformation: true,
  useSilentRefresh: true,
  silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
  customQueryParams: { ux_mode: 'popup' }
};
