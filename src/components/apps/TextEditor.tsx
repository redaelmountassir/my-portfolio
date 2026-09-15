import { motion, type Transition, useScroll } from "motion/react";
import { useContext, useEffect, useRef, useState } from "react";
import { randInt } from "three/src/math/MathUtils.js";
import cenoteImg from "../../assets/images/about/cenote.jpg";
import chichenItzaImg from "../../assets/images/about/chichen_itza.jpg";
import cupcakesImg from "../../assets/images/about/cupcakes.jpg";
import donkeyImg from "../../assets/images/about/donkey.jpg";
import istanbulImg from "../../assets/images/about/istanbul.jpg";
import marrakeshImg from "../../assets/images/about/marrakesh.jpg";
import muffinsImg from "../../assets/images/about/muffins.jpg";
import newYorkImg from "../../assets/images/about/new_york.jpg";
import parisImg from "../../assets/images/about/paris.jpg";
import philly1Img from "../../assets/images/about/philly_1.jpg";
import philly2Img from "../../assets/images/about/philly_2.jpg";
import philly3Img from "../../assets/images/about/philly_3.jpg";
import quebecImg from "../../assets/images/about/quebec.jpg";
import rabatImg from "../../assets/images/about/rabat.jpg";
import soccerImg from "../../assets/images/about/soccer.jpg";
import camImg from "../../assets/images/cam.png";
import { MobileContext } from "../../store/MobileContext";
import { cn, ease25Steps, ease5Steps, useInterval } from "../../utils";
import ContentEditable from "../ContentEditable";
import Float from "../Float";
import GlitchText from "../GlitchText";
import NameCard from "../NameCard";
import ScrollMarquee from "../ScrollMarquee";
import SmartImage from "../SmartImage";
import { InternalWindowDataContext } from "../window/Window";

const countSentences = (str: string) => {
	const sentences = str.split(/[.!?]/);

	const nonEmptySentences = sentences.filter(
		sentence => sentence.trim() !== "",
	);

	return nonEmptySentences.length;
};

const countWords = (str: string) => str.trim().split(/\s+/).length;

const transition: Transition = {
	ease: ease25Steps,
	duration: 0.5,
	type: "tween",
};

