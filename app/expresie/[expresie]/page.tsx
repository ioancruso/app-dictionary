import React from "react";

import {cookies} from "next/headers";
import {createClient} from "@/utilities/supabase/client";
import {createClient as createClientServer} from "@/utilities/supabase/server";

import {ExpressionCard} from "@/components/expression/expression";
import type {Expression} from "@/app/page";
import {getLikeStatus} from "@/app/page";

import styles from "./page.module.scss";

async function getDataWithLikes(
    id?: string,
    search?: string | null,
    single?: boolean
): Promise<Expression[]> {
    const supabase = createClient();

    let expressions: Expression[] = [];
    let expressionsError;

    // Initialize expressionIds array outside the if-else blocks
    let expressionIds = id ? [id] : []; // Add the provided id if it exists

    if (single) {
        // If an ID is provided, fetch a single expression.
        const singleResult = await supabase
            .from("expressions_view")
            .select()
            .eq("id", id)
            .single();

        expressions = singleResult.data ? [singleResult.data] : [];
        expressionsError = singleResult.error;
    } else if (search) {
        // Split the search term into unique words and sort by word length
        const words = Array.from(new Set(search.split(/\s+/))).sort(
            (a, b) => b.length - a.length
        );

        for (const word of words) {
            // Stop if we already have 4 expressions
            if (expressions.length >= 4) {
                break;
            }

            const remaining = 4 - expressions.length;

            // Begin building the query excluding already fetched IDs
            let query = supabase
                .from("expressions_view")
                .select()
                .ilike("expression", `%${word}%`)
                .not("id", "in", `(${expressionIds.join(",")})`) // Exclude already fetched IDs
                .limit(remaining);

            const searchResult = await query;

            if (searchResult.error) {
                expressionsError = searchResult.error;
                break;
            }

            // Concatenate the results until we have 4
            expressions = [...expressions, ...searchResult.data].slice(0, 4);
            // Update expressionIds to include the ids of the newly fetched expressions
            expressionIds = [
                ...expressionIds,
                ...searchResult.data.map((e) => e.id),
            ];
        }
    }

    return expressions;
}

export default async function Resetare({
    params,
    searchParams,
}: {
    params: {expresie: string};
    searchParams: {id?: string};
}) {
    const cookieStore = cookies();
    const supabase = createClientServer(cookieStore);

    const id = searchParams.id;
    const encodedExpression = params.expresie;
    const decodedExpression = decodeURIComponent(encodedExpression);

    const {
        data: {user},
    } = await supabase.auth.getUser();

    let user_id: string | null = null;

    if (user) {
        user_id = user?.id;
    }

    try {
        let expressions: Expression[] = await getDataWithLikes(id, null, true);

        if (expressions.length < 1) {
            throw Error("error");
        } else {
            const additionalExpressions = await getDataWithLikes(
                id,
                decodedExpression,
                false
            );
            if (additionalExpressions && additionalExpressions.length > 0) {
                expressions = expressions.concat(additionalExpressions);
            }
        }

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
                    <span>{decodedExpression}</span>
                </h1>
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
                                {index === 0 &&
                                    expressionsWithLikes.length > 1 && (
                                        <h2>Altele asemănătoare:</h2>
                                    )}
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
