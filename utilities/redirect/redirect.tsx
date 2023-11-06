"use client";

import {useRouter} from "next/navigation";
import {useEffect} from "react";

import Error from "@/svgs/error";

import styles from "./redirect.module.scss";

type RedirectProps = {
    logged?: boolean;
    source?: string;
    path: string;
    custom?: string;
};

export default function Redirect({
    logged,
    source,
    path,
    custom,
}: RedirectProps) {
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push(path);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={styles.info}>
            <Error />
            {custom ? (
                custom
            ) : (
                <>
                    Nu poți accesa pagina pentru {source} dacă{" "}
                    {logged
                        ? "ești deja autentificat/ă"
                        : "nu ești autentificat/ă"}
                    .{" "}
                </>
            )}
            <span>
                Vei fi redirecționat/ă către{" "}
                {logged || custom ? "prima pagină" : "pagina de autentificare"}.
            </span>
        </div>
    );
}
