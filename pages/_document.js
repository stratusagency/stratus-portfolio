import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const originalRenderPage = ctx.renderPage

        // Run the React rendering logic synchronously
        ctx.renderPage = () =>
            originalRenderPage({
                // Useful for wrapping the whole react tree
                enhanceApp: (App) => App,
                // Useful for wrapping in a per-page basis
                enhanceComponent: (Component) => Component,
            })

        // Run the parent `getInitialProps`, it now includes the custom `renderPage`
        const initialProps = await Document.getInitialProps(ctx)

        return initialProps
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta charSet="utf-8" />
                    <link rel="icon" href="static/favicon.ico" />
                    <link rel="shortcut icon" href="/static/favicon.ico" />
                    <meta name="theme-color" content="#000000" />
                    <link rel="apple-touch-icon" href="/static/logo192.png" />
                    <meta name="google-site-verification" content="A8mouogszewpmVHxgnOtBBczFt2aT9Smx92xZDZS-tc" />
                    <link rel="manifest" href="/static/manifest.json" />

                    <meta name="title" content="STRATUS — Expert Blockchain Agency" />
                    <meta name="description" content="Metaverse, Blockchain and Web 3.0 solutions provider. Trusted by Metaverse GT." />

                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://stratusagency.io/" />
                    <meta property="og:title" content="STRATUS — Expert Blockchain Agency" />
                    <meta property="og:description" content="Metaverse, Blockchain and Web 3.0 solutions provider. Trusted by Metaverse GT." />
                    <meta property="og:image" content="" />

                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content="https://stratusagency.io/" />
                    <meta property="twitter:title" content="STRATUS — Expert Blockchain Agency" />
                    <meta property="twitter:description" content="Metaverse, Blockchain and Web 3.0 solutions provider. Trusted by Metaverse GT." />
                    <meta property="twitter:image" content="" />
                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument