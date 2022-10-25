import { useEffect, useState, useRef } from "react"

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

		renderer.toneMapping = THREE.CineonToneMapping
		renderer.shadowMap.type = THREE.PCFSoftShadowMap
		renderer.outputEncoding = THREE.sRGBEncoding
		renderer.physicallyCorrectLights = true
		renderer.toneMappingExposure = 2
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
				"assets/models/bitcoin/scene.gltf",
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
				const controls = new OrbitControls(camera, renderer.domElement)
				controls.enableDamping = true
				controls.enableZoom = false
				controls.enablePan = false
				controls.minPolarAngle = Math.PI / 2
				controls.maxPolarAngle = Math.PI / 2
				controls.minDistance = 200
				controls.maxDistance = 200
				controls.autoRotate = true
				controls.autoRotateSpeed = 0.3

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

				scene.add(model.scene)

				controls.target.copy(model.scene.position);

				const animate = () => {
					requestAnimationFrame(animate)
					controls.update()
					renderer.render(scene, camera)
				}

				animate()

				if (three.current) three.current.appendChild(renderer.domElement)
			}

			init()
			setLoad(true)
		}
	}, [load, model])

	return (
		<>
			<img src="assets/blobs/1.svg" alt="1" />
			<img src="assets/blobs/2.svg" alt="2" />

			<section className="header">
				<img src="assets/1/blobs/1.svg" alt="blob 1" />
				<img src="assets/1/blobs/2.svg" alt="blob 2" />
				<img src="assets/1/blobs/3.svg" alt="blob 3" />

				<div ref={three} className="three"></div>

				<div className="upper-left">
					<div className="logo">
						<img src="assets/logo.png" alt="STRATUS logo" />

						<div>
							<h1>STRATUS</h1>
							<p>We bring you to Web 3.0</p>
						</div>
					</div>

					<button className="proposal">GET A PROPOSAL</button>
				</div>

				<div className="upper-right">
					<nav>
						<button>
							<img src="assets/navbar.svg" alt="navbar icon" />
						</button>
					</nav>
				</div>

				<div className="bottom-left">
					<button className="linkedin">
						<img src="assets/icons/linkedin_white.svg" alt="linkedin icon" />
					</button>
				</div>

				<div className="bottom-center">
					<h1>STRATUS,</h1>
					<h2>
						The next professionnal <br />
						agency in Web 3.0
					</h2>

					<button>
						<img src="assets/icons/scroll_icon.svg" alt="scroll icon" />
					</button>
				</div>
			</section>

			<section className="services">
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

			<section className="values">
				<h1>OUR VALUES</h1>

				<div className="list">
					<div className="row">
						<div className="element">
							<img src="assets/1/values/1.svg" alt="1st" />
							<p>
								Giving the track <br />
								of the work in live
							</p>
						</div>

						<div className="element">
							<img src="assets/1/values/2.svg" alt="2nd" />
							<p>
								Giving our tips <br />
								as experts for free
							</p>
						</div>

						<div className="element">
							<img src="assets/1/values/3.svg" alt="3rd" />
							<p>
								Building long-term <br />
								partnerships
							</p>
						</div>
					</div>

					<div className="row">
						<div className="element">
							<img src="assets/1/values/4.svg" alt="4th" />
							<p>
								Responding in <br />
								12h delay
							</p>
						</div>

						<div className="element">
							<img src="assets/1/values/5.svg" alt="5th" />
							<p>
								Making all of our <br />
								clients unique
							</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}