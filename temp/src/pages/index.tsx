import React from 'react';
import { useState, useEffect } from 'react';
import type { HeadFC, PageProps } from 'gatsby';
import OS from '../components/OS';
import { SEO } from '../components/SEO';

const IndexPage: React.FC<PageProps> = () => {
	return (
		<React.StrictMode>
			<OS />
		</React.StrictMode>
	);
};

export default IndexPage;

export const Head: HeadFC = () => <SEO />;
