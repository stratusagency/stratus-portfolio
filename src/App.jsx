import { useEffect, useState, useRef } from "react"

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

	const three = useRef()

	useEffect(() => {
		const sizes = {
			width: window.innerWidth,
			height: window.innerHeight
		}

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
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
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
				}, xhr => {
					console.log(xhr)
				}, console.error)
		}

		if (load && three.current) {
			const init = async () => {
				let controls

				controls = new OrbitControls(camera, renderer.domElement)
				controls.enableDamping = true
				controls.enableZoom = false
				controls.enablePan = false
				controls.enableRotate = window.innerWidth > 768
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
					bloomRadius: 1
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
	}, [load, model])

	return (
		<>
			<img src={`assets/blobs${window.innerWidth <= 768 ? '/mobile/4' : '/1'}.svg`} alt="1" />
			<img src={`assets/blobs${window.innerWidth <= 768 ? '/mobile/3' : '/2'}.svg`} alt="2" />

			<section className="menu">
				<div className="container">
					<h1>MENU</h1>

					<div className="list">
						<a href="#services" onClick={e => {
							gsap.to('section.menu', {
								opacity: 0,
								y: '-100vh',
								duration: 0.25
							});
						}}>OUR SERVICES</a>
						<a href="#values" onClick={e => {
							gsap.to('section.menu', {
								opacity: 0,
								y: '-100vh',
								duration: 0.25
							});
						}}>OUR VALUES</a>
					</div>

					<button className="close" onClick={e => {
						e.preventDefault();

						gsap.to('section.menu', {
							opacity: 0,
							y: '-100vh',
							duration: 0.25
						});
					}}>
						<img src="assets/icons/close.svg" alt="close icon" />
					</button>
				</div>
			</section>

			<section className="header">
				<img src={`assets/1/blobs${window.innerWidth <= 768 ? '/mobile' : ''}/1.svg`} alt="blob 1" />
				<img src={`assets/1/blobs${window.innerWidth <= 768 ? '/mobile' : ''}/2.svg`} alt="blob 2" />
				<img src={`assets/1/blobs${window.innerWidth <= 768 ? '/mobile' : ''}/3.svg`} alt="blob 3" />

				<div ref={three} className="three"></div>
				{window.innerWidth < 768 ? <div className="scroll"></div> : undefined}

				<div className="upper-left">
					<div className="logo">
						<img src="assets/logo.png" alt="STRATUS logo" />

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

							gsap.to('section.menu', {
								y: 0,
								opacity: 1,
								duration: 0.25
							})
						}}>
							<img src="assets/navbar.svg" alt="navbar icon" />
						</button>
					</nav>
				</div>

				<div className="bottom-left">
					<a href="https://www.linkedin.com/company/stratus-web3/" target="_blank" rel="noreferrer">
						<img src="assets/icons/linkedin_white.svg" alt="linkedin" />
					</a>
				</div>

				<div className="bottom-center">
					<h1>STRATUS,</h1>
					<img src={`assets/${window.innerWidth <= 768 ? 'small_' : 'big_'}line.svg`} alt="line" />
					<h2>
						The next professionnal <br />
						agency in Web 3.0
					</h2>

					<button>
						<img src="assets/icons/scroll_icon.svg" alt="scroll icon" />
					</button>
				</div>
			</section>

			<section className="services" id="services">
				<h1>OUR SERVICES</h1>

				<div className="list">
					<div className="element">
						<img src="assets/1/services/1.svg" alt="1st" />

						<div className="text">
							<h2>Convert websites from Web 2.0 to 3.0</h2>
							<p>Your current website is in Web 2.0 and you want to implement it the Web 3.0? This is exactly what we are doing for you! Contact us for more details.</p>
						</div>
					</div>

					<div className="element">
						<img src="assets/1/services/2.svg" alt="2nd" />

						<div className="text">
							<h2>Creation of Web 3.0 tools/platforms</h2>
							<p>Your next project requires a few of Web 3.0 tools? We can build personalized Web 3.0 tools just for you! Contact us for more details.</p>
						</div>
					</div>

					<div className="element">
						<img src="assets/1/services/3.svg" alt="3rd" />

						<div className="text">
							<h2>Audit/analysis of your Web 3.0 projects</h2>
							<p>Need an advice about a new Web 3.0 project/business? We can find your competitors, what to use, then how to build it. Contact us for more details.</p>

							<button className="schedule">
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
							<img src="assets/1/values/1.svg" alt="1st" />
							<p>
								Track progress in <br />
								real time
							</p>
						</div>

						<div className="element">
							<img src="assets/1/values/2.svg" alt="2nd" />
							<p>
								Get advices from <br />
								true experts
							</p>
						</div>

						{window.innerWidth > 768 ?
							<div className="element">
								<img src="assets/1/values/3.svg" alt="3rd" />
								<p>
									Long term <br />
									vision
								</p>
							</div> : undefined}
					</div>

					{window.innerWidth <= 768 ?
						<div className="element one">
							<img src="assets/1/values/3.svg" alt="3rd" />
							<p>
								Long term <br />
								vision
							</p>
						</div> : undefined}

					<div className="row">
						<div className="element">
							<img src="assets/1/values/4.svg" alt="4th" />
							<p>
								12h maximum <br />
								response time
							</p>
						</div>

						<div className="element">
							<img src="assets/1/values/5.svg" alt="5th" />
							<p>
								Tailored solution for <br />
								each organisation
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="clients">
				<img src="assets/1/waves/wave_1.svg" alt="wave 1" />

				<h1>OUR CLIENTS</h1>

				<div className="element">
					<img src="assets/1/clients/megt.svg" alt="megt" />

					<div className="text">
						<h2>METAVERSE GT</h2>
						<p>A french metaverse made with love by us, we have developed the whole functioning from scratch. A multiplayer game, Web 3.0 tools, business auditing, configuring operation of back-end and front-end sides. All of what we can serve to you!</p>
					</div>
				</div>

				<button>BECOME OUR NEXT CLIENT</button>

				<img src="assets/1/waves/wave_2.svg" alt="wave 2" />
			</section>

			<section className="work">
				<h1>OUR WORK</h1>

				<img src="assets/1/work/1.png" alt="work 1" />

				<div className="row">
					<img src="assets/1/work/2.png" alt="work 2" />
					<img src="assets/1/work/3.png" alt="work 3" />
				</div>
			</section>

			<section className="call">
				<h1>
					SCHEDULE A CALL <br />
					WITH US
				</h1>

				<div
					className="calendly-inline-widget"
					data-url="https://calendly.com/demaupeoucorentin/meet"
					style={{ minWidth: window.innerWidth <= 768 ? '196px' : '1220px', height: '780px' }} />
			</section>

			<footer>
				<img src={`assets/footer/${window.innerWidth <= 768 ? 'mobile/' : ''}wave.svg`} alt="wave" />

				<div className="headline row">
					<img src="assets/footer/logo.svg" alt="logo" />

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
								<img src="assets/icons/linkedin_white.svg" alt="linkedin" />
							</a>
						</div>
					</div>

					<div className="bottom-center">
						<h5>2022 © EI STRATUS. All Rights Reserved.</h5>
						<h6>Website under construction...</h6>
					</div>
				</div>
			</footer>
		</>
	);
}