/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_SUPABASE_URL: string
    readonly PUBLIC_SUPABASE_ANON_KEY: string
    readonly STRIPE_SECRET_KEY: string
    readonly PUBLIC_STRIPE_MONTHLY_PRICE_ID: string
    readonly PUBLIC_STRIPE_ANNUAL_PRICE_ID: string
    readonly STRIPE_WEBHOOK_SECRET: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
