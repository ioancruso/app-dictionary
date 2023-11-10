import {cookies} from "next/headers";
import {redirect} from "next/navigation";

import {createClient} from "@/utilities/supabase/server";
import ResetForm from "./resetForm";

import Redirect from "@/utilities/redirect/redirect";

import styles from "./page.module.scss";

interface ResetResult {
    error: Error | null;
}

async function reset(formData: FormData): Promise<ResetResult> {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const email = String(formData.get("email"));

    try {
        await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "https://localhost:3000/schimba/route",
        });
    } catch (error) {
        return {error: error as Error};
    }
    return {error: null};
}

export default async function Resetare() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
        data: {user},
    } = await supabase.auth.getUser();

    let logged: boolean = false;

    if (user && user.role == "authenticated") {
        logged = true;
    }

    return (
        <div className={styles.resetPage}>
            {!logged ? (
                <>
                    <h2>Resetare parolă</h2>
                    <ResetForm reset={reset} />
                </>
            ) : (
                <Redirect logged={logged} source="resetare parolă" path="/" />
            )}
        </div>
    );
}
