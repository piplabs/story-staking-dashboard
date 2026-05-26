// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

import { beforeBreadcrumb, beforeSend } from "@/lib/sentry-scrubber";

Sentry.init({
  dsn: "https://9ebd334db989de6480ee11e6c44ad221@o4508775095140352.ingest.us.sentry.io/4508810560798720",

  // Session Replay captures DOM, inputs, and network metadata. Mask every
  // text node and input, block media entirely, so wallet addresses and stake
  // amounts are not exfiltrated even if a session is recorded.
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
    }),
  ],

  // Sample 10% of traces in production. 100% was a Sentry-init default and
  // produces wallet-activity-level volume from every dashboard session.
  tracesSampleRate: 0.1,

  // Disable random session recording entirely. Replays now happen only when
  // the page hits an error, which keeps the volume small and avoids
  // capturing routine wallet flows.
  replaysSessionSampleRate: 0,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  beforeSend,
  beforeBreadcrumb,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
