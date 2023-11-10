"use client";

import {useState} from "react";

import {Modal} from "@/components/modal/modal";
import {Button} from "@/components/button/button";

import styles from "./page.module.scss";

type ResetFormProps = {
    change: (formData: FormData) => Promise<{error: any}>;
};

export default function ChangeForm({change}: ResetFormProps) {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<boolean | null>(null);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const {error} = await change(formData);
        if (error) {
            setMessage("A apărut o eroare");
            setError(true);
        } else {
            setMessage("Parola a fost schimbată cu succes");
            setError(false);
        }
    }

    return (
        <>
            <form className={styles.changeForm} onSubmit={handleSubmit}>
                <label htmlFor="email">Parola nouă</label>
                <input
                    name="password"
                    type="password"
                    placeholder="Introdu noua parolă pentru contul tău"
                    required
                />
                <Button text="Schimbă" type="submit" />
            </form>
            <Modal message={message} error={error} />
        </>
    );
}
