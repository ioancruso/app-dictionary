import {cookies} from "next/headers";
import {createClient} from "@/utilities/supabase/server";
import {revalidatePath} from "next/cache";

import AddForm from "./addForm";

import Redirect from "@/utilities/redirect/redirect";

import styles from "./page.module.scss";

async function add(
    formData: FormData,
    username: string,
    date: string,
    user_id: string
) {
    "use server";

    const expression = String(formData.get("expression"));
    const explication = String(formData.get("explication"));
    const example = String(formData.get("example"));

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {error} = await supabase.from("expressions").insert([
        {
            expression: expression,
            explication: explication,
            example: example,
            author: username,
            date: date,
            user_id: user_id,
        },
    ]);
    if (error) {
        return {error: {message: error.message}};
    }

    revalidatePath("/");

    return {error: null};
}

export default async function Adauga() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    let username: string = "";
    let user_id: string = "";

    const {
        data: {user},
    } = await supabase.auth.getUser();

    let logged: boolean = false;

    if (user && user.identities) {
        logged = true;
        username = user.user_metadata.username;
        user_id = user.identities[0].user_id;
    }

    return (
        <div className={styles.addPage}>
            {logged ? (
                <>
                    <h2>Adaugă o expresie</h2>
                    <AddForm add={add} username={username} user_id={user_id} />
                </>
            ) : (
                <Redirect
                    logged={logged}
                    source="adaugarea unei expresii"
                    path="/autentificare"
                />
            )}
        </div>
    );
}
