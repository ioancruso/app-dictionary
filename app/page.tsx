import {cookies} from "next/headers";
import {createClient} from "@/utilities/supabase/client";
import {createClient as createClientServer} from "@/utilities/supabase/server";

import {ExpressionCard} from "@/components/expression/expression";
import Pagination from "@/components/pagination/pagination";

import type {isLiked} from "@/components/expression/expression";

import styles from "./page.module.css";

export const PER_PAGE = 5;

export const dynamic = "force-dynamic";

export type Expression = {
    id: number;
    date: string;
    expression: string;
    explication: string;
    example: string;
    author: string;
    user_id: string;
    likes: number;
    dislikes: number;
    likeStatus: isLiked;
};

async function getExpressionsNumber() {
    const supabase = createClient();

    const {data: countData, error: countError} = await supabase
        .from("expressions_count_view")
        .select("expressions_count");

    if (countError) {
        console.error(countError);
        return;
    }

    return countData[0].expressions_count;
}

async function getDataWithLikes(
    start: number,
    stop: number
): Promise<Expression[]> {
    const supabase = createClient();

    const {data: expressions, error: expressionsError} = await supabase
        .from("expressions_view")
        .select()
        .range(start, stop)
        .order("date", {ascending: false});

    if (expressionsError) {
        throw expressionsError;
    }

    return expressions;
}

export async function getLikeStatus(
    user_id: string | null,
    expression_id: string
) {
    const supabase = createClient();

    const liked = await supabase
        .from("likes")
        .select()
        .eq("user_id", user_id)
        .eq("post_id", expression_id);

    if (liked.error) {
        console.log(liked.error);
    }

    if (liked.data && liked.data.length > 0) {
        return "liked" as isLiked;
    }

    const disliked = await supabase
        .from("dislikes")
        .select()
        .eq("user_id", user_id)
        .eq("post_id", expression_id);

    if (disliked.error) {
        console.log(disliked.error);
    }

    if (disliked.data && disliked.data.length > 0) {
        return "disliked" as isLiked;
    }

    return null;
}

export default async function Home({
    searchParams,
}: {
    searchParams: {pagina?: string};
}) {
    const cookieStore = cookies();
    const supabase = createClientServer(cookieStore);
    const page = Number(searchParams.pagina ?? 1);
    const start = (page - 1) * PER_PAGE;
    const stop = start + PER_PAGE - 1;

    const {
        data: {user},
    } = await supabase.auth.getUser();

    let user_id: string | null = null;

    if (user) {
        user_id = user?.id;
    }

    try {
        const expressionsNumber = await getExpressionsNumber();

        if (!expressionsNumber || expressionsNumber < 1) {
            throw Error("No expression yet");
        }
        if (page > 1) {
            if (start >= expressionsNumber) {
                throw new Error("Page limit exceeded total expression count");
            }
        }
        if (page < 1) {
            throw new Error("Page number cannot be less than 1");
        }

        const expressions: Expression[] = await getDataWithLikes(start, stop);

        let expressionsWithLikes = expressions;

        if (user) {
            // Map through expressions and get like status for each
            expressionsWithLikes = await Promise.all(
                expressions.map(async (expression) => {
                    const likeStatus = await getLikeStatus(
                        user_id,
                        expression.id.toString()
                    );
                    return {...expression, likeStatus};
                })
            );
        }

        return (
            <div className={styles.container}>
                <div className={styles.expressionsList}>
                    {expressionsWithLikes &&
                        expressionsWithLikes.map((expression) => (
                            <ExpressionCard
                                expressionData={expression}
                                key={expression.id}
                                user={user}
                                user_id={user_id}
                            />
                        ))}
                </div>
                <Pagination
                    page={page}
                    per_page={PER_PAGE}
                    PostsNumber={expressionsNumber}
                />
            </div>
        );
    } catch (error) {
        console.error(error);
        return (
            <div className={styles.none}>
                <h1>Ceva nu a funcționat bine...</h1>
            </div>
        );
    }
}
