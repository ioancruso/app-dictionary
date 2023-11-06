"use client";

import {useState} from "react";
import dayjs from "dayjs";

import {Button} from "@/components/button/button";
import {Modal} from "@/components/modal/modal";

import styles from "./page.module.scss";

type AddFormProps = {
    add: (
        formData: FormData,
        username: string,
        date: string,
        user_id: string
    ) => Promise<{error: any}>;
    username: string;
    user_id: string;
};

export default function AddForm({add, username, user_id}: AddFormProps) {
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<boolean | null>(null);

    var [expression, setExpression] = useState("");
    var [explication, setExplication] = useState("");
    var [example, setExample] = useState("");

    const [lengthError, setLengthError] = useState({
        expression: false,
        explication: false,
        example: false,
    });

    var [valid, setValid] = useState({
        expression: true,
        explication: true,
        example: true,
    });

    function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        const name = event.currentTarget.name;

        // Check if the key pressed is 'Enter'
        if (event.key === "Enter") {
            if (name === "expression" || name === "explication") {
                // Prevent default behavior (entering a newline) for 'expression' and 'explication'
                event.preventDefault();
            } else if (name === "example") {
                // Allow only up to 3 newline characters for 'example'
                const value = event.currentTarget.value;
                const newlinesCount = (value.match(/\n/g) || []).length;
                if (newlinesCount >= 3) {
                    // Prevent additional newlines if there are already 3
                    event.preventDefault();
                }
            }
        }
    }

    function onInputChange(event: React.FormEvent<HTMLTextAreaElement>) {
        const target = event.currentTarget;
        const name = target.name;
        const value = target.value;

        const isValid =
            value === "" ||
            /^[a-zA-Z0-9\s.,;:'"?!-/\u0103\u00E2\u00EE\u021B\u0219]+$/u.test(
                value
            );

        switch (name) {
            case "expression":
                setExpression(value);
                setValid((prevValid) => ({...prevValid, expression: isValid}));
                break;
            case "explication":
                setExplication(value);
                setValid((prevValid) => ({...prevValid, explication: isValid}));
                break;
            case "example":
                setExample(value);
                setValid((prevValid) => ({...prevValid, example: isValid}));
                break;
            default:
                break;
        }
    }

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        // New: Check the lengths of the fields before submission
        const isExpressionLengthValid =
            expression.length >= 2 && expression.length <= 90;
        const isExplicationLengthValid =
            explication.length >= 12 && explication.length <= 140;
        const isExampleLengthValid =
            example.length >= 7 && example.length <= 90;

        // Update the lengthError state to reflect any length errors
        setLengthError({
            expression: !isExpressionLengthValid,
            explication: !isExplicationLengthValid,
            example: !isExampleLengthValid,
        });

        // Check if there is any length error
        const hasLengthError =
            !isExpressionLengthValid ||
            !isExplicationLengthValid ||
            !isExampleLengthValid;

        // Set the error state and message if there is a length error
        if (hasLengthError) {
            setError(true);
            setMessage(
                "Asigurați-vă că lungimea fiecărui câmp este în limitele specificate."
            );
        } else if (!valid.expression || !valid.explication || !valid.example) {
            return;
        } else {
            // If there are no length errors, proceed with form submission logic here
            const formData = new FormData(
                event.currentTarget as HTMLFormElement
            );
            const now = dayjs().format("YYYY-MM-DD | HH:mm");
            const {error} = await add(formData, username, now, user_id);
            if (error) {
                setMessage("A apărut o eroare la trimiterea datelor.");
                setError(true);
            } else {
                setMessage(
                    "Expresia a fost adăugată cu succes. Vei fi redirecționat/ă către pagina expresiei."
                );
                setError(false);
                // Reset form fields and errors
                setExpression("");
                setExplication("");
                setExample("");
                setLengthError({
                    expression: false,
                    explication: false,
                    example: false,
                });
            }
        }
        return;
    }

    return (
        <>
            <div
                className={`${styles.info} ${
                    !valid.expression || !valid.explication || !valid.example
                        ? styles.infoAlert
                        : ""
                }`}
            >
                * poți folosi doar litere, cifre și semne de punctuație
            </div>

            <form onSubmit={handleSubmit} className={styles.addForm} noValidate>
                <label htmlFor="expression">Expresie</label>
                <textarea
                    name="expression"
                    placeholder="2-90 caractere"
                    minLength={4}
                    maxLength={240}
                    rows={1}
                    required
                    className={
                        valid.expression && !lengthError.expression
                            ? ""
                            : styles.invalid
                    }
                    onChange={onInputChange}
                    value={expression}
                    onKeyDown={handleKeyDown}
                />

                <label htmlFor="explication">Explicație</label>
                <textarea
                    name="explication"
                    placeholder="12-140 caractere"
                    rows={2}
                    required
                    className={
                        valid.explication && !lengthError.explication
                            ? ""
                            : styles.invalid
                    }
                    onChange={onInputChange}
                    value={explication}
                    onKeyDown={handleKeyDown}
                />

                <label htmlFor="example">Exemplu</label>
                <textarea
                    name="example"
                    placeholder="7-90 caractere"
                    rows={3}
                    required
                    className={
                        valid.example && !lengthError.example
                            ? ""
                            : styles.invalid
                    }
                    onChange={onInputChange}
                    value={example}
                    onKeyDown={handleKeyDown}
                />

                <Button
                    text="Trimite"
                    type="submit"
                    disabled={
                        !(
                            valid.expression &&
                            valid.explication &&
                            valid.example
                        )
                    }
                />
            </form>
            <Modal message={message} error={error} />
        </>
    );
}
