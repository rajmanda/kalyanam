export const environment = {
  production: true,
  oauthConfig: {
    clientId: '175415323680-4t3u58105ihj3sk9di0er3kv70cf3arh.apps.googleusercontent.com',
    redirectUri: window.location.origin + '/callback',
  },
  apiBaseUrl: window.location.origin,
  rsvpApiUrl: window.location.origin + '/rsvp',
  galaEventsApiUrl: window.location.origin + '/gala-event',
  adminsApiUrl: window.location.origin + '/admins',
  fileUploadApiUrl: window.location.origin + '/upload',
};
