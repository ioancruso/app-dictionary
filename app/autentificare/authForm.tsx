"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

import {Modal} from "@/components/modal/modal";
import {Button} from "@/components/button/button";

import styles from "./page.module.scss";
import Link from "next/link";

type AuthFormProps = {
    login: (formData: FormData) => Promise<{error: any}>;
};

export default function AuthForm({login}: AuthFormProps) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [password, setPassword] = useState<string>("");

    const router = useRouter();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const {error} = await login(formData);
        if (error) {
            if (error.message == "Invalid login credentials") {
                setErrorMessage("Adresa de email și/sau parola sunt greșite");
            } else {
                setErrorMessage("A apărut o eroare");
            }
            setPassword("");
        } else {
            setErrorMessage(null);
            router.push("/");
        }
    }
    return (
        <>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <label htmlFor="email-id">Adresa de email</label>
                <input
                    id="email-id"
                    name="email"
                    type="email"
                    placeholder="Introdu adresa de email"
                    required
                />

                <label htmlFor="password-id">Parolă</label>
                <input
                    id="password-id"
                    name="password"
                    type="password"
                    placeholder="Introdu parola contului"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div className={styles.loginPassword}>
                    <Button text="Login" type="submit" />
                    <Link className={styles.forgotPassword} href="/resetare">
                        Ai uitat parola?
                    </Link>
                </div>
            </form>
            <Modal message={errorMessage} error={errorMessage ? true : null} />
        </>
    );
}
