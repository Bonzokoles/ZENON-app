import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    role: 'super-admin' | 'admin' | 'employer' | 'employee'
                    company_id: string | null
                    created_at: string
                    trial_end_date: string | null
                }
            }
            companies: {
                Row: {
                    id: string
                    name: string
                    subscription_status: 'active' | 'trial' | 'inactive'
                    created_at: string
                }
            }
            work_sessions: {
                Row: {
                    id: string
                    user_id: string
                    start_time: string
                    end_time: string | null
                    duration: number | null
                    created_at: string
                }
            }
            payments: {
                Row: {
                    id: string
                    company_id: string
                    amount: number
                    status: string
                    stripe_payment_id: string
                    created_at: string
                }
            }
        }
    }
}
