import { useShallow } from "zustand/react/shallow";
import { SETTING_DETAILS, useSettingsStore } from "../../store";
import Dropdown from "../../components/Dropdown";
import Slider from "../../components/Slider";
import Toggle from "../../components/Toggle";
import { cn } from "../../utils";
import { SECTIONS, type SectionId } from "./data";
import { MobileContext } from "../../store/MobileContext";
import { useContext } from "react";

const Nav = ({ active }: { active: SectionId }) => {
	const {
		brightness,
		setBrightness,
		use3D,
		set3D,
		useStatic,
		setStatic,
		scanlines,
		setScanlines,
		blur,
		setBlur,
		flicker,
		setFlicker,
		fancyText,
		setFancyText,
	} = useSettingsStore(
		useShallow(state => ({
			brightness: state.brightness,
			setBrightness: state.setBrightness,
			use3D: state.use3D,
			set3D: state.set3D,
			useStatic: state.useStatic,
			setStatic: state.setStatic,
			scanlines: state.scanlines,
			setScanlines: state.setScanlines,
			blur: state.blur,
			setBlur: state.setBlur,
			flicker: state.flicker,
			setFlicker: state.setFlicker,
			fancyText: state.fancyText,
			setFancyText: state.setFancyText,
		})),
	);

	const isMobile = useContext(MobileContext);

	return (
		<nav
			aria-label="Portfolio"
			className="backdrop-blur-parent fixed inset-x-0 top-0 z-30 flex overflow-visible border-b-2 border-white-primary bg-linear-to-r from-black-primary/75 from-25% to-dark-primary/75 to-70% font-bold whitespace-nowrap text-white-primary"
		>
			<div className="hidden-scrollbar flex min-w-0 grow overflow-x-auto md:overflow-visible">
				<a
					href="/"
					className="group border-r-2 border-white-primary px-4 py-2.5 transition ease-steps-10 hover:bg-white-primary hover:text-black-primary focus-visible:bg-white-primary focus-visible:text-black-primary"
				>
					<span
						aria-hidden
						className="opacity-0 transition ease-steps-10 group-hover:opacity-100"
					>
						{"> "}
					</span>
					<span className="relative inline-block -translate-x-6 transition ease-steps-10 group-hover:translate-x-0">
						{isMobile ? "Switch View" : "Switch to Desktop View"}
					</span>
				</a>
				<Dropdown
					className="border-r-2 border-white-primary px-4 py-2.5 transition ease-steps-10 hover:bg-white-primary hover:text-black-primary focus-visible:bg-white-primary focus-visible:text-black-primary"
					dClassName="z-40 w-72 border-t-2 divide-y-2 divide-white-primary"
					pClassName="mr-auto"
					aria-label="Visuals"
					dContent={
						<div>
							<Slider
								state={brightness}
								setter={setBrightness}
								purpose="Brightness"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 -0.5 16 16"
									shapeRendering="crispEdges"
									aria-hidden="true"
									className="size-6 shrink-0"
								>
									<path
										className="stroke-white-primary transition"
										d="M7 4h2M5 5h2M9 5h2M5 6h1M10 6h1M4 7h1M11 7h1M4 8h1M11 8h1M5 9h1M10 9h1M5 10h2M9 10h2M7 11h2"
									/>
									{[
										"M11 0h1M10 1h1M10 2h1",
										"M15 4h1M13 5h2",
										"M13 10h2M15 11h1",
										"M10 13h1M10 14h1M11 15h1",
										"M5 13h1M5 14h1M4 15h1",
										"M1 10h2M0 11h1",
										"M0 4h1M1 5h2",
										"M4 0h1M5 1h1M5 2h1",
									].map((path, i, arr) => (
										<path
											key={path}
											className={cn(
												"origin-center scale-0 stroke-transparent transition",
												brightness >=
													((arr.length - i) /
														arr.length) *
														100 &&
													"scale-100 stroke-white-primary",
											)}
											d={path}
										/>
									))}
								</svg>
							</Slider>
							<Toggle
								state={use3D}
								setter={set3D}
								title={SETTING_DETAILS.use3D}
							>
								3D (Slower)
							</Toggle>
							<Toggle
								state={useStatic}
								setter={setStatic}
								title={SETTING_DETAILS.useStatic}
							>
								Static
							</Toggle>
							<Toggle
								state={scanlines}
								setter={setScanlines}
								title={SETTING_DETAILS.scanlines}
							>
								Scanlines
							</Toggle>
							<Toggle
								state={blur}
								setter={setBlur}
								title={SETTING_DETAILS.blur}
							>
								Blur
							</Toggle>
							<Toggle
								state={fancyText}
								setter={setFancyText}
								title={SETTING_DETAILS.fancyText}
							>
								Fancy Text
							</Toggle>
							<Toggle
								state={flicker}
								setter={setFlicker}
								title={SETTING_DETAILS.flicker}
							>
								Flicker
							</Toggle>
						</div>
					}
				>
					Visuals
				</Dropdown>
				{SECTIONS.map(section => (
					<a
						key={section.id}
						href={`#${section.id}`}
						aria-current={
							active === section.id ? "location" : undefined
						}
						className={cn(
							"border-l-2 border-white-primary px-4 py-2.5 transition ease-steps-10 hover:bg-white-primary hover:text-black-primary focus-visible:bg-white-primary focus-visible:text-black-primary",
							active === section.id &&
								"bg-white-primary text-black-primary",
						)}
					>
						{section.label}
					</a>
				))}
			</div>
		</nav>
	);
};

export default Nav;
