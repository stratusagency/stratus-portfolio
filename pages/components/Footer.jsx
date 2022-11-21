import Image from "next/image"
import Link from "next/link"

import logoLargeBlackImage from "../../static/images/logo-large-black.svg"
import instagramImage from "../../static/images/instagram.svg"
import gitHubImage from "../../static/images/github.svg"
import twitterImage from "../../static/images/twitter.svg"

export default function Footer(options) {
    const tl = options.timeline;

    return (
        <footer>
            <div className="row">
                <div className="column space-between">
                    <div>
                        <Image
                            src={logoLargeBlackImage}
                            alt=""
                            width={130}
                            height={50}
                        />

                        <p>Metaverse, Blockchain and Web 3.0 Solutions Provider. Trusted by Metaverse GT.</p>

                        <div className="social-wrap">
                            <a href="https://www.instagram.com/stratusagency_official/" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={instagramImage}
                                    alt=""
                                    width={16}
                                    height={17}
                                />
                            </a>

                            <a href="https://github.com/stratusagency" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={gitHubImage}
                                    alt=""
                                    width={16}
                                    height={17}
                                />
                            </a>

                            <a href="https://twitter.com/stratusagency" target="_blank" rel="noopener noreferrer">
                                <Image
                                    src={twitterImage}
                                    alt=""
                                    width={16}
                                    height={17}
                                />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="column pages">
                    <h2>PAGES</h2>

                    <div className="list">
                        <Link href="/" onClick={() => tl ? tl.killAll() : undefined}>Home</Link>
                        <Link href="/work" onClick={() => tl ? tl.killAll() : undefined}>Work</Link>
                        <Link href="/blog" onClick={() => tl ? tl.killAll() : undefined}>Blog</Link>
                        <Link href="/contact" onClick={() => tl ? tl.killAll() : undefined}>Contact</Link>
                    </div>
                </div>

                <div className="column utility">
                    <h2>LEGALS</h2>

                    <div className="list">
                        <Link href="/rgpd" onClick={() => tl ? tl.killAll() : undefined}>RGPD</Link>
                        <Link href="/legal" onClick={() => tl ? tl.killAll() : undefined}>Legal</Link>
                    </div>
                </div>
            </div>

            <div className="row copyrights">
                <p>Copyright © STRATUS</p>

                <div></div>

                <a href="https://www.leonardomattar.com/" rel="nopenner noreferrer" target="_blank">
                    <p>© Template by Leonardo Mattar</p>
                </a>
            </div>
        </footer>
    )
}