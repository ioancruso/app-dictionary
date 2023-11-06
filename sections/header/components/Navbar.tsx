"use client";

import Link from "next/link";

import {useState, useEffect} from "react";
import {motion} from "framer-motion";

import type {LoggedStatus} from "../header";
import MenuSvg from "@/svgs/menu";

import styles from "./navbar.module.scss";

type NavbarProps = {
    LoggedStatus: LoggedStatus;
    signOut: () => void;
};

export function Navbar({LoggedStatus, signOut}: NavbarProps) {
    const [showNav, setShowNav] = useState<boolean>(false);

    const show = () => {
        setShowNav(!showNav);
    };

    useEffect(() => {
        const handleResize = () => {
            setShowNav(false);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const preventScroll = (e: Event) => e.preventDefault();

        if (showNav) {
            window.addEventListener("touchmove", preventScroll, {
                passive: false,
            });
            window.addEventListener("wheel", preventScroll, {passive: false});
        } else {
            window.removeEventListener("touchmove", preventScroll);
            window.removeEventListener("wheel", preventScroll);
        }

        return () => {
            window.removeEventListener("touchmove", preventScroll);
            window.removeEventListener("wheel", preventScroll);
        };
    }, [showNav]);

    return (
        <div className={styles.wrapper}>
            <motion.div
                className={`${styles.mobile} ${showNav ? styles.show : ""}`}
                initial={{x: "100%"}}
                animate={{x: showNav ? "0%" : "100%"}}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                }}
            >
                <div className={styles.closeNav}>
                    <button onClick={show}>X</button>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link onClick={show} href="/">
                                Acasă
                            </Link>
                        </li>
                        <li>
                            <Link onClick={show} href="/adauga">
                                Adaugă
                            </Link>
                        </li>
                        {LoggedStatus == "no" && (
                            <>
                                <li>
                                    <Link onClick={show} href="/autentificare">
                                        Autentificare
                                    </Link>
                                </li>
                                <li>
                                    <Link onClick={show} href="/inregistrare">
                                        Inregistrare
                                    </Link>
                                </li>
                            </>
                        )}
                        {LoggedStatus == "user" && (
                            <li>
                                <form action={signOut} onClick={show}>
                                    <button type="submit">Deconectare</button>
                                </form>
                            </li>
                        )}
                    </ul>
                </nav>
            </motion.div>
            <motion.div
                className={styles.menu}
                onClick={show}
                animate={{rotate: showNav ? 90 : 0}}
                transition={{delay: showNav ? 0 : 0.2}}
            >
                <MenuSvg />
            </motion.div>
            <nav className={styles.desktop}>
                <ul>
                    <li>
                        <Link href="/">Acasă</Link>
                    </li>
                    <li>
                        <Link href="/adauga">Adaugă</Link>
                    </li>
                    {LoggedStatus == "no" && (
                        <>
                            <li>
                                <Link href="/autentificare">Autentificare</Link>
                            </li>
                            <li>
                                <Link href="/inregistrare">Inregistrare</Link>
                            </li>
                        </>
                    )}
                    {LoggedStatus == "user" && (
                        <li>
                            <form action={signOut}>
                                <button type="submit">Deconectare</button>
                            </form>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
}
