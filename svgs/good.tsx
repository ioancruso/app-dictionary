import {SVGProps} from "react";

import styles from "./svg.module.scss";

const Good = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width={220}
        height={220}
        strokeWidth={23.04}
        viewBox="-15.36 -15.36 542.72 542.72"
        {...props}
    >
        <path
            className={styles.svgColorFill}
            d="M256 0C114.837 0 0 114.843 0 256s114.837 256 256 256 256-114.843 256-256S397.163 0 256 0zm120.239 227.501-118.891 118.89c-13.043 13.043-34.174 13.044-47.218 0l-68.804-68.804c-13.044-13.038-13.044-34.179 0-47.218 13.044-13.044 34.174-13.044 47.218 0l45.195 45.19 95.282-95.278c13.044-13.044 34.174-13.044 47.218 0 13.044 13.04 13.044 34.181 0 47.22z"
        />
    </svg>
);
export default Good;
