import { useScroll } from "motion/react";
import { useContext, useEffect, useRef, useState } from "react";
import { randInt } from "three/src/math/MathUtils.js";
import cenoteImg from "../../../assets/images/about/cenote.jpg";
import chichenItzaImg from "../../../assets/images/about/chichen_itza.jpg";
import cupcakesImg from "../../../assets/images/about/cupcakes.jpg";
import donkeyImg from "../../../assets/images/about/donkey.jpg";
import istanbulImg from "../../../assets/images/about/istanbul.jpg";
import marrakeshImg from "../../../assets/images/about/marrakesh.jpg";
import muffinsImg from "../../../assets/images/about/muffins.jpg";
import newYorkImg from "../../../assets/images/about/new_york.jpg";
import parisImg from "../../../assets/images/about/paris.jpg";
import philly1Img from "../../../assets/images/about/philly_1.jpg";
import philly2Img from "../../../assets/images/about/philly_2.jpg";
import philly3Img from "../../../assets/images/about/philly_3.jpg";
import quebecImg from "../../../assets/images/about/quebec.jpg";
import rabatImg from "../../../assets/images/about/rabat.jpg";
import soccerImg from "../../../assets/images/about/soccer.jpg";
import camImg from "../../../assets/images/cam.png";
import content from "../../../content/textEditor.yaml";
import { isFile } from "../../../store/types";
import { cn, useInterval } from "../../../utils";
import Float from "../../Float";
import GlitchText from "../../GlitchText";
import PixelDissolveMedia from "../../PixelDissolveMedia";
import ScrollMarquee from "../../ScrollMarquee";
import SmartImage from "../../SmartImage";
import { InternalWindowDataContext } from "../../window/windowContext";
import ContentEditable from "./ContentEditable";
import NameCard from "./NameCard";

const countSentences = (str: string) => {
	const sentences = str.split(/[.!?]/);

	const nonEmptySentences = sentences.filter(
		sentence => sentence.trim() !== "",
	);

	return nonEmptySentences.length;
};

const countWords = (str: string) => str.trim().split(/\s+/).length;

const photos = [
	{ img: cenoteImg, alt: content.photoAlt.cenote },
	{
		img: chichenItzaImg,
		alt: content.photoAlt.chichenItza,
	},
	{ img: cupcakesImg, alt: content.photoAlt.cupcakes },
	{ img: donkeyImg, alt: content.photoAlt.donkey },
	{ img: istanbulImg, alt: content.photoAlt.istanbul },
	{ img: marrakeshImg, alt: content.photoAlt.marrakesh },
	{ img: muffinsImg, alt: content.photoAlt.muffins },
	{ img: newYorkImg, alt: content.photoAlt.newYork },
	{ img: parisImg, alt: content.photoAlt.paris },
	{ img: philly1Img, alt: content.photoAlt.philly1 },
	{ img: philly2Img, alt: content.photoAlt.philly2 },
	{ img: philly3Img, alt: content.photoAlt.philly3 },
	{ img: quebecImg, alt: content.photoAlt.quebec },
	{ img: rabatImg, alt: content.photoAlt.rabat },
	{ img: soccerImg, alt: content.photoAlt.soccer },
];

