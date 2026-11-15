import type { Directory } from "../store/types";
import { projectFiles } from "./projectsLoader";
import textEditorContent from "./textEditor.yaml";

const InitialSystem: Directory = {
	name: "users",
	children: [
		{
			name: "@redaelmountassir",
			children: [
				{
					name: "Desktop",
					children: [
						{ name: "Projects", children: projectFiles },
						{
							name: "about_me",
							ext: "txt",
							value: textEditorContent.aboutText,
						},
						{ name: "resume", ext: "pdf" },
						{ name: "Contact", ext: "exe" },
						{ name: "Simple Site", ext: "exe" },
						{
							name: "Trash",
							children: [{ name: "WackyVirus", ext: "mys" }],
						},
					],
				},
				{
					name: "Apps",
					children: [
						{
							name: "Console",
							ext: "exe",
						},
					],
				},
				{
					name: "Homework",
					children: [],
				},
			],
		},
		{
			name: "password",
			hidden: true,
			value: `ifoundit123
            
☺☻
☺☻
☺☻
☻☺
☻☺
☺☻
☻☺
☺☻
☺☺`,
			ext: "txt",
		},
	],
};

export default InitialSystem;
