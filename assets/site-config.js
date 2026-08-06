/**
 * LocalGovy site config — fill these in, then they appear site-wide.
 * phoneDisplay: human-readable, e.g. "(416) 555-1234"
 * phoneHref:    "tel:+14165551234"
 * ga4:          Measurement ID from analytics.google.com, e.g. "G-XXXXXXXXXX"
 *
 * Demo factory intake (lg_agent): public anon key is safe in the browser; never put the
 * service_role key here. Edge CORS must allow https://localgovy.com (INTAKE_CORS_ORIGIN).
 */
window.LG = {
  email: 'noah@localgovy.com',
  phoneDisplay: '(978) 493-3736',
  phoneHref: 'tel:+19784933736',
  ga4: 'G-ZGY68NEY5N',
  // Factory control plane (Supabase project lg_agent / vyeurfhklejrfkbvxgjo)
  intakeUrl: 'https://vyeurfhklejrfkbvxgjo.supabase.co/functions/v1/intake',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5ZXVyZmhrbGVqcmZrYnZ4Z2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU2MTM0NzAsImV4cCI6MjEwMTE4OTQ3MH0.1Zgk52aJ7p47MTyOVP2aYL8X7nUJ6k9KRNvCVPKnCOs',
  // Optional: still email the inbox after a successful factory booking
  notifyFormSubmit: true,
  formSubmitUrl: 'https://formsubmit.co/ajax/noah@localgovy.com',
};
