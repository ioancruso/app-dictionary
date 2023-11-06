"use client";

import {useState, useEffect, useRef} from "react";
import Link from "next/link";

import {createClient} from "@/utilities/supabase/client";
import {Expression} from "@/app/page";

import SearchSvg from "@/svgs/search";

import styles from "./searchform.module.scss";

function SearchForm() {
    const [value, setValue] = useState("");
    const [expressions, setExpressions] = useState<Expression[]>([]);

    const supabase = createClient();
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        setValue(event.target.value);
    }

    useEffect(() => {
        if (value.length < 2) {
            setExpressions([]);
            return;
        }
        getData();
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent): void {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setExpressions([]);
                setValue("");
            }
        }

        // Add event listener for mousedown
        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    async function getData() {
        const {data, error} = await supabase
            .from("expressions")
            .select()
            .ilike("expression", `%${value}%`);

        if (error) {
            throw error;
        }
        if (data) {
            setExpressions(data);
        }
    }

    function getLink(expression: string) {
        return encodeURI(expression);
    }

    function showSummary(expression: string) {
        const words = expression.split(" ");
        const numWords = words.length;
        let summary = "";
        const lenght = 6;

        if (numWords > lenght) {
            for (let i = 0; i < lenght; i++) {
                summary += words[i] + " ";
            }
            return `${summary}...`;
        } else {
            return expression;
        }
    }

    return (
        <div className={styles.theSearch}>
            <form className={styles.searchForm}>
                <input
                    type="search"
                    value={value}
                    onChange={onChange}
                    className={styles.searchInput}
                    placeholder="Caută..."
                    maxLength={26}
                />
                <button className={styles.searchButton} disabled>
                    <SearchSvg />
                </button>
            </form>
            {value && expressions.length > 0 && (
                <div className={styles.dropdown} ref={dropdownRef}>
                    {expressions.map((item) => (
                        <ul key={item.expression}>
                            <Link href={getLink(item.expression)}>
                                <span>{item.expression}</span> =&gt;{" "}
                                {showSummary(item.explication)}
                            </Link>
                        </ul>
                    ))}
                </div>
            )}
        </div>
    );
}

export {SearchForm};
