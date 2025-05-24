import { createContext, useContext, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

const SupabaseContext = createContext();

export function SupabaseProvider({ children }) {
    const supabase = useMemo(() => createClient(
        'https://ijanmngvdcnnwluymjue.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqYW5tbmd2ZGNubndsdXltanVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NjAzMjEsImV4cCI6MjA2MzEzNjMyMX0.nIj3t--LXw9ZiCQwmeb-_ljjykI7TKGY3wtIHIQA4JA'
    ), []);

    return (
        <SupabaseContext.Provider value={{ supabase }}>
            {children}
        </SupabaseContext.Provider>
    );
}

export function useSupabase() {
    return useContext(SupabaseContext);
}