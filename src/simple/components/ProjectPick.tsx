import { Suspense } from "react";
import { cn } from "../../utils";
import ProjectLogo from "./ProjectLogo";

const ProjectPick = ({
	page,
	projectName,
	name,
	active,
	featured,
	onChoose,
}: {
	page: number;
	projectName: string;
	name: string;
	active: boolean;
	featured: boolean;
	onChoose: (page: number) => void;
}) => (
	<a
		href="#projects"
		aria-current={active ? "true" : undefined}
		onClick={event => {
			event.preventDefault();
			onChoose(page);
		}}
		className={cn(
			"border-2 border-white-primary bg-black-primary/80 text-left shadow-[3px_3px_0_0] shadow-black-primary/40 transition ease-steps-10 hover:bg-white-primary hover:text-black-primary focus-visible:bg-white-primary focus-visible:text-black-primary",
			featured ? "min-w-0" : "shrink-0",
			active && "bg-yellow-accent text-black-primary",
		)}
	>
		{featured ? (
			<span className="flex min-w-0 flex-col">
				<span
					className={cn(
						"relative grid place-items-center border-b-2 border-white-primary bg-black-primary/80 px-2",
						active && "border-black-primary",
					)}
				>
					<span className="absolute top-0.5 left-1 text-[0.65rem] font-bold tracking-widest text-white-primary tabular-nums">
						{String(page).padStart(2, "0")}
					</span>
					<Suspense
						fallback={
							<span className="size-16 bg-black-primary/15" />
						}
					>
						<ProjectLogo name={projectName} />
					</Suspense>
				</span>
				<span className="block px-2.5 py-1.5 text-center text-sm font-bold uppercase tracking-wide">
					{name}
				</span>
			</span>
		) : (
			<span className="block px-2.5 py-1.5 text-sm font-bold uppercase tracking-wide">
				{name}
			</span>
		)}
	</a>
);

export default ProjectPick;
