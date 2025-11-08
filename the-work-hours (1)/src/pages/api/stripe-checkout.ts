import type { APIRoute } from 'astro'
import { stripe } from '../../../lib/stripe'

export const POST: APIRoute = async ({ request }) => {
    try {
        const { priceId, customerId } = await request.json()

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get('origin')}/cancel`,
        })

        return new Response(JSON.stringify({ sessionId: session.id }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Stripe checkout failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
