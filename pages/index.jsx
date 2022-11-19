import { useEffect, useState, useRef } from "react"

import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import gsap from "gsap"


export default function App() {
	const hamburgerButtonRef = useRef();

	useEffect(() => {
		// Only neccessary to toggle the overflow and show what's going on behind the scenes
		// const wrapper = document.querySelector(".track-wrap");
		// document.querySelector(".toggle").addEventListener("click", () => wrapper.classList.toggle("show-overflow"));



		gsap.registerPlugin(ScrollTrigger);

		// Create array of elements to tween on
		const boxesTop = gsap.utils.toArray(".track-wrap.top .element");

		// Setup the tween
		const loopTop = horizontalLoop(boxesTop, {
			paused: false, // Sets the tween to be paused initially
			repeat: -1 // Makes sure the tween runs infinitely
		});

		// Start the tween
		loopTop.play() // Call to start playing the tween

		// ScrollTrigger set up for the whole duration of the body's scroll
		ScrollTrigger.create({
			start: 0,
			end: 'max',
			pin: '.container',
			onUpdate: function (self) {
				loopTop.timeScale(1)
				// loopBottom.timeScale(1)
			}
		})

		// -------------------------------------------------------------------------------------------------------------------------------------

		/*
		This helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.
		
		Features:
		 - Uses xPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
		 - When each item animates to the left or right enough, it will loop back to the other side
		 - Optionally pass in a config object with values like "speed" (default: 1, which travels at roughly 100 pixels per second), paused (boolean),  repeat, reversed, and paddingRight.
		 - The returned timeline will have the following methods added to it:
		   - next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
		   - previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
		   - toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
		   - current() - returns the current index (if an animation is in-progress, it reflects the final index)
		   - times - an Array of the times on the timeline where each element hits the "starting" spot. There's also a label added accordingly, so "label1" is when the 2nd element reaches the start.
		 */
		function horizontalLoop(items, config) {
			items = gsap.utils.toArray(items);
			config = config || {};
			let tl = gsap.timeline({ repeat: config.repeat, paused: config.paused, defaults: { ease: "none" }, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100) }),
				length = items.length,
				startX = items[0].offsetLeft,
				times = [],
				widths = [],
				xPercents = [],
				curIndex = 0,
				pixelsPerSecond = (config.speed || 1) * 100,
				snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
				totalWidth, curX, distanceToStart, distanceToLoop, item, i;
			gsap.set(items, { // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
				xPercent: (i, el) => {
					let w = widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
					xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / w * 100 + gsap.getProperty(el, "xPercent"));
					return xPercents[i];
				}
			});
			gsap.set(items, { x: 0 });
			totalWidth = items[length - 1].offsetLeft + xPercents[length - 1] / 100 * widths[length - 1] - startX + items[length - 1].offsetWidth * gsap.getProperty(items[length - 1], "scaleX") + (parseFloat(config.paddingRight) || 0);
			for (i = 0; i < length; i++) {
				item = items[i];
				curX = xPercents[i] / 100 * widths[i];
				distanceToStart = item.offsetLeft + curX - startX;
				distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
				tl.to(item, { xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond }, 0)
					.fromTo(item, { xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100) }, { xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false }, distanceToLoop / pixelsPerSecond)
					.add("label" + i, distanceToStart / pixelsPerSecond);
				times[i] = distanceToStart / pixelsPerSecond;
			}
			function toIndex(index, vars) {
				vars = vars || {};
				(Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
				let newIndex = gsap.utils.wrap(0, length, index),
					time = times[newIndex];
				if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
					vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
					time += tl.duration() * (index > curIndex ? 1 : -1);
				}
				curIndex = newIndex;
				vars.overwrite = true;
				return tl.tweenTo(time, vars);
			}
			tl.next = vars => toIndex(curIndex + 1, vars);
			tl.previous = vars => toIndex(curIndex - 1, vars);
			tl.current = () => curIndex;
			tl.toIndex = (index, vars) => toIndex(index, vars);
			tl.times = times;
			tl.progress(1, true).progress(0, true); // pre-render for performance
			if (config.reversed) {
				tl.vars.onReverseComplete();
				tl.reverse();
			}
			return tl;
		}













		const buttonsQA = document.querySelectorAll('section.qa div.element')
		const buttonsProjects = document.querySelectorAll('section.work div.element div.project-hover')

		// Q&A buttons onmouseup animation
		buttonsQA.forEach(button => {
			button.onmouseup = () => {
				const arrow = button.querySelector('img');
				const text = button.querySelector('p');

				if (button.classList.contains('opened')) {
					button.classList.remove('opened');

					gsap.to(arrow, {
						rotateZ: 0,
						duration: 0.3,
					});

					gsap.to(text, {
						height: 0,
						margin: 0,
						duration: 0.3,
					})
				} else {
					button.classList.add('opened');

					gsap.to(arrow, {
						rotateZ: 180,
						duration: 0.3,
					});

					gsap.to(text, {
						height: 'auto',
						margin: "0 0 32px 0",
						duration: 0.3,
					})
				}
			}
		});

		// Projects hover animation
		buttonsProjects.forEach(button => {
			button.onmouseover = () => gsap.to(button, {
				cursor: 'pointer',
				opacity: 1,
				duration: 0.3
			})

			button.onmouseleave = () => gsap.to(button, {
				cursor: 'default',
				opacity: 0,
				duration: 0.3
			})
		})
	}, []);

	return (
		<>
			<Head>
				<title>STRATUS — Expert Blockchain Engineer</title>
				<link rel="shortcut icon" href="/static/favicon.ico" />
			</Head>

			<div className="grain"></div>

			<nav>
				<div className="logo">
					<Link href="/">
						<Image
							src="http://assets.stratusagency.io/logo_large_black.svg"
							alt=""
							width={130}
							height={77}
						/>
					</Link>
				</div>

				<h2>WE BRING YOU TO WEB 3.0</h2>

				<div className="hamburger">
					<button ref={hamburgerButtonRef}>
						<Image
							src="http://assets.stratusagency.io/hamburger.svg"
							alt=""
							width={30}
							height={30}
						/>
					</button>
				</div>
			</nav>

			<header>
				<h1>STRATUS</h1>
				<h1>AGENCY</h1>
			</header>

			<section className="portfolio">
				<div className="left">
					<picture>
						<source srcSet="https://assets.website-files.com/62384332bac7f3d4f139ee1e/624d619f9baa9d24389f2eda_home-hero-row1-01.jpg" type="image/jpg" />
						<img src="https://assets.website-files.com/62384332bac7f3d4f139ee1e/624d619f9baa9d24389f2eda_home-hero-row1-01.jpg" loading="lazy" alt="" className="showcase-image" />
					</picture>

					<picture>
						<source srcSet="https://assets.website-files.com/62384332bac7f3d4f139ee1e/624d61a098b5b6294f13e885_home-hero-row1-02.jpg" type="image/jpg" />
						<img src="https://assets.website-files.com/62384332bac7f3d4f139ee1e/624d61a098b5b6294f13e885_home-hero-row1-02.jpg" loading="lazy" alt="" className="showcase-image" />
					</picture>

					<picture>
						<source srcSet="http://assets.stratusagency.io/mont_blanc_climate_change.webp" type="image/webp" />
						<img src="http://assets.stratusagency.io/mont_blanc_climate_change.webp" loading="eager" alt="" className="showcase-image" />
					</picture>
				</div>

				<div className="center">
					<picture>
						<source srcSet="http://assets.stratusagency.io/peer3.jpg" type="image/jpg" />
						<img src="http://assets.stratusagency.io/peer3.jpg" loading="eager" alt="" className="showcase-main-image" />
					</picture>

					<picture>
						<source srcSet="http://assets.stratusagency.io/r3port.jpg" type="image/jpg" />
						<img src="http://assets.stratusagency.io/r3port.jpg" loading="eager" alt="" className="showcase-main-image" />
					</picture>

					<picture>
						<source srcSet="http://assets.stratusagency.io/peer3.jpg" type="image/jpg" />
						<img src="http://assets.stratusagency.io/peer3.jpg" loading="eager" alt="" className="showcase-main-image" />
					</picture>
				</div>

				<div className="right">
					<picture>
						<source srcSet="http://assets.stratusagency.io/mont_blanc_climate_change.webp" type="image/webp" />
						<img src="http://assets.stratusagency.io/mont_blanc_climate_change.webp" loading="eager" alt="" className="showcase-image" />
					</picture>

					<picture>
						<source srcSet="https://assets.website-files.com/62384332bac7f3d4f139ee1e/624d61a098b5b676ad13e886_home-hero-row3-02.jpg" type="image/webp" />
						<img src="https://assets.website-files.com/62384332bac7f3d4f139ee1e/624d61a098b5b676ad13e886_home-hero-row3-02.jpg" loading="lazy" alt="" className="showcase-image" />
					</picture>

					<picture>
						<source srcSet="https://assets.website-files.com/62384332bac7f3d4f139ee1e/624d61a09e9615861d5e6727_home-hero-row3-03.jpg" type="image/webp" />
						<img src="https://assets.website-files.com/62384332bac7f3d4f139ee1e/624d61a09e9615861d5e6727_home-hero-row3-03.jpg" loading="lazy" alt="" className="showcase-image" />
					</picture>
				</div>
			</section>

			<section className="values">
				<h2>The leading design agency based in nyc focused on producing beautiful, clever pieces of communication</h2>

				<div className="values-container">
					<ValueElement options={{
						icon_url: "http://assets.stratusagency.io/computer.png",
						title: "Giving the track of the work in live",
						description: "Cursus gravida varius pulvinar faucibus elementum eu eu pellentesque. Curabitur urna, nulla rhoncus, tellus."
					}} />

					<ValueElement options={{
						icon_url: "http://assets.stratusagency.io/chat.png",
						title: "Giving our tips as experts",
						description: "Cursus gravida varius pulvinar faucibus elementum eu eu pellentesque. Curabitur urna, nulla rhoncus, tellus."
					}} />

					<ValueElement options={{
						icon_url: "http://assets.stratusagency.io/hand-shake.png",
						title: "Building long-term partnerships",
						description: "Cursus gravida varius pulvinar faucibus elementum eu eu pellentesque. Curabitur urna, nulla rhoncus, tellus."
					}} />

					<ValueElement options={{
						icon_url: "http://assets.stratusagency.io/question.png",
						title: "Responding in 12h delay",
						description: "Cursus gravida varius pulvinar faucibus elementum eu eu pellentesque. Curabitur urna, nulla rhoncus, tellus."
					}} />

					<ValueElement options={{
						icon_url: "http://assets.stratusagency.io/stars.png",
						title: "Making all of our clients unique",
						description: "Cursus gravida varius pulvinar faucibus elementum eu eu pellentesque. Curabitur urna, nulla rhoncus, tellus."
					}} />

					<ValueElement options={{
						icon_url: "https://assets.website-files.com/62384332bac7f3d4f139ee1e/624d6ca3a114b2d3d5719753_perks-icon-01.svg",
						title: "Teamwork",
						description: "Cursus gravida varius pulvinar faucibus elementum eu eu pellentesque. Curabitur urna, nulla rhoncus, tellus."
					}} />
				</div>
			</section>

			<section className="work">
				<div className="titles">
					<h3>AWARD WINNING PROJECTS</h3>
					<h2>RECENT WORK</h2>
				</div>

				<div className="row">
					<div className="left">
						<WorkElement options={{
							icon_url: "https://assets.website-files.com/624dbf72a63c9fd340c1fa43/624dc1161fae2936043c76e6_work-thumb-01.jpg",
							date: 2022,
							title: "NFTCARDS"
						}} />

						<WorkElement options={{
							icon_url: "https://assets.website-files.com/624dbf72a63c9fd340c1fa43/624dc30100b97edea3bd9737_work-thumb-02.jpg",
							date: 2022,
							title: "NFTCARDS"
						}} />

						<WorkElement options={{
							icon_url: "https://assets.website-files.com/624dbf72a63c9fd340c1fa43/624dc38aab88d14d289f67f2_work-thumb-03.jpg",
							date: 2022,
							title: "NFTCARDS"
						}} />
					</div>

					<div className="right">
						<WorkElement options={{
							icon_url: "https://assets.website-files.com/624dbf72a63c9fd340c1fa43/624dc3bd579ad2884b23da5c_work-thumb-04.jpg",
							date: 2022,
							title: "NFTCARDS"
						}} />

						<WorkElement options={{
							icon_url: "https://assets.website-files.com/624dbf72a63c9fd340c1fa43/624dc41a134bf1b03d2ea7a4_work-thumb-05.jpg",
							date: 2022,
							title: "NFTCARDS"
						}} />

						<WorkElement options={{
							icon_url: "https://assets.website-files.com/624dbf72a63c9fd340c1fa43/624dc469afeb72153883f44d_work-thumb-06.jpg",
							date: 2022,
							title: "NFTCARDS"
						}} />
					</div>
				</div>
			</section>

			<section className="track">
				<div className="track-wrap top">
					<div className="element">
						<span>WEBSITES</span>
					</div>

					<div className="element logo">
						<Image
							src={"http://assets.stratusagency.io/icon_black.webp"}
							alt=""
							width={36}
							height={36}
						/>
					</div>

					<div className="element">
						<span>VISUAL DESIGN</span>
					</div>

					<div className="element logo">
						<Image
							src={"http://assets.stratusagency.io/icon_black.webp"}
							alt=""
							width={36}
							height={36}
						/>
					</div>

					<div className="element">
						<span>WEBSITES</span>
					</div>

					<div className="element logo">
						<Image
							src={"http://assets.stratusagency.io/icon_black.webp"}
							alt=""
							width={36}
							height={36}
						/>
					</div>

					<div className="element">
						<span>WEBSITES</span>
					</div>

					<div className="element logo">
						<Image
							src={"http://assets.stratusagency.io/icon_black.webp"}
							alt=""
							width={36}
							height={36}
						/>
					</div>

					<div className="element">
						<span>VISUAL DESIGN</span>
					</div>

					<div className="element logo">
						<Image
							src={"http://assets.stratusagency.io/icon_black.webp"}
							alt=""
							width={36}
							height={36}
						/>
					</div>
				</div>
			</section>


			<section className="services">
				<hr />

				<h2>GROUNDWORK SERVICES LIST</h2>

				<div className="row">
					<div className="services-item">
						<span>convert to web 3.0</span>
						<span>branding</span>
						<span>platforms</span>
					</div>

					<div className="services-item">
						<span>development</span>
						<span>programming</span>
						<span>audit</span>
					</div>

					<div className="services-item">
						<span>marketing</span>
						<span>communication</span>
						<span>performance</span>
					</div>
				</div>
			</section>

			<section className="qa">
				<h2>FREQUENTLY ASKED QUESTIONS</h2>

				<div className="questions-list">
					<QuestionElement options={{
						title: 'how much does it cost?',
						text: 'Our prices are personalized to all our customers.'
					}} />

					<QuestionElement options={{
						title: 'how can i contact you?',
						text: 'You can contact us on contact@stratusagency.io, else on our LinkedIn page. It would be a pleasure to work with you!'
					}} />

					<QuestionElement options={{
						title: 'how many revisions per project?',
						text: 'We give you revisions as much as you want, until the end of the contract.',
					}} />

					<QuestionElement options={{
						title: 'how long will it take to receive my project?',
						text: 'This will depend on your specifications and the urgency for your project.',
					}} />
				</div>
			</section>

			<section className="call-to-action">
				<h2>discover without limits start your project now</h2>

				<Link href="/contact">
					GET STARTED
				</Link>

				<div className="background"></div>
			</section>

			<footer>
				<div className="row">
					<div className="column space-between">
						<div>
							<Image
								src="http://assets.stratusagency.io/logo_large_black.svg"
								alt=""
								width={130}
								height={50}
							/>

							<p>Metaverse and Blockchain Solutions Provider. Trusted by Metaverse GT.</p>

							<div className="social-wrap">
								<a href="https://twitter.com/stratusagency">
									<Image
										src="https://assets.website-files.com/62384332bac7f3d4f139ee1e/624de48ff5ee308119faf99a_social-icon-instagram.svg"
										alt=""
										width={16}
										height={17}
									/>
								</a>

								<a href="https://twitter.com/stratusagency">
									<Image
										src="https://assets.website-files.com/62384332bac7f3d4f139ee1e/624de48ff5ee308119faf99a_social-icon-instagram.svg"
										alt=""
										width={16}
										height={17}
									/>
								</a>

								<a href="https://twitter.com/stratusagency">
									<Image
										src="https://assets.website-files.com/62384332bac7f3d4f139ee1e/624de48ff5ee308119faf99a_social-icon-instagram.svg"
										alt=""
										width={16}
										height={17}
									/>
								</a>

								<a href="https://twitter.com/stratusagency">
									<Image
										src="https://assets.website-files.com/62384332bac7f3d4f139ee1e/624de48ff5ee308119faf99a_social-icon-instagram.svg"
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
							<Link href="/">Home</Link>
							<Link href="/work">Work</Link>
							<Link href="/blog">Blog</Link>
							<Link href="/contact">Contact</Link>
						</div>
					</div>

					<div className="column utility">
						<h2>LEGALS</h2>

						<div className="list">
							<Link href="/rgpd">RGPD</Link>
							<Link href="/legal">Legal</Link>
						</div>
					</div>
				</div>

				<div className="row copyrights">
					<p>Copyright © STRATUS Agency</p>

					<div></div>

					<a href="https://www.leonardomattar.com/" rel="nopenner noreferrer" target="_blank">
						<p>© Template by Leonardo Mattar</p>
					</a>
				</div>
			</footer>
		</>
	);
}

const ValueElement = ({ options }) => {
	return (
		<div className="element">
			<div className="image-border">
				<Image
					src={options.icon_url}
					alt=""
					width={24}
					height={24}
				/>
			</div>

			<h3>{options.title}</h3>

			<p>{options.description}</p>
		</div>
	)
}

const WorkElement = ({ options }) => {
	return (
		<div className="element">
			<Image
				src={options.icon_url}
				alt=""
				width={620}
				height={730}
			/>

			<div className="project-hover">
				<div className="top">
					<p>{options.date}</p>
				</div>

				<div className="bottom">
					<h2>{options.title}</h2>
				</div>
			</div>
		</div>
	)
}

const QuestionElement = ({ options }) => {
	return (
		<div className="element">
			<div className="question">
				<h3>{options.title}</h3>

				<Image
					src="https://assets.website-files.com/62384332bac7f3d4f139ee1e/624ddc55319850f3ef7f9b3f_faq%20icon.svg"
					alt=""
					width={11}
					height={15}
				/>
			</div>

			<div className="answer">
				<p>{options.text}</p>
			</div>
		</div>
	)
}