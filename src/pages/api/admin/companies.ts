import type { APIRoute } from 'astro'
import { supabase } from '../../../../lib/db'

export const GET: APIRoute = async () => {
    try {
        const { data: companies, error } = await supabase
            .from('companies')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return new Response(JSON.stringify({ companies }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch companies' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const { name } = await request.json()

        const { data, error } = await supabase
            .from('companies')
            .insert([{ name, subscription_status: 'trial' }])
            .select()
            .single()

        if (error) throw error

        return new Response(JSON.stringify({ company: data }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create company' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
