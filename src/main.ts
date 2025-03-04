import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideOAuthClient } from 'angular-oauth2-oidc';
import { OAuthService } from 'angular-oauth2-oidc';
import { appConfig } from './app/app.config';
import { authConfig } from './app/auth-config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/auth.interceptor'; // Adjust the import path as necessary

// Function to configure OAuth
function configureOAuth(oauthService: OAuthService) {
  oauthService.configure(authConfig);
  oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
    if (!oauthService.hasValidAccessToken()) {
      oauthService.initLoginFlow();
    }
  });
}

// Merge appConfig with additional providers
const combinedConfig = {
  ...appConfig, // Spread existing appConfig
  providers: [
    ...(appConfig.providers || []), // Include existing providers from appConfig
    provideOAuthClient(), // Add OAuth client provider
    {
      provide: 'OAuthInit',
      useFactory: configureOAuth,
      deps: [OAuthService],
    },
    provideHttpClient(withInterceptors([authInterceptor])), // Register the functional interceptor
  ],
};

// Bootstrap the application with the combined configuration
bootstrapApplication(AppComponent, combinedConfig).catch((err) =>
  console.error(err)
);