const TextEditor = () => {
	const windowData = useContext(InternalWindowDataContext);
	if (!windowData) return;
	const { sysObj, setTitle, getWidth } = windowData;
	if (!isFile(sysObj) || typeof sysObj.value !== "string") return;

	useEffect(() => {
		if (!setTitle || !sysObj) return;
		setTitle(`${sysObj.name}.${sysObj.ext} - Text Editor`);
	}, [setTitle, sysObj]);

	const scrollContainer = useRef(null);
	const { scrollY } = useScroll({
		container: scrollContainer,
	});

	const [text, setText] = useState(sysObj.value);
	const wordCount = countWords(text);
	const sentenceCount = countSentences(text);

	const [currentImg, setCurrentImg] = useState(() =>
		randInt(0, photos.length - 1),
	);
	const [displayedImg, setDisplayedImg] = useState(currentImg);
	const updateImg = () => setCurrentImg(old => (old + 1) % photos.length);
	const frame = photos[displayedImg];
	useInterval(updateImg, 20000);

	return (
		<>
			<div className="about-stars-background absolute z-0 size-full bg-black bg-cover bg-center" />
			<p className="bottom-0 z-1 block w-full overflow-hidden bg-white-primary p-1 text-center whitespace-pre text-black-primary md:fixed">
				{[
					`${wordCount} ${wordCount > 1 ? content.status.wordPlural : content.status.wordSingular}`,
					`${text.length} ${text.length > 1 ? content.status.characterPlural : content.status.characterSingular}`,
					`${sentenceCount} ${sentenceCount > 1 ? content.status.sentencePlural : content.status.sentenceSingular}`,
				].join(content.status.separator)}
			</p>
			<div
				className="relative z-1 flex-1 overflow-x-hidden overflow-y-auto md:mb-8"
				ref={scrollContainer}
			>
				<NameCard />
				<ScrollMarquee
					scroll={scrollY}
					panSpeed={2}
					className="w-full border-y-2 bg-yellow-accent py-1 font-bold whitespace-pre text-black-primary"
				>
					{content.marquee}
				</ScrollMarquee>
				<div className="relative clearfix gap-6 bg-[repeating-linear-gradient(#1f0728,#1f0728_2em,#291632_2em,#291632_4em)] p-8 py-16 text-white-primary md:bg-[repeating-linear-gradient(#f5f9ff06,#f5f9ff06_2em,#f5f9ff10_2em,#f5f9ff10_4em)] md:py-32 md:pl-6">
					<button
						type="button"
						className={cn(
							"relative w-auto cursor-pointer text-right sm:text-center",
							getWidth() <= 800
								? "mb-20 md:mb-14 md:hidden"
								: "group relative mb-7 ml-8 h-full w-2/5 flicker transition duration-1000 ease-steps-2 md:float-right md:block",
						)}
						onClick={updateImg}
						aria-label={content.photoButtonLabel.replace(
							"{alt}",
							frame.alt,
						)}
					>
						<Float className="group xs:inline-block">
							<div
								className="relative inline-block h-125 border-2 bg-black transition ease-steps-2 group-hover:grayscale-0 group-focus-visible:grayscale-0 md:darken-left md:grayscale"
								style={{
									aspectRatio: `${frame.img.width} / ${frame.img.height}`,
								}}
								aria-hidden
							>
								<PixelDissolveMedia
									media={photos[currentImg].img}
									duration={0.5}
									objectFit="contain"
									onDisplay={next => {
										if (typeof next === "string") return;
										const index = photos.findIndex(
											photo => photo.img.src === next.src,
										);
										if (index >= 0) setDisplayedImg(index);
									}}
								/>
							</div>
						</Float>
						<SmartImage
							src={camImg}
							alt=""
							className="absolute right-0 bottom-0 hidden w-24 translate-x-1/3 -rotate-45 animate-blink motion-reduce:animate-none sm:right-40 sm:block md:right-0"
						/>
					</button>
					<h2 className="static top-16 z-1 mb-7 w-full origin-bottom-left font-display text-7xl leading-[0.95] whitespace-nowrap uppercase xs:absolute xs:rotate-90 xs:shadow-black-primary sm:static! sm:rotate-0! sm:shadow-none">
						<span className="hidden xs:inline">
							{content.headingDecoration}
						</span>
						<GlitchText
							onScroll
							scrollRoot={scrollContainer}
							decayRate={0.5}
						>
							{content.aboutHeading}
						</GlitchText>
					</h2>
					<ContentEditable
						className="mb-12 min-h-96 resize-none border-y-0 border-r-0 bg-transparent leading-8 outline-hidden [caret-shape:block] md:mb-0 md:ml-5 md:border-l-2 md:pl-7"
						value={text}
						onUpdate={setText}
					/>
				</div>
			</div>
		</>
	);
};

export default TextEditor;
