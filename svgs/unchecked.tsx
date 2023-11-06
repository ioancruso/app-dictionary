import {SVGProps} from "react";

import styles from "./svg.module.scss";

const UnCheckedSvg = (props: SVGProps<SVGSVGElement>) => (
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
            d="m16 16-4-4m0 0L8 8m4 4 4-4m-4 4-4 4"
        />
    </svg>
);
export default UnCheckedSvg;
