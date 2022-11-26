import Image from "next/image"
import Link from "next/link"

import navbarImage from "../../static/images/navbar-image.webp"

export default function Navbar({ options }) {
    const navbarRef = options.ref

    return (
        <section ref={navbarRef} className="navbar">
            <div className="row">
                <div className="links">
                    {['work', 'blog', 'store', 'contact'].map((x, i) => (
                        <ButtonElement key={i} options={{
                            name: x,
                            href: `/${x}`,
                        }} />
                    ))}
                </div>

                <Image
                    src={navbarImage}
                    alt=""
                />

                <div className="gray-divider"></div>
            </div>

            <div className="row copyrights">
                <div className="element">
                    <p>Copyright © STRATUS</p>
                </div>

                <div></div>

                <div className="element">
                    <a href="https://www.leonardomattar.com/" rel="nopenner noreferrer" target="_blank">
                        <p>© Leonardo Mattar</p>
                    </a>
                </div>
            </div>
        </section>
    )
}

const ButtonElement = ({ options }) => {
    return (
        <div className="element">
            <Link href={options.href}>
                {options.name}
            </Link>

            <hr />
        </div>
    )
}