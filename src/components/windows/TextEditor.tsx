import React, { useContext, useEffect, useRef, useState } from "react";
import { motion, Transition, useScroll } from "framer-motion";
import { WindowDataContext } from "../Window";
import { ease25Steps, ease5Steps, useInterval } from "../../utils";
import NameCard from "../NameCard";
import ScrollMarquee from "../ScrollMarquee";
import GlitchText from "../GlitchText";
import ContentEditable from "../ContentEditable";
import Float from "../Float";
import { StaticImage } from "gatsby-plugin-image";
import { randInt } from "three/src/math/MathUtils";
import { MobileContext } from "../OS";

function countSentences(str: string) {
	const sentences = str.split(/[.!?]/);

	const nonEmptySentences = sentences.filter(
		(sentence) => sentence.trim() !== "",
	);

	return nonEmptySentences.length;
}

const countWords = (str: string) => str.trim().split(/\s+/).length;

const transition: Transition = {
	ease: ease25Steps,
	duration: 0.5,
	type: "tween",
};

const TextEditor = () => {
	const windowData = useContext(WindowDataContext);
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
		<StaticImage
			height={500}
			alt="Jumping into a Mexican cenote"
			src="../../images/about/cenote.jpg"
		/>,
		<StaticImage
			height={500}
			alt="One of the wonders of the world: chichen itza"
			src="../../images/about/chichen_itza.jpg"
		/>,
		<StaticImage
			height={500}
			alt="My cupcakes"
			src="../../images/about/cupcakes.jpg"
		/>,
		<StaticImage
			height={500}
			alt="Me riding a donkey"
			src="../../images/about/donkey.jpg"
		/>,
		<StaticImage
			height={500}
			alt="Istanbul, Turkey"
			src="../../images/about/istanbul.jpg"
		/>,
		<StaticImage
			height={500}
			alt="My favorite Moroccan city: Marrakesh"
			src="../../images/about/marrakesh.jpg"
		/>,
		<StaticImage
			height={500}
			alt="My muffins"
			src="../../images/about/muffins.jpg"
		/>,
		<StaticImage
			height={500}
			alt="New York"
			src="../../images/about/new_york.jpg"
		/>,
		<StaticImage
			height={500}
			alt="Paris, France"
			src="../../images/about/paris.jpg"
		/>,
		<StaticImage
			height={500}
			alt="Just a bit of Philly"
			src="../../images/about/philly_1.jpg"
		/>,
		<StaticImage
			height={500}
			alt="Some more Philly"
			src="../../images/about/philly_2.jpg"
		/>,
		<StaticImage
			height={500}
			alt="I love Philly"
			src="../../images/about/philly_3.jpg"
		/>,
		<StaticImage
			height={500}
			alt="Quebec, Canada"
			src="../../images/about/quebec.jpg"
		/>,
		<StaticImage
			height={500}
			alt="Rabat, Morocco"
			src="../../images/about/rabat.jpg"
		/>,
		<StaticImage
			height={500}
			alt="My favorite sport soccer"
			src="../../images/about/soccer.jpg"
		/>,
	];
	const [currentImg, setCurrentImg] = useState(randInt(0, imgs.length - 1));
	const updateImg = () => setCurrentImg((old) => (old + 1) % imgs.length);
	useInterval(updateImg, 20000);

	return (
		<>
			<div className="absolute h-full w-full bg-black bg-cover bg-center motion-safe:bg-[url('/bg_imgs/stars.gif')] md:-z-10" />
			<p className="bottom-0 z-10 block w-full overflow-hidden whitespace-pre bg-white-primary p-1 text-center text-black-primary md:fixed">
				{[
					`${wordCount} word${wordCount > 1 ? "s" : ""}`,
					`${text.length} character${text.length > 1 ? "s" : ""}`,
					`${sentenceCount} sentence${sentenceCount > 1 ? "s" : ""}`,
				].join("    ")}
			</p>
			<div
				className="relative flex-1 overflow-y-auto overflow-x-hidden md:mb-8"
				ref={scrollContainer}
			>
				<NameCard />
				<ScrollMarquee
					scroll={scrollY}
					panSpeed={2}
					className="w-full whitespace-pre border-y-2 border-white-primary bg-yellow-accent py-1 font-bold text-black-primary"
				>
					{
						"Developer  ►  Hackerman  ►  UI/UX  ►  Design  ►  Vaporwave  ►  Gaming  ►  Since 2006  ►  "
					}
				</ScrollMarquee>
				<div className="clearfix relative gap-6 bg-[repeating-linear-gradient(#1f0728,#1f0728_2em,#291632_2em,#291632_4em)] p-8 py-16 text-white-primary md:bg-[repeating-linear-gradient(#f5f9ff06,#f5f9ff06_2em,#f5f9ff10_2em,#f5f9ff10_4em)] md:py-32 md:pl-6">
					<div
						className={`relative w-auto cursor-pointer text-right sm:text-center ${
							getWidth() <= 800
								? "mb-20 md:mb-14 md:hidden"
								: "flicker group relative mb-7 ml-8 h-full w-2/5 transition duration-1000 ease-steps2 md:float-right md:block"
						}`}
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
											WebkitMaskPosition: "0 0%",
											transition,
										},
										Hidden: {
											maskPosition: "0 100%",
											WebkitMaskPosition: "0 100%",
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
									className={`darken-left pixel-mask top-0 border-2 border-white-primary bg-black grayscale transition ease-steps2 group-hover:grayscale-0 ${i === 0 ? "inline-block" : "absolute"}`}
								>
									{img}
								</motion.div>
							))}
						</Float>
						<StaticImage
							src="../../images/cam.png"
							alt="camera"
							width={96}
							placeholder="none"
							className="absolute bottom-0 right-0 hidden w-24 translate-x-1/3 -rotate-45 animate-blink sm:right-40 sm:block md:right-0"
						/>
					</div>
					<h3 className="static top-16 z-10 mb-7 w-full origin-bottom-left whitespace-nowrap font-display text-7xl uppercase leading-[0.95] sm:static! sm:rotate-0! sm:shadow-none xs:absolute xs:rotate-90 xs:shadow-black-primary">
						<span className="hidden xs:inline">† </span>
						<GlitchText onScroll scrollRoot={scrollContainer} decayRate={0.5}>
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
