import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	return {
		name: params.name,
		postindex: params.postindex
	};
};
