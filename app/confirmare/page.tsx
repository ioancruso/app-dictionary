import {cookies} from "next/headers";
import {createClient} from "@/utilities/supabase/server";

import Redirect from "@/utilities/redirect/redirect";

import Good from "@/svgs/good";

import styles from "./page.module.scss";
import {redirect} from "next/navigation";

export default async function Confirmare({
    searchParams,
}: {
    searchParams: {eroare: string};
}) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const error = searchParams.eroare;

    const {
        data: {user},
    } = await supabase.auth.getUser();

    let logged: boolean = false;

    if (user && user.role == "authenticated") {
        logged = true;
    }

    return (
        <div className={styles.confirmPage}>
            {(logged && error !== "nu") || !logged ? (
                <div className={styles.error}>
                    <Redirect
                        path="/"
                        custom="Poți accesa pagina doar prin link-ul primit pe
                        email, doar o dată, la crearea contului."
                    />
                </div>
            ) : (
                <>
                    <Redirect
                        error={false}
                        path="/"
                        custom="Contul tău a fost confirmat cu succes."
                    />
                </>
            )}
        </div>
    );
}
