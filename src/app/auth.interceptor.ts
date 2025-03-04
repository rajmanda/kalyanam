import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const oauthService = inject(OAuthService);

  const excludedUrls = [
    'https://accounts.google.com' // Example: Google authentication URL
  ];

  // Check if the request URL matches any of the excluded URLs
  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  if (isExcluded) {
    // If the request is to an excluded URL, pass it through without modification
    return next(req);
  }

  // Otherwise, add the Authorization header
  const token = oauthService.getAccessToken();
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
