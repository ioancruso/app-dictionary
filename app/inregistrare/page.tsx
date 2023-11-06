import {Button} from "@/components/button/button";

import {cookies} from "next/headers";
import {createClient} from "@/utilities/supabase/server";

import Redirect from "@/utilities/redirect/redirect";

import RegForm from "./regForm";
import styles from "./page.module.scss";

async function register(formData: FormData) {
    "use server";

    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {error} = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return {error: {message: error.message}};
    }
    return {error: null};
}

export default async function Inregistrare() {
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
        <div className={styles.registerPage}>
            {!logged ? (
                <>
                    <h2>Înregistrează-te</h2>
                    <RegForm register={register} />
                    <div className={styles.login}>
                        <h2>Ai deja cont?</h2>
                        <Button text="Loghează-te" href="/autentificare" />
                    </div>
                </>
            ) : (
                <Redirect logged={logged} source="înregistrare" path="/" />
            )}
        </div>
    );
}
