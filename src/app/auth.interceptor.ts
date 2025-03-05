import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc'; // Ensure this import matches your OAuth service

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('AuthInterceptor is processing request:', req);

  const oauthService = inject(OAuthService);

  const excludedUrls = [
    'https://accounts.google.com',     // Google authentication URL
    '.well-known/openid-configuration'
  ];

  // Check if the request URL matches any of the excluded URLs
  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  if (isExcluded) {
    console.log(`Request to excluded URL: ${req.url}. Passing through without modification.`);
    // If the request is to an excluded URL, pass it through without modification
    return next(req);
  }

  // Otherwise, add the Authorization header
  const token = oauthService.getIdToken();
  if (token) {
    console.log(`Adding Authorization header to request: ${req.url}`);
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('authReq', authReq) ;
    return next(authReq);
  } else {
    console.warn(`No access token available for request: ${req.url}`);
    // Optionally, handle the case where no token is available
    return next(req);
  }
};
