import {SVGProps} from "react";

import styles from "./svg.module.scss";

const DisikeSvg = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={33}
        height={33}
        fill="none"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            className={styles.svgColorStroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 14V4m0 10H4V4h4m0 10 5.196 6.061a2 2 0 0 0 2.003.64l.048-.013a2 2 0 0 0 1.179-3.05L14 14h4.56a2 2 0 0 0 1.962-2.392l-1.2-6A2 2 0 0 0 17.36 4H8"
        />
    </svg>
);
export default DisikeSvg;
