import type {Metadata} from "next";
import {Analytics} from "@vercel/analytics/react";
import {cookies} from "next/headers";

import {Header} from "@/sections/header/header";
import {Footer} from "@/sections/footer/footer";
import {Sidebar} from "@/sections/container/sidebar";

import type {theme} from "@/sections/header/header";

import "./layout.scss";

export const metadata: Metadata = {
    title: "Dictionar Urban",
    description: "De Crușoveanu Ioan. În lucru.",
    robots: {
        follow: false,
        index: false,
    },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    const cookieStore = cookies();
    const cookie = cookieStore.get("theme");
    let theme: string = "dark";

    if (cookie) {
        theme = cookie?.value;
    }

    return (
        <html lang="ro" data-theme={theme}>
            <body>
                <Header theme={theme as theme} />
                <main className="main">
                    <section>{children}</section>
                    <Sidebar />
                </main>
                <Footer />
                <Analytics />
            </body>
        </html>
    );
}
