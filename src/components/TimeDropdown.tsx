import { useState } from "react";
import { useInterval } from "../utils";
import Clock from "./Clock";
import Dropdown from "./Dropdown";
import GlitchText from "./GlitchText";

interface TimeDropdownProps {
	timeSelected: boolean;
	setTimeSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

const TimeDropdown = ({ timeSelected, setTimeSelected }: TimeDropdownProps) => {
	const [now, setNow] = useState<Date>();
	useInterval(() => setNow(new Date()), 1000);

	return (
		<Dropdown
			className="ease-steps-2 p-4 transition-colors hover:bg-white-primary hover:text-black-primary"
			onPointerDown={() => setTimeSelected(true)}
			onPointerOut={() => timeSelected && setTimeSelected(false)}
			onPointerUp={() => setTimeSelected(false)}
			dContent={<Clock now={now} />}
		>
			<GlitchText animated={timeSelected}>
				{now?.toLocaleTimeString() ?? "Loading..."}
			</GlitchText>
		</Dropdown>
	);
};

export default TimeDropdown;
