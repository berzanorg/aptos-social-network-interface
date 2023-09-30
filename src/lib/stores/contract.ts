import { MODULE_ADDRESS } from '$lib/utils/aptos';
import { Network, Provider } from 'aptos';
import { writable } from 'svelte/store';

interface SocialNetworkData {
	users: Array<User>;
}

export interface User {
	addr: string;
	name: string;
	bio: string;
	pfp: string;
	posts: Array<Post>;
}

interface Post {
	content: string;
	image: string;
	comments: Array<Comment>;
	like_count: number;
	time: number;
}

interface Comment {
	addr: string;
	content: string;
	like_count: number;
	time: number;
}

const createContractStore = () => {
	const { set, subscribe } = writable<SocialNetworkData>({
		users: []
	});

	return {
		subscribe,
		fetch: async () => {
			const provider = new Provider(Network.DEVNET);

			const res = await provider.getAccountResource(
				MODULE_ADDRESS,
				`${MODULE_ADDRESS}::social_network::SocialNetwork`
			);
			const { users } = res.data as SocialNetworkData;

			set({
				users
			});
		}
	};
};

export const contract = createContractStore();
