import {cookies} from "next/headers";
import {createClient} from "@/utilities/supabase/server";

import Redirect from "@/utilities/redirect/redirect";

import Good from "@/svgs/good";

import styles from "./page.module.scss";
import {redirect} from "next/navigation";

interface ConfirmResult {
    error: Error | null;
}

async function confirm(code: string): Promise<ConfirmResult> {
    "use server";

    if (code) {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);
        try {
            await supabase.auth.exchangeCodeForSession(code);
        } catch (error) {
            return {error: error as Error};
        }
    }
    return {error: null};
}

export default async function Confirmare({
    searchParams,
}: {
    searchParams: {code: string};
}) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const code = searchParams.code;

    const {
        data: {user},
    } = await supabase.auth.getUser();

    let logged: boolean = false;

    if (user && user.role == "authenticated") {
        logged = true;
    }

    let error: Error | null = null;

    if (!logged) {
        const confirmResult = await confirm(code);
        error = confirmResult.error;
        setTimeout(() => {
            redirect("/autentificare");
        }, 5000);
    }

    return (
        <div className={styles.confirmPage}>
            {error || !code ? (
                <div className={styles.error}>
                    <Redirect
                        path="/"
                        custom="Poți accesa pagina doar prin link-ul primit pe
                        email, doar o dată, la crearea contului."
                    />
                </div>
            ) : (
                <>
                    <Good />
                    <h2>Contul tău a fost confirmat cu succes.</h2>
                    <h3>Vei fi redirecționat către pagina de autentificare.</h3>
                </>
            )}
        </div>
    );
}
