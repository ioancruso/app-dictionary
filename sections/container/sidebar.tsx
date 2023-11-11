import styles from "./sidebar.module.scss";

import {Button} from "@/components/button/button";

function Sidebar() {
    return (
        <>
            <aside className={styles.sidebar}>
                <div className={styles.addExpression}>
                    <h2>Poți contribui și tu la acest dicționar</h2>
                    <Button text="Adaugă o expresie" href="/adauga" />
                </div>
            </aside>
        </>
    );
}

export {Sidebar};
