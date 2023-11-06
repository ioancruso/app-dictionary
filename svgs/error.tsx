import {SVGProps} from "react";

import styles from "./svg.module.scss";

const Error = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={220}
        height={220}
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            className={styles.svgColorFill}
            fillRule="nonzero"
            strokeWidth={0}
            d="M12 2c5.523 0 10 4.478 10 10s-4.477 10-10 10S2 17.522 2 12 6.477 2 12 2Zm.002 13.004a.999.999 0 1 0 0 1.997.999.999 0 0 0 0-1.997ZM12 7a1 1 0 0 0-.993.884L11 8l.002 5.001.007.117a1 1 0 0 0 1.986 0l.007-.117L13 8l-.007-.117A1 1 0 0 0 12 7Z"
        />
    </svg>
);
export default Error;
