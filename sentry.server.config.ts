// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
if (process.env.ENV === 'production') {
  Sentry.init({
    dsn: 'https://269d5cf7578302cf8cec08ed87db380a@o323538.ingest.sentry.io/4506044249669632',

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  })
}
