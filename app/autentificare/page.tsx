import {cookies} from "next/headers";
import {createClient} from "@/utilities/supabase/server";

import {Button} from "@/components/button/button";

import AuthForm from "./authForm";
import Redirect from "@/utilities/redirect/redirect";

import styles from "./page.module.scss";

async function login(formData: FormData) {
    "use server";
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {error} = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return {error: {message: error.message}};
    }
    return {error: null};
}

export default async function Autentificare() {
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
        <div className={styles.loginPage}>
            {!logged ? (
                <>
                    <h2>Autentifică-te</h2>
                    <AuthForm login={login} />
                    <div className={styles.register}>
                        <h2>Nu ai incă un cont?</h2>
                        <Button text="Înregistrează-te" href="/inregistrare" />
                    </div>
                </>
            ) : (
                <Redirect logged={logged} source="autentificare" path="/" />
            )}
        </div>
    );
}
