import Link from "next/link";
import styles from "./button.module.scss";

interface ButtonProps {
    text: string;
    href?: string;
    type?: "submit" | "link" | "anchor";
    spaced?: boolean;
    disabled?: boolean;
    tabIndex?: number | undefined;
    rel?: string | undefined;
}

function Button({
    text,
    href,
    type = "link",
    spaced = false,
    disabled = false,
    tabIndex,
    rel,
}: ButtonProps) {
    const className = `${styles.button} ${spaced ? styles.spaced : ""} ${
        disabled ? styles.nope : ""
    }`;

    if (type === "submit") {
        return (
            <button
                type="submit"
                className={className}
                disabled={disabled}
                tabIndex={tabIndex}
            >
                {text}
            </button>
        );
    } else if (type === "anchor") {
        return (
            <a
                href={href || "#"}
                className={className}
                tabIndex={tabIndex}
                rel={rel}
            >
                {text}
            </a>
        );
    } else {
        return (
            <Link
                href={href || "#"}
                className={className}
                tabIndex={tabIndex}
                rel={rel}
            >
                {text}
            </Link>
        );
    }
}

export {Button};
