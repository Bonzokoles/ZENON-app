import type { APIRoute } from 'astro'
import { supabase } from '../../../../lib/db'

export const GET: APIRoute = async () => {
    try {
        const { count: totalUsers, error: usersError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true })

        const { count: totalCompanies, error: companiesError } = await supabase
            .from('companies')
            .select('*', { count: 'exact', head: true })

        const { count: activeSessions, error: sessionsError } = await supabase
            .from('work_sessions')
            .select('*', { count: 'exact', head: true })
            .is('end_time', null)

        if (usersError || companiesError || sessionsError) {
            throw new Error('Failed to fetch stats')
        }

        return new Response(JSON.stringify({
            stats: {
                totalUsers,
                totalCompanies,
                activeSessions
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch stats' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
