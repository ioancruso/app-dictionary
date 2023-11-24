import React from "react";

import {cookies} from "next/headers";
import {createClient} from "@/utilities/supabase/client";
import {createClient as createClientServer} from "@/utilities/supabase/server";

import {ExpressionCard} from "@/components/expression/expression";
import type {Expression} from "@/app/page";
import Pagination from "@/components/pagination/pagination";
import {getLikeStatus} from "@/app/page";
import {PER_PAGE} from "@/app/page";

import styles from "./page.module.scss";

async function getId(username: string) {
    const supabase = createClient();

    const {data, error} = await supabase
        .from("users_view")
        .select()
        .ilike("username", username)
        .single();

    if (error) {
        console.error(error);
        return;
    }

    return data.id;
}

async function getExpressionsNumber(id: string) {
    const supabase = createClient();

    const {data: countData, error: countError} = await supabase
        .from("expressions_view")
        .select()
        .eq("user_id", id);

    if (countError) {
        console.error(countError);
        return;
    }

    return countData.length;
}

async function getDataWithLikes(
    start: number,
    stop: number,
    id: string
): Promise<Expression[]> {
    const supabase = createClient();

    const {data: expressions, error: expressionsError} = await supabase
        .from("expressions_view")
        .select()
        .eq("user_id", id)
        .range(start, stop)
        .order("date", {ascending: false});

    if (expressionsError) {
        throw expressionsError;
    }

    return expressions;
}

export default async function Resetare({
    params,
    searchParams,
}: {
    params: {utilizator: string};
    searchParams: {pagina?: string};
}) {
    const cookieStore = cookies();
    const supabase = createClientServer(cookieStore);

    const username = decodeURIComponent(params.utilizator);
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
        const id = await getId(username);

        if (typeof id !== "string" || !id) {
            throw new Error("Invalid or empty string");
        }

        const expressionsNumber = await getExpressionsNumber(id);

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

        const expressions: Expression[] = await getDataWithLikes(
            start,
            stop,
            id
        );

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
                <h1>
                    Expresiile utilizatorului{" "}
                    <span>{username.toUpperCase()}</span>
                </h1>
                <div className={styles.expressionsList}>
                    {expressionsWithLikes &&
                        expressionsWithLikes.map((expression) => (
                            // The key should be on the fragment, not on the children inside
                            <React.Fragment key={expression.id}>
                                <ExpressionCard
                                    expressionData={expression}
                                    user={user}
                                    user_id={user_id}
                                    showAuthor={false}
                                />
                            </React.Fragment>
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
