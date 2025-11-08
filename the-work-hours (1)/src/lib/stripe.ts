import Stripe from 'stripe'

export const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-11-20.acacia',
})

export const STRIPE_PRODUCTS = {
    MONTHLY_SUBSCRIPTION: {
        priceId: import.meta.env.PUBLIC_STRIPE_MONTHLY_PRICE_ID,
        name: 'Monthly Subscription',
    },
    ANNUAL_SUBSCRIPTION: {
        priceId: import.meta.env.PUBLIC_STRIPE_ANNUAL_PRICE_ID,
        name: 'Annual Subscription',
    },
}
