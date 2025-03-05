export const environment = {
  production: false,
  oauthConfig: {
    clientId: '175415323680-4t3u58105ihj3sk9di0er3kv70cf3arh.apps.googleusercontent.com',
    redirectUri: window.location.origin + '/callback',
  },
  // apiBaseUrl: window.location.origin.replace(/:\d+/, ':8080'), // Replace port with 8080
  // rsvpApiUrl: window.location.origin.replace(/:\d+/, ':8080') + '/rsvp', // Full URL for RSVP API
  // galaEventsApiUrl: window.location.origin.replace(/:\d+/, ':8080') + '/gala-event', // Full URL for Gala Events API
  // adminsApiUrl: window.location.origin.replace(/:\d+/, ':8080') + '/admins',
  apiBaseUrl: 'https://rajmanda-dev.com',
  rsvpApiUrl: 'https://rajmanda-dev.com' + '/rsvp',
  galaEventsApiUrl: 'https://rajmanda-dev.com' + '/gala-event',
  adminsApiUrl: 'https://rajmanda-dev.com' + '/admins',
};
