import React, { useEffect, useRef, useState } from "react";
import { Path } from "../../store/types";
import { useBoundStore, useSettingsStore } from "../../store";

interface HistoryItem {
	text: string;
	noWrap?: boolean;
	mod?: "Warning" | "Error" | "Success";
	location?: Path; //Only applies to inputs
}

const INTRO = `
   ^        ___         __     ____  ____
  / \\      / _ \\___ ___/ /__ _/ __ \\/ __/
<     >   / , _/ -_) _  / _ \`/ /_/ /\\ \\
  \\ /    /_/|_|\\__/\\_,_/\\_,_/\\____/___/
   v

Copyright (C) Paradox Corporation. All rights reserved.
Console Version 1.0.2

  `;

//Removes any .. in path
function reducePath(path: Path) {
	const reducedPath = path.reduce((acc, curr) => {
		curr === ".." ? acc.length > 1 && acc.pop() : acc.push(curr);
		return acc;
	}, [] as Path);
	return reducedPath;
}

export const Console = () => {
	// Time and location
	const [history, setHistory] = useState<HistoryItem[]>([
		{ text: INTRO, noWrap: true },
	]);
	const [location, setLocation] = useState<Path>([
		"C:",
		"users",
		"@redaelmountassir",
	]);
	const [navigate, toPath, addWindow] = useBoundStore((state) => [
		state.navigate,
		state.toPath,
		state.addWindow,
	]);

	// Getting input
	const [input, setInput] = useState("");
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const consoleRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		consoleRef.current && (consoleRef.current.scrollTop = 9e20); //Big number wow
	}, [history]);
	const focusInput = () => inputRef.current?.focus();
	useEffect(focusInput, [inputRef]);
	const quickSelect = useRef({ i: -1, lastVal: "" });

	// External functionalities
	const settings = useSettingsStore((state) => state);

	// Interpreting input
	const getInputs = () =>
		history
			.filter((item) => "location" in item)
			.filter((val, i, arr) => arr[i - 1]?.text !== val.text);
	const exec = (input: string, bangSearch: number = 1): HistoryItem => {
		if (input.includes("!!")) {
			const inputs = getInputs();
			return exec(
				input.replace("!!", inputs[inputs.length - bangSearch]?.text ?? ""),
				bangSearch + 1,
			);
		}

		const executed: HistoryItem = { text: "" };
		const parts = input.trim().split(/\s+/).filter(Boolean);
		switch (parts[0] ? parts[0].toLowerCase() : parts[0]) {
			case "help":
				executed.text = `
Usage: [command_name] --flag_1 --flag_2 -f_shorthand <parameter_1> <parameter_2>...
Options (with corresponding parameters)
---------------------------------------

help: returns all the available options for use in the console.
shutdown: shuts down the program.
|   delay (optional): a float denoting the time in seconds that the shutdown will be delayed.
echo: responds back
|   text (optional): the text to respond with
|   mod (optional): changes the styling based on three options: "Warning", "Error", and "Success"
window: will attempt to open a window associated with a selected system item
|   path: the path of the item being opened
ls: will display the contents of the current working directory (add -h or --hidden to include hidden files)
|   path (optional): displays the contents of another directory
cd: changes the current working directory to the new one
|   path: the relative or absolute path to be navigated to
clear: clears console of all contents
cat: prints out the contents of a text file
|   path: the path to a .txt file (the only one supported)
                `;
				break;
			case "shutdown":
				const delay = parseFloat(parts[1] ?? "");
				isNaN(delay)
					? settings.shutdown()
					: setTimeout(settings.shutdown, delay * 1000);
				executed.text = `Shutting down ${
					isNaN(delay) ? "now." : `in ${delay} seconds.`
				}`;
				executed.mod = "Warning";
				break;
			case "echo":
				executed.text = parts[1] ?? "";
				//@ts-ignore
				executed.mod = parts[2]; // Bad code but fast code :)
				break;
			case "window":
				const objGoal = parts[1];
				if (!objGoal) {
					executed.text = `Please provide a path as your 2nd argument.`;
					executed.mod = "Error";
					break;
				}
				const obj = navigate(reducePath([...location, ...toPath(objGoal)]));
				if (!obj) {
					executed.text = `'${objGoal}' is not a real path.`;
					executed.mod = "Error";
					break;
				}
				addWindow(obj);

				executed.text = "Opened window.";
				executed.mod = "Success";
				break;
			case "ls":
				let goalDir = location,
					showHidden = false;
				if (parts[1]) {
					if (parts[1] === "-h" || parts[1] === "--hidden") showHidden = true;
					else goalDir = [...location, ...toPath(parts[1])];
				}
				const navigated = navigate(goalDir);
				if (
					!navigated ||
					!("children" in navigated) ||
					!navigated.children.length
				) {
					executed.text = `'${parts[1]}' is not a valid path.`;
					executed.mod = "Error";
					break;
				}
				let children = navigated.children;
				if (!showHidden) children = children.filter((child) => !child.hidden);
				executed.text = `\nName\n----\n${children
					.map((sysObj) =>
						"ext" in sysObj ? `${sysObj.name}.${sysObj.ext}` : sysObj.name,
					)
					.join("\n")}\n\n`;
				break;
			case "cd":
				const goal = parts[1];
				if (!goal) {
					setLocation(["C:", "users", "@redaelmountassir"]);
					break;
				}

				try {
					const newLoc = reducePath([...location, ...toPath(goal)]);

					const endObj = navigate(newLoc);
					if (!endObj) {
						executed.text = `'${goal}' is not a real path.`;
						executed.mod = "Error";
						break;
					}
					if ("ext" in endObj) {
						executed.text = `'${goal}' is a file and cannot be navigated to.`;
						executed.mod = "Error";
						break;
					}

					setLocation(newLoc);
				} catch (err) {
					executed.text = `'${goal}' is not a valid path.`;
					executed.mod = "Error";
					console.error(err);
					break;
				}
				break;
			case "cat":
				const textGoal = parts[1];
				if (!textGoal) {
					executed.text = `Please provide a path as your 2nd argument.`;
					executed.mod = "Error";
					break;
				}
				const textFile = navigate(
					reducePath([...location, ...toPath(textGoal)]),
				);
				if (!textFile) {
					executed.text = `'${textGoal}' is not a real path.`;
					executed.mod = "Error";
					break;
				}
				if ("value" in textFile && typeof textFile.value === "string") {
					executed.text = textFile.value;
					executed.mod = "Success";
				} else {
					executed.text = `The provided path should point to a .txt file.`;
					executed.mod = "Error";
				}
				break;
			case "clear":
				setHistory([]);
				break;
			default:
				executed.text = `'${parts[0]}' is not a valid command. Use 'help' to check what commands are available.`;
				executed.mod = "Error";
				break;
		}
		return executed;
	};

	//Easter egg
	useEffect(() => {
		//@ts-ignore
		if (window.once) return;
		//@ts-ignore
		window.once = true;

		// Interactions!
		console.log(INTRO);
		console.log("(Who's to say you can't do things to this console....)");
		setTimeout(() => console.log("(...pause)"), 5000);
		let i = 0;
		const hints = [
			"Good idea! You're gonna need a password first.",
			"Ok was that not enough?",
			"Check the other console. Or command prompt? Shell? Too many names.",
			"Back so soon?",
			"I don't wanna help anymore. It's not fun.",
		];
		Object.defineProperty(window, "help", {
			get: () =>
				hints[i++] ?? "Stop bothering me now. I don't feel like writing more",
		});
		Object.defineProperty(window, "ifoundit123", {
			get() {
				const settings = useSettingsStore.getState();
				if (
					!settings.use3D ||
					!settings.useStatic ||
					!settings.scanlines ||
					settings.fancyText ||
					settings.useFlicker ||
					!settings.lightMode ||
					settings.fullscreen ||
					document.documentElement.style.cursor === ""
				)
					return "Not quite!";
				setTimeout(
					() =>
						(window.location.href =
							"https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
					20000,
				);
				setTimeout(
					() =>
						console.log(`I did not plan anything for this however so this hopefully was a fun waste of time.
In a few seconds I will forward you to the answer of all your questions.
In the interim, enjoy this cat!
(You're screen will have to be wide enough for it too look right)

|\\__/,|    (\`\\
|_ _  |.--.) )
( T   )     /
(((^_(((/(((_/`),
					1,
				);
				return 'Wow yes you did it, whatever "it" was!';
			},
		});
	}, []);

	return (
		<p
			className="flicker pointer-events-none relative flex-1 overflow-y-auto overflow-x-hidden whitespace-break-spaces break-all bg-black-primary p-2 pb-[10%] text-sm text-white-primary [text-shadow:0_0_1rem_#f5f9ff9c] md:pointer-events-auto"
			ref={consoleRef}
			onPointerUp={(e) => {
				e.preventDefault();
				focusInput();
			}}
		>
			{history.map(({ text, mod, location, noWrap = false }, i) => (
				<React.Fragment key={i}>
					{location && <LocationText location={location} />}
					{mod || noWrap ? (
						<span
							className={`${noWrap && "whitespace-pre"} ${
								mod === "Error" &&
								`text-burgundy-accent [text-shadow:0_0_1rem_#920075]`
							} ${
								mod === "Warning" &&
								`text-yellow-accent [text-shadow:0_0_1rem_#f9c80e]`
							} ${
								mod === "Success" &&
								`text-blue-accent [text-shadow:0_0_1rem_#023788]`
							}`}
						>
							{text}
						</span>
					) : (
						text
					)}
					<br />
				</React.Fragment>
			))}
			<textarea
				ref={inputRef}
				value={input}
				autoCapitalize="off"
				autoComplete="off"
				autoCorrect="off"
				spellCheck={false}
				className="peer pointer-events-none absolute opacity-0"
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={(e) => {
					let dir = 0;
					if (inputRef.current) {
						inputRef.current.selectionStart = input.length;
						inputRef.current.selectionEnd = input.length;
					}
					switch (e.key) {
						case "Enter":
							e.preventDefault();
							if (e.ctrlKey) {
								setInput(input + "\n");
								return;
							}

							setHistory((prevHistory) => [
								...prevHistory,
								{ text: input, location },
								...input.split("\n").map((val) => exec(val)),
							]);

							setInput("");
							quickSelect.current = { i: -1, lastVal: "" };
							return;
						case "ArrowLeft":
						case "ArrowRight":
							e.preventDefault();
							return;
						case "ArrowUp":
							dir = -1;
							break;
						case "ArrowDown":
							dir = 1;
							break;
						default:
							quickSelect.current = { i: -1, lastVal: "" };
							return;
					}

					const inputs = getInputs();

					let newInput = "";
					if (quickSelect.current.i === -1) {
						//If no history item is selected
						if (dir === 1) return; //Can't go into the future
						quickSelect.current.i = inputs.length - 1;
						if (quickSelect.current.i === -1) {
							quickSelect.current.i = -1;
							return;
						}
						quickSelect.current.lastVal = input;
						newInput = inputs[quickSelect.current.i].text;
					} else {
						quickSelect.current.i += dir;
						if (quickSelect.current.i === -1) {
							quickSelect.current.i = 0;
							return;
						}
						newInput = inputs[quickSelect.current.i]?.text;
						if (newInput === undefined) {
							newInput = quickSelect.current.lastVal;
							quickSelect.current.i = -1;
						}
					}

					setInput(newInput);
					if (!inputRef.current) return;
				}}
			/>
			<LocationText location={location} />
			{input.replaceAll("\n", "\n$ ")}
			<span className="invisible hidden animate-blink font-bold peer-focus:visible md:inline">
				_
			</span>
			<span className="md:hidden">Not supported on mobile ☹</span>
		</p>
	);
};

const LocationText = (props: { location: Path }) => {
	return `${props.location.join("/")}$ `;
};
