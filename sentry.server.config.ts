// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

import { beforeBreadcrumb, beforeSend } from "@/lib/sentry-scrubber";

Sentry.init({
  dsn: "https://9ebd334db989de6480ee11e6c44ad221@o4508775095140352.ingest.us.sentry.io/4508810560798720",

  // Sample 10% of traces in production.
  tracesSampleRate: 0.1,

  beforeSend,
  beforeBreadcrumb,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
