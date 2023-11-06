import Link from "next/link";

import {createClient} from "@/utilities/supabase/server";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

import {Navbar} from "./components/Navbar";
import {SearchForm} from "./components/SearchForm";
import {ThemeSwitcher} from "./components/ThemeSwitcher";

import Logo from "@/svgs/logo";

import styles from "./header.module.scss";

export type LoggedStatus = "user" | "no";
export type theme = "light" | "dark";

export type HeaderProps = {
    theme: theme;
};

async function signOut() {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    await supabase.auth.signOut();

    redirect("/");
}

async function Header({theme}: HeaderProps) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
        data: {user},
    } = await supabase.auth.getUser();

    let logged: LoggedStatus = "no";

    if (user && user.role == "authenticated") {
        logged = "user";
    }

    return (
        <>
            <header className={styles.theheader}>
                <Link href="/" className={styles.logoLink}>
                    <Logo href="/" className={styles.logo} />
                </Link>
                <Navbar LoggedStatus={logged} signOut={signOut} />
                <SearchForm />
                <ThemeSwitcher theme={theme as theme} />
            </header>
        </>
    );
}

export {Header};
