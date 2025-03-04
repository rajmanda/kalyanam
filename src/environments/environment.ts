export const environment = {
  production: true,
  oauthConfig: {
    clientId: '175415323680-4t3u58105ihj3sk9di0er3kv70cf3arh.apps.googleusercontent.com',
    redirectUri: window.location.origin + '/callback',
  },
  adminEmails: ['raj.manda@gmail.com', 'msvram@gmail.com'], // Add admin
  apiBaseUrl: window.location.origin, // Base URL for APIs
  rsvpApiUrl: window.location.origin + '/rsvp', // Full URL for RSVP API
  galaEventsApiUrl: window.location.origin + '/gala-event', // Full URL for Gala Events API
  adminsApiUrl: window.location.origin + '/admins',
};