const TextEditor = () => {
	const windowData = useContext(InternalWindowDataContext);
	if (!windowData) return;
	const { sysObj, setTitle, getWidth } = windowData;
	if (!("ext" in sysObj) || typeof sysObj.value !== "string") return;

	useEffect(() => {
		if (!setTitle || !sysObj) return;
		setTitle(`${sysObj.name}.${sysObj.ext} - Text Editor`);
	}, [setTitle, sysObj]);

	const isMobile = useContext(MobileContext);

	const scrollContainer = useRef(null);
	const { scrollY } = useScroll({
		container: scrollContainer,
	});

	const [text, setText] = useState(sysObj.value);
	const wordCount = countWords(text);
	const sentenceCount = countSentences(text);

	const imgs = [
		<SmartImage
			className="h-125"
			alt="Jumping into a Mexican cenote"
			src={cenoteImg}
		/>,
		<SmartImage
			className="h-125"
			alt="One of the wonders of the world: chichen itza"
			src={chichenItzaImg}
		/>,
		<SmartImage className="h-125" alt="My cupcakes" src={cupcakesImg} />,
		<SmartImage
			className="h-125"
			alt="Me riding a donkey"
			src={donkeyImg}
		/>,
		<SmartImage
			className="h-125"
			alt="Istanbul, Turkey"
			src={istanbulImg}
		/>,
		<SmartImage
			className="h-125"
			alt="My favorite Moroccan city: Marrakesh"
			src={marrakeshImg}
		/>,
		<SmartImage className="h-125" alt="My muffins" src={muffinsImg} />,
		<SmartImage className="h-125" alt="New York" src={newYorkImg} />,
		<SmartImage className="h-125" alt="Paris, France" src={parisImg} />,
		<SmartImage
			className="h-125"
			alt="Just a bit of Philly"
			src={philly1Img}
		/>,
		<SmartImage
			className="h-125"
			alt="Some more Philly"
			src={philly2Img}
		/>,
		<SmartImage className="h-125" alt="I love Philly" src={philly3Img} />,
		<SmartImage className="h-125" alt="Quebec, Canada" src={quebecImg} />,
		<SmartImage className="h-125" alt="Rabat, Morocco" src={rabatImg} />,
		<SmartImage
			className="h-125"
			alt="My favorite sport soccer"
			src={soccerImg}
		/>,
	];
	const [currentImg, setCurrentImg] = useState(randInt(0, imgs.length - 1));
	const updateImg = () => setCurrentImg(old => (old + 1) % imgs.length);
	useInterval(updateImg, 20000);

	return (
		<>
			<div className="absolute size-full bg-black bg-cover bg-center motion-safe:bg-[url('/bg_imgs/stars.gif')] md:-z-1" />
			<p className="bottom-0 z-1 block w-full overflow-hidden bg-white-primary p-1 text-center whitespace-pre text-black-primary md:fixed">
				{[
					`${wordCount} word${wordCount > 1 ? "s" : ""}`,
					`${text.length} character${text.length > 1 ? "s" : ""}`,
					`${sentenceCount} sentence${sentenceCount > 1 ? "s" : ""}`,
				].join("    ")}
			</p>
			<div
				className="relative flex-1 overflow-x-hidden overflow-y-auto md:mb-8"
				ref={scrollContainer}
			>
				<NameCard />
				<ScrollMarquee
					scroll={scrollY}
					panSpeed={2}
					className="w-full border-y-2 border-white-primary bg-yellow-accent py-1 font-bold whitespace-pre text-black-primary"
				>
					{
						"Developer  ►  Hackerman  ►  UI/UX  ►  Design  ►  Vaporwave  ►  Gaming  ►  Since 2006  ►  "
					}
				</ScrollMarquee>
				<div className="relative clearfix gap-6 bg-[repeating-linear-gradient(#1f0728,#1f0728_2em,#291632_2em,#291632_4em)] p-8 py-16 text-white-primary md:bg-[repeating-linear-gradient(#f5f9ff06,#f5f9ff06_2em,#f5f9ff10_2em,#f5f9ff10_4em)] md:py-32 md:pl-6">
					<div
						className={cn(
							"relative w-auto cursor-pointer text-right sm:text-center",
							getWidth() <= 800
								? "mb-20 md:mb-14 md:hidden"
								: "group relative mb-7 ml-8 h-full w-2/5 flicker transition duration-1000 ease-steps2 md:float-right md:block",
						)}
						onClick={updateImg}
					>
						<Float className="group xs:inline-block">
							{imgs.map((img, i) => (
								<motion.div
									key={i}
									animate={`${isMobile ? "mobile" : ""}${currentImg === i ? "Shown" : "Hidden"}`}
									variants={{
										Shown: {
											maskPosition: "0 0%",
											transition,
										},
										Hidden: {
											maskPosition: "0 100%",
											transition,
										},
										mobileShown: {
											clipPath: "inset(0 0% 0 0)",
											transition: {
												duration: 0.5,
												ease: ease5Steps,
												type: "tween",
											},
										},
										mobileHidden: {
											clipPath: "inset(0 100% 0 0)",
											transition: {
												delay: 0.5,
												duration: 0.5,
												ease: ease5Steps,
												type: "tween",
											},
										},
									}}
									className={cn(
										"darken-left top-0 border-2 border-white-primary bg-black pixel-mask grayscale transition ease-steps2 group-hover:grayscale-0",
										i === 0 ? "inline-block" : "absolute",
									)}
								>
									{img}
								</motion.div>
							))}
						</Float>
						<SmartImage
							src={camImg}
							alt="camera"
							className="absolute right-0 bottom-0 hidden w-24 translate-x-1/3 -rotate-45 animate-blink sm:right-40 sm:block md:right-0"
						/>
					</div>
					<h3 className="static top-16 z-1 mb-7 w-full origin-bottom-left font-display text-7xl leading-[0.95] whitespace-nowrap uppercase xs:absolute xs:rotate-90 xs:shadow-black-primary sm:static! sm:rotate-0! sm:shadow-none">
						<span className="hidden xs:inline">† </span>
						<GlitchText
							onScroll
							scrollRoot={scrollContainer}
							decayRate={0.5}
						>
							ABOUT
						</GlitchText>
					</h3>
					<ContentEditable
						className="min-h-96 resize-none border-y-0 border-r-0 border-white-primary bg-transparent leading-8 outline-hidden md:ml-5 md:border-l-2 md:pl-7"
						value={text}
						onUpdate={setText}
					/>
				</div>
			</div>
		</>
	);
};

export default TextEditor;
