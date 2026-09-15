import emailjs from "@emailjs/browser";
import { anticipate, easeInOut, useAnimate } from "motion/react";
import { useContext, useState } from "react";
import gitHubImg from "../../assets/images/github.png";
import linkedInImg from "../../assets/images/linkedIn.png";
import phoneImg from "../../assets/images/phone.png";
import sendMessageImg from "../../assets/images/send_message.png";
import triangle2Img from "../../assets/images/triangle_gradient.png";
import triangleImg from "../../assets/images/triangle_outline_blue.png";
import { cn } from "../../utils";
import SmartImage from "../SmartImage";
import { InternalWindowDataContext } from "../window/Window";

const OFFSET_PATH =
	'path("M32 0C67-38 296.4-106.9 251.4-151.9 189.5-213.8 83.4 81.6 16.4 57.6.4 47.6 9.4 23.6 32 0")';
const OFFSET_ANCHOR = "top right";
const OFFSET_ROT = "auto 45deg";

const Mail = () => {
	const width = useContext(InternalWindowDataContext)?.getWidth() ?? 0;

	const [scope, animate] = useAnimate();
	const [scope2, animate2] = useAnimate();

	const [inbox, setInbox] = useState<boolean[]>([]);

	return (
		<div className="flex flex-1 flex-col overflow-hidden border-white-primary pb-16 text-white-primary md:flex-row md:pb-0">
			<ul
				className={cn(
					"flex shrink-0 overflow-hidden border-white-primary transition-all ease-steps2 md:block md:max-w-14 md:border-r-2 md:hover:max-w-60 md:hover:bg-black-primary",
					width > 1200 && "md:max-w-60! md:bg-black-primary!",
					width < 400 && "md:hidden",
				)}
			>
				<li className="grow">
					<a
						href="tel:2672312928"
						target="_blank"
						className="group block border-b-2 p-4 text-center whitespace-nowrap hover:bg-white-primary hover:text-black-primary md:pr-0 md:text-left"
					>
						<SmartImage
							src={phoneImg}
							alt="LinkedIn Logo"
							className="inline-block h-6 transition-all ease-steps2 group-hover:invert xs:mr-4"
						/>
						<span className="mr-4 hidden xs:inline">
							267-231-2928
						</span>
					</a>
				</li>
				<li className="grow">
					<a
						href="https://www.linkedin.com/in/reda-elmountassir"
						target="_blank"
						className="group block border-b-2 p-4 text-center whitespace-nowrap hover:bg-white-primary hover:text-black-primary md:pr-0 md:text-left"
					>
						<SmartImage
							src={linkedInImg}
							alt="LinkedIn Logo"
							className="inline-block h-6 transition-all ease-steps2 group-hover:invert xs:mr-4"
						/>
						<span className="mr-4 hidden xs:inline">LinkedIn</span>
					</a>
				</li>
				<li className="grow">
					<a
						href="https://github.com/redaelmountassir"
						target="_blank"
						className="group block border-b-2 p-4 text-center whitespace-nowrap hover:bg-white-primary hover:text-black-primary md:pr-0 md:text-left"
					>
						<SmartImage
							src={gitHubImg}
							alt="GitHub Logo"
							className="inline-block h-6 transition-all ease-steps2 group-hover:invert xs:mr-4"
						/>
						<span className="mr-4 hidden xs:inline">GitHub</span>
					</a>
				</li>
			</ul>
			{width >= 600 && (
				<div className="relative hidden flex-1 flex-col overflow-hidden border-r-2 md:flex">
					<h3 className="min-h-14.75 border-b-2 border-white-primary p-4 text-center font-bold">
						Inbox
					</h3>
					<ul className="grow overflow-y-auto">
						{"Let's Build Something Together"
							.split(" ")
							.map((val, i) => (
								<li
									key={val}
									className="flex max-w-full items-center gap-4 border-b-2 border-light-primary px-4 py-2 whitespace-nowrap"
								>
									<div
										onClick={e => {
											e.preventDefault();
											const newInbox = [...inbox];
											newInbox[i] = !inbox[i];
											setInbox(newInbox);
										}}
										className={cn(
											"size-3 cursor-pointer border-2 border-burgundy-accent",
											inbox[i] && "bg-burgundy-accent",
										)}
									/>
									<span className="flex-1 overflow-hidden text-ellipsis">
										{val}
									</span>
									<span className="text-burgundy-accent">
										Feb {i + 27}
									</span>
								</li>
							))}
					</ul>
					<SmartImage
						src={triangle2Img}
						alt="Background graphic"
						className="absolute top-4/5 left-2 -z-1 h-52 -translate-y-1/2"
					/>
					<SmartImage
						src={triangleImg}
						alt="Background graphic"
						className="absolute top-3/4 -left-20 -z-1 h-52 -translate-y-1/2"
					/>
				</div>
			)}
			<form
				ref={scope}
				className={cn(
					"relative flex w-full flex-3 flex-col gap-2 overflow-x-hidden overflow-y-auto bg-black-primary p-4 md:overflow-y-hidden",
					width < 600 && "text-sm",
				)}
				onSubmit={e => {
					e.preventDefault();

					const form = e.target as HTMLFormElement;
					if (form["_honeypot"].value) return;
					let incomplete = false;
					["email", "subject", "message"].forEach(field => {
						if (form[field].value.length > 4) return;
						incomplete = true;
						animate(
							`#${field}-container`,
							{
								x: [-10, 10, -10, 0],
							},
							{ duration: 0.2 },
						);
					});
					if (incomplete) return;

					emailjs
						.sendForm("service_qli1ok3", "template_gssdksr", form, {
							publicKey: "-NFyAGI2XinGMKaFG",
						})
						.then(
							() => {
								animate2(
									scope2.current,
									{
										offsetDistance: "100%",
										motionDistance: "100%",
										transitionEnd: {
											offsetDistance: 0,
											motionDistance: 0,
										},
									},
									{
										duration: 2,
										ease: progress => {
											progress = easeInOut(progress);
											progress = anticipate(progress);
											return progress < 0
												? 1 + progress
												: progress;
										},
										type: "tween",
										onComplete: form.reset,
									},
								);
							},
							err => {
								animate(
									"#warning",
									{ y: ["-100%", "0%", "0%", "-100%"] },
									{ duration: 3, times: [0, 0.01, 0.75, 1] },
								);
								console.log("FAILED...", err.text);
							},
						);
				}}
			>
				<div
					id="warning"
					className="absolute top-0 left-0 w-full -translate-y-full overflow-hidden border-b-2 border-white-primary bg-yellow-accent py-2 text-center font-bold whitespace-nowrap text-black-primary"
				>
					Failed to send...
				</div>
				<div
					id="email-container"
					className="flex items-center bg-linear-to-r from-blue-accent/20 to-burgundy-accent/20 to-[65px] p-2 whitespace-nowrap outline-2 outline-offset-8 outline-transparent transition-[outline] ease-steps2 hover:outline-offset-0 hover:outline-white-primary focus:outline-offset-0 focus:outline-white-primary"
				>
					<label className="inline-block" htmlFor="email">
						From:
					</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						autoComplete="off"
						className="grow overflow-hidden bg-transparent pl-4 text-ellipsis outline-hidden"
					/>
				</div>
				<button
					type="button"
					onClick={() =>
						navigator.clipboard.writeText(
							"redaelmountassir0@gmail.com",
						)
					}
					className="group relative flex items-center bg-linear-to-r from-blue-accent/20 to-burgundy-accent/20 to-[50px] p-2 whitespace-nowrap outline-2 outline-offset-8 outline-transparent transition-[outline] ease-steps2 hover:outline-offset-0 hover:outline-white-primary focus:outline-offset-0 focus:outline-white-primary"
				>
					<p className="inline-block">To:</p>
					<span className="grow overflow-hidden pl-4 text-left text-ellipsis">
						redaelmountassir0@gmail.com
						<span
							className={cn(
								"absolute pl-2 opacity-0 transition-opacity ease-steps2 group-hover:opacity-100 group-focus:opacity-0",
								width < 350 &&
									"top-0 right-0 h-full bg-white-primary p-2 text-black-primary",
							)}
						>
							(Copy)
						</span>
						<span
							className={cn(
								"pl-2 opacity-0 transition-opacity ease-steps2 group-focus:opacity-100",
								width < 350 &&
									"absolute top-0 right-0 h-full bg-white-primary p-2 text-black-primary",
							)}
						>
							(Copied!)
						</span>
					</span>
				</button>
				<div
					id="subject-container"
					className="flex items-center bg-linear-to-r from-blue-accent/20 to-burgundy-accent/20 to-[65px] p-2 whitespace-nowrap outline-2 outline-offset-8 outline-transparent transition-[outline] ease-steps2 hover:outline-offset-0 hover:outline-white-primary focus:outline-offset-0 focus:outline-white-primary"
				>
					<label className="inline-block" htmlFor="subject">
						Subject:
					</label>
					<input
						id="subject"
						name="subject"
						type="text"
						required
						className="grow overflow-hidden bg-transparent pl-4 text-ellipsis outline-hidden"
					/>
				</div>
				<textarea
					id="message-container"
					name="message"
					required
					className="min-h-96 grow resize-none overflow-hidden bg-transparent bg-linear-to-r from-blue-accent/20 to-burgundy-accent/20 to-50% p-2 outline-hidden outline-2 outline-offset-8 outline-transparent transition-[outline] ease-steps2 hover:outline-offset-0 hover:outline-white-primary focus:overflow-y-auto focus:outline-offset-0 focus:outline-white-primary md:min-h-0"
				/>
				{/* Honeypot */}
				<input
					className="absolute top-0 left-0 size-0 opacity-0"
					autoComplete="off"
					type="email"
					id="honeypot"
					name="_honeypot"
					placeholder="Your e-mail here"
				/>
				<button
					id="submit"
					type="submit"
					value="send"
					className="flex items-center justify-center bg-white-primary p-2 text-black-primary shadow-[0px_2px] shadow-light-primary transition-all ease-steps2 hover:translate-y-0.5 hover:shadow-[0_0]"
				>
					<span className="hidden pr-4 text-left font-bold md:block">
						Send Message
					</span>
					<SmartImage
						ref={scope2}
						src={sendMessageImg}
						alt="Send Message"
						className="h-8 mix-blend-difference"
						style={{
							offsetPath: OFFSET_PATH,
							offsetAnchor: OFFSET_ANCHOR,
							offsetRotate: OFFSET_ROT,
							motionPath: OFFSET_PATH,
							offsetRotation: OFFSET_ROT,
							motionRotation: OFFSET_ROT,
						}}
					/>
				</button>
			</form>
		</div>
	);
};

export default Mail;
