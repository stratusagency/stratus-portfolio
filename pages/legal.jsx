import Head from "next/head"
import Footer from "./components/Footer"

export default function Legal() {
    return (
        <>
            <Head>
                <title>STRATUS — Legal</title>
                <link rel="shortcut icon" href="/static/favicon.ico" />
            </Head>

            <section className="legal">
                <h2>Legal</h2>

                <p>Mockups are made by <a href="https://www.anthonyboyd.graphics/">Anthony Boyd</a>.</p>
                <p>Web template is made by <a href="https://www.leonardomattar.com/">Leonardo Mattar</a></p>
            </section>

            <Footer />
        </>
    )
}