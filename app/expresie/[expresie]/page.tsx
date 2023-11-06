import {cookies} from "next/headers";
import {createClient} from "@/utilities/supabase/client";
import {createClient as createClientServer} from "@/utilities/supabase/server";

import {ExpressionCard} from "@/components/expression/expression";
import type {Expression} from "@/app/page";
import type {isLiked} from "@/components/expression/expression";

import styles from "./page.module.scss";

async function getDataWithLikes(
    id?: string,
    search?: string | null,
    single?: boolean
): Promise<Expression[]> {
    const supabase = createClient();

    let expressions: Expression[] = [];
    let expressionsError;

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
        // If 'single' is false, fetch expressions based on the search term.
        const words = Array.from(new Set(search.split(/\s+/))).sort(
            (a, b) => b.length - a.length
        );

        for (const word of words) {
            // Stop if we already have 4 expressions.
            if (expressions.length >= 4) {
                break;
            }

            const remaining = 4 - expressions.length;

            // Begin building the query
            let query = supabase
                .from("expressions_view")
                .select()
                .ilike("expression", `%${word}%`)
                .limit(remaining);

            // If 'single' is false and an ID is provided, exclude the expression with that ID.
            if (!single && id) {
                query = query.not("id", "eq", id);
            }

            const searchResult = await query;

            if (searchResult.error) {
                expressionsError = searchResult.error;
                break;
            }

            // Concatenate the results until we have 4.
            expressions = [...expressions, ...searchResult.data].slice(0, 4);
        }
    }

    return expressions;
}

async function getLikeStatus(user_id: string | null, expression_id: string) {
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
                <div className={styles.expressionsList}>
                    {expressionsWithLikes &&
                        expressionsWithLikes.map((expression, index) => (
                            <>
                                <ExpressionCard
                                    expressionData={expression}
                                    key={expression.id}
                                    user={user}
                                    user_id={user_id}
                                />
                                {index === 0 &&
                                    expressionsWithLikes.length > 1 && (
                                        <h2>Altele asemănătoare:</h2>
                                    )}
                            </>
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
