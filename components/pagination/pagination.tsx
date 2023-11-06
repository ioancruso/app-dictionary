import {Button} from "@/components/button/button";

import styles from "./pagination.module.scss";

export default function Pagination({
    page,
    per_page,
    PostsNumber,
}: {
    page: number;
    per_page: number;
    PostsNumber: number;
}) {
    let previous = page < 2 ? true : false;
    let next = page * per_page >= PostsNumber ? true : false;

    return (
        <div className={styles.pagination}>
            <Button
                text="Înapoi"
                type="anchor"
                spaced={true}
                disabled={previous}
                href={page > 1 ? `?pagina=${page - 1}` : ``}
                tabIndex={page < 2 ? -1 : 0}
                rel={page < 2 ? "nofollow" : undefined}
            />

            <span className={styles.page}>
                Pagina <span>{page}</span>
            </span>

            <Button
                text="Înainte"
                type="anchor"
                spaced={true}
                disabled={next}
                href={
                    page * per_page < PostsNumber ? `?pagina=${page + 1}` : ``
                }
                tabIndex={page * per_page < PostsNumber ? 0 : -1}
                rel={page * per_page < PostsNumber ? undefined : "nofollow"}
            />
        </div>
    );
}
