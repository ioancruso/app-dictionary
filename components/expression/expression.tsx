"use client";

import {useState} from "react";
import Link from "next/link";

import {useRouter} from "next/navigation";
import {createClient} from "@/utilities/supabase/client";

import type {Expression} from "@/app/page";

import LikeSvg from "@/svgs/like";
import DislikeSvg from "@/svgs/dislike";

import styles from "./expression.module.scss";

interface ExpressionCardProps {
    expressionData: Expression;
    showAuthor?: boolean;
    showLikes?: boolean;
    clickable?: boolean;
    user: any;
    user_id: string | null;
}

export type isLiked = "liked" | "disliked" | null;

function ExpressionCard({
    expressionData,
    showAuthor = true,
    showLikes = true,
    clickable,
    user,
    user_id,
}: ExpressionCardProps) {
    const [isLiked, setIsLiked] = useState<isLiked>(expressionData.likeStatus);

    const [likes, setLikes] = useState(expressionData.likes);
    const [dislikes, setDislikes] = useState(expressionData.dislikes);

    const router = useRouter();
    const supabase = createClient();

    const expressionName = encodeURI(expressionData.expression);

    async function handleLike(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (user) {
            if (isLiked == null || isLiked == "disliked") {
                const {error} = await supabase.from("likes").insert([
                    {
                        post_id: expressionData.id,
                        user_id: user_id,
                    },
                ]);

                if (error) {
                    console.log(error);
                } else {
                    setIsLiked("liked");
                    setLikes(likes + 1);
                }

                if (isLiked == "disliked") {
                    if (isLiked == "disliked") {
                        const {error} = await supabase
                            .from("dislikes   ")
                            .delete()
                            .eq("user_id", user_id)
                            .eq("post_id", expressionData.id);

                        if (error) {
                            console.log(error);
                        } else {
                            setDislikes(dislikes - 1);
                        }
                    }
                }
            } else if (isLiked == "liked") {
                const {error} = await supabase
                    .from("likes")
                    .delete()
                    .eq("user_id", user_id)
                    .eq("post_id", expressionData.id);

                if (error) {
                    console.log(error);
                } else {
                    setIsLiked(null);
                    setLikes(likes - 1);
                }
            }
        } else {
            router.push("/autentificare");
        }
    }

    async function handleDislike(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        if (user) {
            if (isLiked == null || isLiked == "liked") {
                const {error} = await supabase.from("dislikes").insert([
                    {
                        post_id: expressionData.id,
                        user_id: user_id,
                    },
                ]);

                if (error) {
                    console.log(error);
                } else {
                    setIsLiked("disliked");
                    setDislikes(dislikes + 1);
                }
                if (isLiked == "liked") {
                    const {error} = await supabase
                        .from("likes")
                        .delete()
                        .eq("user_id", user_id)
                        .eq("post_id", expressionData.id);

                    if (error) {
                        console.log(error);
                    } else {
                        setLikes(likes - 1);
                    }
                }
            } else if (isLiked == "disliked") {
                const {error} = await supabase
                    .from("dislikes")
                    .delete()
                    .eq("user_id", user_id)
                    .eq("post_id", expressionData.id);

                if (error) {
                    console.log(error);
                } else {
                    setIsLiked(null);
                    setDislikes(dislikes - 1);
                }
            }
        } else {
            router.push("/autentificare");
        }
    }

    function getDate(dateAndTime: string) {
        const justDate: string = dateAndTime.split("|")[0].trim();
        const [year, month, day] = justDate.split("-").map(Number) as [
            number,
            number,
            number
        ];

        const months: string[] = [
            "Ianuarie",
            "Februarie",
            "Martie",
            "Aprilie",
            "Mai",
            "Iunie",
            "Iulie",
            "August",
            "Septembrie",
            "Octombrie",
            "Noiembrie",
            "Decembrie",
        ];

        const theMonth: string = months[month - 1];
        const theDate: string = `${day} ${theMonth} ${year}`;

        return theDate;
    }

    return (
        <>
            <div className={styles.expressionCard}>
                <Link
                    className={`${styles.expression} ${
                        clickable === false && styles.disabled
                    }`}
                    href={`/expresie/${expressionName}?id=${expressionData.id}`}
                >
                    {expressionData.expression}
                </Link>
                <div className={styles.details}>
                    <div className={styles.explication}>
                        {expressionData.explication}
                    </div>
                    <div className={styles.example}>
                        {expressionData.example}
                    </div>
                </div>
                <div className={styles.cardInfo}>
                    adăugat{" "}
                    {showAuthor && (
                        <>
                            de{" "}
                            <Link
                                className={styles.author}
                                href={`/utilizator/${expressionData.author}`}
                            >
                                {expressionData.author}
                            </Link>{" "}
                        </>
                    )}
                    pe
                    <span className={styles.date}>
                        {" "}
                        {getDate(expressionData.date)}
                    </span>
                </div>
                {showLikes && (
                    <div className={styles.likesSystem}>
                        <button
                            className={`${styles.likePart} ${
                                isLiked == "liked" ? styles.likePartActive : ""
                            } `}
                            onClick={handleLike}
                        >
                            <LikeSvg />
                            <span className={styles.likes}>{likes}</span>
                        </button>
                        <button
                            className={`${styles.dislikePart} ${
                                isLiked == "disliked"
                                    ? styles.dislikePartActive
                                    : ""
                            } `}
                            onClick={handleDislike}
                        >
                            <DislikeSvg />
                            <span className={styles.dislikes}>{dislikes}</span>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export {ExpressionCard};
