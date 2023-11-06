import {SVGProps} from "react";

import styles from "./svg.module.scss";

const CheckedSvg = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            className={styles.svgColorStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m6 12 4.243 4.243 8.484-8.486"
        />
    </svg>
);
export default CheckedSvg;
