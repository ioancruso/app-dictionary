"use client";

import {useState} from "react";

import {Button} from "@/components/button/button";
import {Modal} from "@/components/modal/modal";

import styles from "./page.module.scss";

type RegFormProps = {
    register: (formData: FormData) => Promise<{error: any}>;
};

export default function AuthForm({register}: RegFormProps) {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<boolean | null>(null);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [alert, setAlert] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (alert) {
            return;
        }
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const {error} = await register(formData);
        if (error) {
            setMessage("A apărut o eroare");
            console.log(error);
            setError(true);
        } else {
            setMessage("Verifică-ți email-ul pentru a confirma contul");
            setError(false);
            setUsername("");
            setEmail("");
            setPassword("");
        }
    }

    function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);

        if (!event.target.value.match(/^[a-zA-Z0-9]*$/)) {
            setAlert(true);
        } else {
            setAlert(false);
        }
    }

    return (
        <>
            <div className={`${styles.info} ${alert ? styles.infoAlert : ""}`}>
                * numele de utilizator poate fi format doar din litere și cifre
            </div>

            <form
                onSubmit={handleSubmit}
                className={styles.registerForm}
                autoComplete="off"
            >
                <label htmlFor="username-id">Nume de utilizator</label>
                <input
                    id="username-id"
                    name="username-register"
                    type="text"
                    placeholder="Introdu numele de utilizator"
                    required
                    minLength={5}
                    maxLength={18}
                    pattern="[a-zA-Z0-9]+"
                    autoComplete="off"
                    className={alert ? styles.invalid : ""}
                    value={username}
                    onChange={onInputChange}
                />

                <label htmlFor="email-id">Email</label>
                <input
                    id="email-id"
                    name="email-register"
                    type="email"
                    placeholder="Introdu adresa de email"
                    required
                    minLength={5}
                    maxLength={60}
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="password-id">Parolă</label>
                <input
                    id="password-id"
                    name="password-register"
                    type="password"
                    placeholder="Introdu parola"
                    required
                    minLength={6}
                    maxLength={20}
                    autoComplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button text="Creează Cont" type="submit" />
            </form>

            <Modal message={message} error={error} />
        </>
    );
}
