import React from "react";

import {cookies} from "next/headers";
import {createClient} from "@/utilities/supabase/client";
import {createClient as createClientServer} from "@/utilities/supabase/server";

import {ExpressionCard} from "@/components/expression/expression";
import type {Expression} from "@/app/page";
import {getLikeStatus} from "@/app/page";
import {PER_PAGE} from "@/app/page";

import styles from "./page.module.scss";

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

    return countData[0].expressions_count;
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
    params: {id: string};
    searchParams: {pagina?: string};
}) {
    const cookieStore = cookies();
    const supabase = createClientServer(cookieStore);

    const id = params.id;
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
        const expressionsNumber = await getExpressionsNumber(id);

        if (expressionsNumber < 1) {
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
                <div className={styles.expressionsList}>
                    {expressionsWithLikes &&
                        expressionsWithLikes.map((expression, index) => (
                            // The key should be on the fragment, not on the children inside
                            <React.Fragment key={expression.id}>
                                <ExpressionCard
                                    expressionData={expression}
                                    user={user}
                                    user_id={user_id}
                                />
                            </React.Fragment>
                        ))}
                </div>
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
