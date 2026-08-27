import React from 'react';
import { Link, HeadFC, PageProps } from 'gatsby';
import { SEO } from '../components/SEO';

const NotFoundPage: React.FC<PageProps> = () => {
	return (
		<React.StrictMode>
			<main className="w-full pt-14 pb-10 bg-black-primary gap-10 flex justify-center items-center">
				<h1 className="font-display text-white-primary text-9xl">
					404
				</h1>
				<Link to="/" className="text-pink-accent text-lg underline">
					Go home ►
				</Link>
			</main>
		</React.StrictMode>
	);
};

export default NotFoundPage;

export const Head: HeadFC = () => <SEO />;
