import { cn } from "../../utils";
import { SECTIONS, type SectionId } from "./data";

const PortfolioNav = ({ active }: { active: SectionId }) => (
	<nav
		aria-label="Portfolio"
		className="hidden-scrollbar backdrop-blur-parent fixed inset-x-0 top-0 z-30 flex overflow-x-auto border-b-2 border-white-primary bg-linear-to-r from-black-primary/75 from-25% to-dark-primary/75 to-70% font-bold whitespace-nowrap text-white-primary"
	>
		<a
			href="/"
			className="shrink-0 border-r-2 border-white-primary px-4 py-2.5 transition ease-steps-10 hover:bg-white-primary hover:text-black-primary focus-visible:bg-white-primary focus-visible:text-black-primary"
		>
			Desktop
		</a>
		{SECTIONS.map(section => (
			<a
				key={section.id}
				href={`#${section.id}`}
				aria-current={active === section.id ? "location" : undefined}
				className={cn(
					"shrink-0 border-r-2 border-white-primary px-4 py-2.5 transition ease-steps-10 hover:bg-white-primary hover:text-black-primary focus-visible:bg-white-primary focus-visible:text-black-primary",
					active === section.id &&
						"bg-white-primary text-black-primary",
				)}
			>
				{section.label}
			</a>
		))}
	</nav>
);

export default PortfolioNav;
