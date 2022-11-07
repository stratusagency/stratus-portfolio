import { useEffect, useState, useRef } from "react"

import Head from "next/head"

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"

import gsap from "gsap"

export default function App() {
	const [model, setModel] = useState(undefined)
	const [load, setLoad] = useState(false)
	const [sizes, setSizes] = useState({})

	const menuRef = useRef()
	const three = useRef()

	const handleHideMenu = e => {
		document.body.classList.remove('stop-scrolling')

		gsap.to('section.menu', {
			opacity: 0,
			y: '-100vh',
			zIndex: -1,
			duration: 0.25
		});
	}

	useEffect(() => {
		const sizesElement = {
			width: window.innerWidth,
			height: window.innerHeight
		}

		setSizes(sizesElement)

		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, .1, 3000)
		const renderer = new THREE.WebGLRenderer({ antialias: true })

		let composer

		renderer.toneMapping = THREE.CineonToneMapping
		renderer.shadowMap.type = THREE.PCFSoftShadowMap
		renderer.outputEncoding = THREE.sRGBEncoding
		renderer.physicallyCorrectLights = true
		renderer.toneMappingExposure = 1.25
		renderer.shadowMap.enabled = true
		renderer.setSize(sizes.width, sizes.height)
		// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		renderer.setClearColor(0xffffff, 1)

		if (!load) {
			// load bitcoin model
			const loader = new GLTFLoader()
			const dracoLoader = new DRACOLoader()

			dracoLoader.setDecoderConfig({ type: 'js' });
			dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
			loader.setDRACOLoader(dracoLoader)

			loader.load(
				"assets/models/eth/scene.glb",
				gltf => {
					console.log(gltf);

					setModel(gltf)
					setLoad(true)
				}, console.log, console.error)
		}

		if (load && three.current) {
			const init = async () => {
				let controls

				controls = new OrbitControls(camera, renderer.domElement)
				controls.enableDamping = true
				controls.enableZoom = false
				controls.enablePan = false
				controls.enableRotate = sizes.width > 768
				controls.minPolarAngle = Math.PI / 3.75
				controls.maxPolarAngle = Math.PI / 3.75
				controls.minDistance = 10
				controls.maxDistance = 10
				controls.autoRotate = true
				controls.autoRotateSpeed = 3

				// setup scene
				camera.position.set(0, 30, 77)
				scene.add(camera)

				renderer.setClearColor("#FFFFFF")
				renderer.setSize(window.innerWidth, window.innerHeight)

				/**
				 * Lights
				 */
				const ambientLight = new THREE.AmbientLight(0xffffff, 1.6)
				scene.add(ambientLight)

				const directionalLight1 = new THREE.DirectionalLight('#ffffff', 2.96)
				directionalLight1.castShadow = true
				directionalLight1.position.set(30, 60, 60)
				scene.add(directionalLight1)

				const directionalLight2 = new THREE.DirectionalLight('#ffffff', 2.96)
				directionalLight2.castShadow = true
				directionalLight2.position.set(30, 60, -60)
				scene.add(directionalLight2)

				// postprocessing
				composer = new EffectComposer(renderer);
				composer.addPass(new RenderPass(scene, camera));

				const params = {
					exposure: 0.25,
					bloomStrength: 0.4,
					bloomThreshold: 0,
					bloomRadius: 0.5
				};

				const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
				bloomPass.threshold = params.bloomThreshold;
				bloomPass.strength = params.bloomStrength;
				bloomPass.radius = params.bloomRadius;

				composer.addPass(bloomPass);

				scene.add(model.scene)

				controls.target.copy(model.scene.position);

				const animate = () => {
					requestAnimationFrame(animate)
					controls.update();
					composer.render()
				}

				animate()

				if (three.current && !document.querySelector('canvas')) three.current.appendChild(renderer.domElement)
			}

			init()
			setLoad(true)
		}

		const head = document.querySelector('head');
		const script = document.createElement('script');
		script.setAttribute('src', 'https://assets.calendly.com/assets/external/widget.js');
		head.appendChild(script);
	}, [load, model, sizes.width, sizes.height]);

	return (
		<>
			<Head>
				<meta charset="utf-8" />
				<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="#000000" />
				<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
				<meta name="google-site-verification" content="A8mouogszewpmVHxgnOtBBczFt2aT9Smx92xZDZS-tc" />
				<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />

				<title>STRATUS — Expert Blockchain Engineer</title>
				<meta name="title" content="STRATUS — Expert Blockchain Engineer" />
				<meta name="description" content="Metaverse and Blockchain solutions provider. Trusted by Metaverse GT." />

				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://stratus-dev.netlify.app/" />
				<meta property="og:title" content="STRATUS — Expert Blockchain Engineer" />
				<meta property="og:description" content="Metaverse and Blockchain solutions provider. Trusted by Metaverse GT." />
				<meta property="og:image" content="" />

				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://stratus-dev.netlify.app/" />
				<meta property="twitter:title" content="STRATUS — Expert Blockchain Engineer" />
				<meta property="twitter:description" content="Metaverse and Blockchain solutions provider. Trusted by Metaverse GT." />
				<meta property="twitter:image" content="" />
			</Head>

			<picture>
				<source srcSet={`assets/blobs${sizes.width <= 768 ? '/mobile/4' : '/1'}.svg`} type="image/svg" />
				<img src={`assets/blobs${sizes.width <= 768 ? '/mobile/4' : '/1'}.svg`} alt="1" />
			</picture>

			<picture>
				<source srcSet={`assets/blobs${sizes.width <= 768 ? '/mobile/3' : '/2'}.svg`} type="image/svg" />
				<img src={`assets/blobs${sizes.width <= 768 ? '/mobile/3' : '/2'}.svg`} alt="2" />
			</picture>

			<section ref={menuRef} className="menu">
				<div className="container">
					<h1>MENU</h1>

					<div className="list">
						<a href="#services" onClick={handleHideMenu}>OUR SERVICES</a>
						<a href="#values" onClick={handleHideMenu}>OUR VALUES</a>
					</div>

					<button className="close" onClick={handleHideMenu}>
						<picture>
							<source srcSet="assets/icons/close.svg" type="image/png" />
							<img src="assets/icons/close.svg" alt="close icon" />
						</picture>
					</button>
				</div>
			</section>

			<section className="header">
				<picture>
					<source srcSet={`assets/1/blobs${sizes.width <= 768 ? '/mobile' : ''}/1.svg`} type="image/svg" />
					<img src={`assets/1/blobs${sizes.width <= 768 ? '/mobile' : ''}/1.svg`} alt="blob 1" />
				</picture>

				<picture>
					<source srcSet={`assets/1/blobs${sizes.width <= 768 ? '/mobile' : ''}/2.svg`} type="image/svg" />
					<img src={`assets/1/blobs${sizes.width <= 768 ? '/mobile' : ''}/2.svg`} alt="blob 2" />
				</picture>

				<picture>
					<source srcSet={`assets/1/blobs${sizes.width <= 768 ? '/mobile' : ''}/3.svg`} type="image/svg" />
					<img src={`assets/1/blobs${sizes.width <= 768 ? '/mobile' : ''}/3.svg`} alt="blob 3" />
				</picture>

				<div ref={three} className="three"></div>
				{sizes.width < 768 ? <div className="scroll"></div> : undefined}

				<div className="upper-left">
					<div className="logo">
						<picture>
							<source srcSet="assets/logo.png" type="image/png" />
							<img src="assets/logo.png" alt="STRATUS logo" />
						</picture>

						<div>
							<h1>STRATUS</h1>
							<p>Web 3.0 Agency</p>
						</div>
					</div>

					<button onClick={e => {
						e.preventDefault();
						window.open('https://calendly.com/stratus_agency/meet');
					}} className="proposal">REQUEST A PROPOSAL</button>
				</div>

				<div className="upper-right">
					<nav>
						<button onClick={e => {
							e.preventDefault();

							document.body.classList.add('stop-scrolling')

							gsap.to(menuRef.current, {
								y: 0,
								opacity: 1,
								zIndex: 999,
								duration: 0.25
							})
						}}>
							<picture>
								<source srcSet="assets/navbar.svg" type="image/svg" />
								<img src="assets/navbar.svg" alt="navbar icon" />
							</picture>
						</button>
					</nav>
				</div>

				{/* <div className="bottom-left">
					<a href="https://www.linkedin.com/company/stratus-web3/" target="_blank" rel="noreferrer">
						<img src="assets/icons/linkedin_white.svg" alt="linkedin" />
					</a>
				</div> */}

				<div className="bottom-center">
					<h1>STRATUS,</h1>

					<picture>
						<source srcSet={`assets/${sizes.width <= 768 ? 'small_' : 'big_'}line.svg`} type="image/svg" />
						<img src={`assets/${sizes.width <= 768 ? 'small_' : 'big_'}line.svg`} alt="line" />
					</picture>

					<h2>
						The next professionnal <br />
						agency in Web 3.0
					</h2>

					<button>
						<picture>
							<source srcSet="assets/icons/scroll_icon.svg" type="image/svg" />
							<img src="assets/icons/scroll_icon.svg" alt="scroll icon" />
						</picture>
					</button>
				</div>
			</section>

			<section className="services" id="services">
				<h1>OUR SERVICES</h1>

				<div className="list">
					<div className="element">
						<picture>
							<source srcSet="assets/1/services/1.svg" type="image/svg" />
							<img src="assets/1/services/1.svg" alt="1st" />
						</picture>

						<div className="text">
							<h2>Convert websites from Web 2.0 to 3.0</h2>
							<p>Your current website is in Web 2.0 and you want to implement it the Web 3.0? This is exactly what we are doing for you! Contact us for more details.</p>
						</div>
					</div>

					<div className="element">
						<picture>
							<source srcSet="assets/1/services/2.svg" type="image/svg" />
							<img src="assets/1/services/2.svg" alt="2nd" />
						</picture>

						<div className="text">
							<h2>Creation of Web 3.0 tools/platforms</h2>
							<p>Your next project requires a few of Web 3.0 tools? We can build personalized Web 3.0 tools just for you! Contact us for more details.</p>
						</div>
					</div>

					<div className="element">
						<picture>
							<source srcSet="assets/1/services/3.svg" type="image/svg" />
							<img src="assets/1/services/3.svg" alt="3rd" />
						</picture>

						<div className="text">
							<h2>Audit/analysis of your Web 3.0 projects</h2>
							<p>Need an advice about a new Web 3.0 project/business? We can find your competitors, what to use, then how to build it. Contact us for more details.</p>

							<button onClick={() => window.open('https://calendly.com/stratus_agency/meet')} className="schedule">
								SCHEDULE A MEETING
							</button>
						</div>
					</div>
				</div>
			</section>

			<section className="values" id="values">
				<h1>OUR VALUES</h1>

				<div className="list">
					<div className="row">
						<div className="element">
							<picture>
								<source srcSet="assets/1/values/1.svg" type="image/svg" />
								<img src="assets/1/values/1.svg" alt="1st" />
							</picture>

							<p>
								Track progress in <br />
								real time
							</p>
						</div>

						<div className="element">
							<picture>
								<source srcSet="assets/1/values/2.svg" type="image/svg" />
								<img src="assets/1/values/2.svg" alt="2nd" />
							</picture>

							<p>
								Get advices from <br />
								true experts
							</p>
						</div>

						{sizes.width > 768 ?
							<div className="element">
								<picture>
									<source srcSet="assets/1/values/3.svg" type="image/svg" />
									<img src="assets/1/values/3.svg" alt="3rd" />
								</picture>

								<p>
									Long term <br />
									vision
								</p>
							</div> : undefined}
					</div>

					{sizes.width <= 768 ?
						<div className="element one">
							<picture>
								<source srcSet="assets/1/values/1.svg" type="image/svg" />
								<img src="assets/1/values/1.svg" alt="1st" />
							</picture>

							<p>
								Long term <br />
								vision
							</p>
						</div> : undefined}

					<div className="row">
						<div className="element">
							<picture>
								<source srcSet="assets/1/values/4.svg" type="image/svg" />
								<img src="assets/1/values/4.svg" alt="4th" />
							</picture>

							<p>
								12h maximum <br />
								response time
							</p>
						</div>

						<div className="element">
							<picture>
								<source srcSet="assets/1/values/5.svg" type="image/svg" />
								<img src="assets/1/values/5.svg" alt="5th" />
							</picture>

							<p>
								Tailored solution for <br />
								each organisation
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="clients">
				<picture>
					<source srcSet="assets/1/waves/wave_1.svg" type="image/svg" />
					<img src="assets/1/waves/wave_1.svg" alt="wave 1" />
				</picture>

				<h1>OUR CLIENTS</h1>

				<div className="element">
					<picture>
						<source srcSet="assets/1/clients/megt.svg" type="image/svg" />
						<img src="assets/1/clients/megt.svg" alt="megt" />
					</picture>

					<div className="text">
						<h2>METAVERSE GT</h2>
						<p>A french metaverse made with love by us, we have developed the whole functioning from scratch. A multiplayer game, Web 3.0 tools, business auditing, configuring operation of back-end and front-end sides. All of what we can serve to you!</p>
					</div>
				</div>

				<button onClick={() => window.open('https://calendly.com/stratus_agency/meet')}>BECOME OUR NEXT CLIENT</button>

				<picture>
					<source srcSet="assets/1/waves/wave_2.svg" type="image/svg" />
					<img src="assets/1/waves/wave_2.svg" alt="wave 2" />
				</picture>
			</section>

			<section className="work">
				<h1>OUR WORK</h1>

				<a href="https://megt.io" target="_blank" rel="noreferrer">
					<picture>
						<source srcSet="assets/1/work/1.png" type="image/png" />
						<img src="assets/1/work/1.png" alt="work 1" />
					</picture>
				</a>

				<a href="https://github.com/solidity-docs/fr-french" target="_blank" rel="noreferrer">
					<picture>
						<source srcSet="assets/1/work/2.png" type="image/png" />
						<img src="assets/1/work/2.png" alt="work 2" />
					</picture>
				</a>

				<div className="row">
					<a href="https://form.questionscout.com/6356e687efdc2d82c05e554a" target="_blank" rel="noreferrer">
						<picture>
							<source srcSet="assets/1/work/3.png" type="image/png" />
							<img src="assets/1/work/3.png" alt="work 3" />
						</picture>
					</a>

					<a href="https://mont-blanc-climate-change.netlify.app/" target="_blank" rel="noreferrer">
						<picture>
							<source srcSet="assets/1/work/4.png" type="image/png" />
							<img src="assets/1/work/4.png" alt="work 4" />
						</picture>
					</a>
				</div>
			</section>

			<section className="call">
				<h1>
					SCHEDULE A CALL <br />
					WITH US
				</h1>

				<div
					className="calendly-inline-widget"
					data-url="https://calendly.com/stratus_agency/meet"
					style={{ minWidth: sizes.width <= 768 ? `${window.innerWidth * 0.8}px` : '1220px', height: sizes.width <= 768 ? '950px' : '780px' }} />
			</section>

			<footer>
				<picture>
					<source srcSet={`assets/footer/${sizes.width <= 768 ? 'mobile/' : ''}wave.svg`} type="image/svg" />
					<img src={`assets/footer/${sizes.width <= 768 ? 'mobile/' : ''}wave.svg`} alt="wave" />
				</picture>

				<div className="headline row">
					<picture>
						<source srcSet="assets/footer/logo.svg" type="image/svg" />
						<img src="assets/footer/logo.svg" alt="logo" />
					</picture>

					<div>
						<h2>STRATUS</h2>
						<p>We bring you to Web 3.0</p>
					</div>
				</div>

				<div className="subheadline">
					<hr />
					<p>Metaverse and Blockchain Solutions Provider. Trusted by Metaverse GT.</p>
				</div>

				<div className="details">
					<div className="container row">
						<div className="element">
							<h2>OUR VALUES</h2>

							<div className="list">
								<p>Track progress in real time</p>
								<p>Get advices from true experts</p>
								<p>Long term vision</p>
								<p>12h maximum response time</p>
								<p>Tailored solution for each organisation</p>
							</div>
						</div>

						<div className="element">
							<h2>OUR SERVICES</h2>

							<div className="list">
								<p>Convert websites from Web 2.0 to 3.0</p>
								<p>Creation of Web 3.0 tools/platforms</p>
								<p>Audit/analysis of your Web 3.0 projects</p>
							</div>
						</div>

						<div className="element">
							<h2>FOLLOW US</h2>

							<a href="https://www.linkedin.com/company/stratus-web3/" target="_blank" rel="noreferrer">
								<picture>
									<source srcSet="assets/icons/linkedin_white.svg" type="image/svg" />
									<img src="assets/icons/linkedin_white.svg" alt="linkedin" />
								</picture>
							</a>

							<a href="https://github.com/stratusagency" target="_blank" rel="noreferrer">
								<picture>
									<source srcSet="assets/icons/github.png" type="image/png" />
									<img src="assets/icons/github.png" alt="github" />
								</picture>
							</a>
						</div>
					</div>

					<div className="bottom-center">
						<h5>2022 © EI STRATUS. All Rights Reserved.</h5>
						<h5>Website under construction...</h5>
					</div>
				</div>
			</footer>
		</>
	);
}