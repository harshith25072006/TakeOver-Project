import "server-only";

import { z } from "zod";

// Central environment validation. Imported early (see src/instrumentation.ts) and by
// the auth-secret consumers, so a misconfigured deploy fails fast at startup instead
// of at the first request. DATABASE_URL and AUTH_SECRET are hard requirements; feature
// integrations (cron, Twilio, media URLs) degrade gracefully when their vars are unset.
const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),

  CRON_SECRET: z.string().min(1).optional(),
  ALLOWED_ORIGINS: z.string().optional(),

  APP_PUBLIC_URL: z.string().optional(),
  STORAGE_DRIVER: z.string().optional(),
  STORAGE_LOCAL_DIR: z.string().optional(),
  STORAGE_MAX_FILE_MB: z.string().optional(),

  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_WHATSAPP_NUMBER: z.string().optional(),

  // AiSensy: template-based WhatsApp campaigns (rent reminders, complaint-resolved
  // notices, credential delivery) — separate from Twilio, which only handles the
  // invoice PDF media message.
  AISENSY_API_KEY: z.string().optional(),
  AISENSY_CAMPAIGN_RENT_REMINDER: z.string().optional(),
  AISENSY_CAMPAIGN_COMPLAINT_RESOLVED: z.string().optional(),
  AISENSY_CAMPAIGN_CREDENTIALS: z.string().optional(),

  // Exotel: outbound AI/test calling. CALLER_ID is the purchased ExoPhone shown as
  // caller ID; without it the API rejects every call attempt. APP_ID is the App
  // Bazaar app id for the Greeting->Hangup Flow that plays the dynamic greeting
  // (see src/config/env.ts) — Exotel calls connect to a pre-built flow, not
  // directly to our server, so this can't be hardcoded.
  EXOTEL_ACCOUNT_SID: z.string().optional(),
  EXOTEL_API_KEY: z.string().optional(),
  EXOTEL_API_TOKEN: z.string().optional(),
  EXOTEL_SUBDOMAIN: z.string().optional(),
  EXOTEL_CALLER_ID: z.string().optional(),
  EXOTEL_APP_ID: z.string().optional(),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${details}`);
  }
  return parsed.data;
}

export const env = loadEnv();
