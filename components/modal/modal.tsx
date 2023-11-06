"use client";

import styles from "./modal.module.scss";

type AuthFormProps = {
    message: string | null;
    error?: boolean | null;
};

function Modal({message, error = false}: AuthFormProps) {
    return (
        <div
            className={`${styles.popup} ${
                error === null ? "" : error ? styles.fail : styles.succes
            }`}
        >
            <span>{message || "\u00A0"}</span>
        </div>
    );
}

export {Modal};
