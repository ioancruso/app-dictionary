import {cookies} from "next/headers";
import {redirect} from "next/navigation";

import {createClient} from "@/utilities/supabase/server";
import ResetForm from "./changeForm";

import Redirect from "@/utilities/redirect/redirect";

import styles from "./page.module.scss";

interface ResetResult {
    error: Error | null;
}

async function change(formData: FormData): Promise<ResetResult> {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const password = String(formData.get("password"));

    try {
        await supabase.auth.updateUser({
            password: password,
        });
    } catch (error) {
        return {error: error as Error};
    }
    return {error: null};
}

export default async function Schimba() {
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
        <div className={styles.changePage}>
            {logged ? (
                <>
                    <h2>Schimbare parolă</h2>
                    <ResetForm change={change} />
                </>
            ) : (
                <Redirect logged={logged} source="resetare parolă" path="/" />
            )}
        </div>
    );
}
