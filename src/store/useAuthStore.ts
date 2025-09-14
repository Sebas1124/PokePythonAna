import { create } from "zustand";
import { type Session, type User } from '@supabase/supabase-js';
import { supabase } from "../config/supabase";

interface AuthState {
    session: Session | null;
    user: User | null;
    loading: boolean;
    initialize: () => void;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    user: null,
    loading: true,
    initialize: () => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            set({ session, user: session?.user ?? null, loading: false });
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            set({ session, user: session?.user ?? null });
        });
    },
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error);
        }
    },
}));