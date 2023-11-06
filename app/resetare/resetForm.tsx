"use client";

import {useState} from "react";

import {Modal} from "@/components/modal/modal";
import {Button} from "@/components/button/button";

import styles from "./page.module.scss";

type ResetFormProps = {
    reset: (formData: FormData) => Promise<{error: any}>;
};

export default function ResetForm({reset}: ResetFormProps) {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<boolean | null>(null);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const {error} = await reset(formData);
        if (error) {
            setMessage("A apărut o eroare");
            setError(true);
        } else {
            setMessage("Verifică-ți email-ul pentru a reseta parola contul");
            setError(false);
        }
    }

    return (
        <>
            <form className={styles.resetForm} onSubmit={handleSubmit}>
                <label htmlFor="email-id">Adresa de email</label>
                <input
                    id="email-id"
                    name="email"
                    type="email"
                    placeholder="Introdu adresa de email"
                    required
                />
                <Button text="Resetare" type="submit" />
            </form>
            <Modal message={message} error={error} />
        </>
    );
}
