import type { Directory } from '../store/types';

const InitialSystem: Directory = {
	name: 'users',
	children: [
		{
			name: '@redaelmountassir',
			children: [
				{
					name: 'Desktop',
					children: [
						{ name: 'Projects', children: [] },
						{
							name: 'about_me',
							ext: 'txt',
							value: `Hello World! My name is Reda Elmountassir and I am a <i>full-stack developer</i> based in Philly.
                            In my work at <i>Coded By: Ventures</i> and my personal time I create projects adopting new technologies and techniques.
                            I am also obsessed with soccer, rap, music, and all things related to my <u title="(as a proud Moroccan, lol)" class="text-pink-accent">culture</u>.</br>
                            </br>
                            My creativity drives me to build projects that I am proud of, both representing my ability and pushing me past my limits.</br>
                            </br>
                            <u>Experience</u></br>
                            - 4 years at R&D at the Franklin Institute</br>
                            - 3 years and counting at Coded By: Ventures (previously Draft Studios)`,
						},
						{ name: 'Contact', ext: 'exe' },
						{ name: 'resume', ext: 'pdf' },
						{
							name: 'Trash',
							children: [{ name: 'WackyVirus', ext: 'mys' }],
						},
					],
				},
				{
					name: 'Apps',
					children: [
						{
							name: 'Console',
							ext: 'exe',
						},
					],
				},
				{
					name: 'Homework',
					children: [],
				},
			],
		},
		{
			name: 'password',
			hidden: true,
			value: `ifoundit123
            
☺☻
☺☻
☺☻
☻☺
☻☺
☺☻
☻☺
☺☻`,
			ext: 'txt',
		},
	],
};

export default InitialSystem;
