import { useState } from "react";

interface FilterOptionsProps {
	label: string;
	options: string[];
	selected: string[];
	allSelected: boolean;
	onToggle: (option: string) => void;
	onToggleAll: () => void;
	format?: (option: string) => string;
}

export const useOptionSelection = (resetKey: string, options: string[]) => {
	const [state, setState] = useState({ resetKey, selected: options });
	const selected = state.resetKey === resetKey ? state.selected : options;
	const allSelected =
		options.length > 0 &&
		options.every(option => selected.includes(option));

	const setSelected = (next: string[]) =>
		setState({ resetKey, selected: next });

	const toggle = (option: string) =>
		setSelected(
			selected.includes(option)
				? selected.filter(item => item !== option)
				: [...selected, option],
		);

	const toggleAll = () => setSelected(allSelected ? [] : [...options]);

	return { selected, allSelected, toggle, toggleAll };
};

const FilterOptions = ({
	label,
	options,
	selected,
	allSelected,
	onToggle,
	onToggleAll,
	format = option => option,
}: FilterOptionsProps) => (
	<div className="flex flex-col gap-2">
		<p className="text-sm font-bold">{label}</p>
		<label className="flex cursor-pointer items-center gap-2">
			<input
				type="checkbox"
				checked={allSelected}
				onChange={onToggleAll}
				aria-label={`Select all ${label}`}
				className="size-3 shrink-0 cursor-pointer appearance-none border-2 border-burgundy-accent checked:bg-burgundy-accent"
			/>
			All
		</label>
		{options.map(option => (
			<label
				key={option}
				className="flex cursor-pointer items-center gap-2"
			>
				<input
					type="checkbox"
					checked={selected.includes(option)}
					onChange={() => onToggle(option)}
					aria-label={`Select ${option}`}
					className="size-3 shrink-0 cursor-pointer appearance-none border-2 border-burgundy-accent checked:bg-burgundy-accent"
				/>
				{format(option)}
			</label>
		))}
	</div>
);

export default FilterOptions;
