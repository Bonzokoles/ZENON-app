import type { APIRoute } from 'astro'
import { supabase } from '../../../../lib/db'

export const GET: APIRoute = async () => {
    try {
        const { data: payments, error } = await supabase
            .from('payments')
            .select(`
        *,
        companies (
          name
        )
      `)
            .order('created_at', { ascending: false })

        if (error) throw error

        return new Response(JSON.stringify({ payments }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch payments' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
