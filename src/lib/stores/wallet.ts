import { Errors } from '$lib/utils/errors';
import { writable } from 'svelte/store';
import { Network, Provider } from 'aptos';
import { MODULE_ADDRESS, provider } from '$lib/utils/aptos';
import { contract } from './contract';

interface WalletStore {
	isConnected: boolean;
	isDevnet: boolean;
	address?: string;
}

const createWalletStore = () => {
	const { set, update, subscribe } = writable<WalletStore>({
		isConnected: false,
		isDevnet: false,
		address: undefined
	});

	async function sendTx(tx: Transaction): Promise<boolean> {
		if (!window.aptos) return false;

		try {
			const { hash } = await window.aptos.signAndSubmitTransaction(tx);

			await provider.waitForTransaction(hash);
			return true;
		} catch {
			return false;
		}
	}

	return {
		subscribe,
		connectIfGranted: async () => {
			if (!window.aptos) return;

			const account = await window.aptos.account();
			const network = await window.aptos.network();

			if (!account.address) return;

			set({
				isConnected: true,
				isDevnet: network === 'Devnet',
				address: account.address
			});
		},
		connect: async () => {
			if (!window.aptos) return alert(Errors.AnyWalletNotFound);
			try {
				const account = await window.aptos.connect();
				const network = await window.aptos.network();

				if (!account.address) return;

				set({
					isConnected: true,
					isDevnet: network === 'Devnet',
					address: account.address
				});
			} catch {}
		},
		disconnect: async () => {
			if (!window.aptos) return alert(Errors.AnyWalletNotFound);
			try {
				await window.aptos.disconnect();

				set({
					isConnected: false,
					isDevnet: false,
					address: undefined
				});
			} catch {}
		},
		listenEvents: () => {
			if (!window.aptos) return alert(Errors.AnyWalletNotFound);
			try {
				window.aptos.onAccountChange(({ address }) => {
					update((state) => ({
						...state,
						address
					}));
				});

				window.aptos.onNetworkChange((network) => {
					update((state) => ({
						...state,
						isDevnet: network === 'Devnet'
					}));
				});
			} catch {}
		},
		createUserProfile: async (params: { name: string; bio: string; pfp: string }) => {
			const tx: Transaction = {
				function: `${MODULE_ADDRESS}::social_network::create_user_profile`,
				type: 'entry_function_payload',
				type_arguments: [],
				arguments: [params.name, params.bio, params.pfp]
			};

			const isOk = await sendTx(tx);

			if (isOk) {
				await contract.fetch();
			}
		},
		updateUserProfile: async (params: { name: string; bio: string; pfp: string }) => {
			const tx: Transaction = {
				function: `${MODULE_ADDRESS}::social_network::update_user_profile`,
				type: 'entry_function_payload',
				type_arguments: [],
				arguments: [params.name, params.bio, params.pfp]
			};

			const isOk = await sendTx(tx);

			if (isOk) {
				await contract.fetch();
			}
		},
		makePost: async (params: { content: string; image?: string }) => {
			params.image = params.image ?? 'none';

			const tx: Transaction = {
				function: `${MODULE_ADDRESS}::social_network::make_post`,
				type: 'entry_function_payload',
				type_arguments: [],
				arguments: [params.content, params.image]
			};

			const isOk = await sendTx(tx);

			if (isOk) {
				await contract.fetch();
			}
		},
		likePost: async (params: { postOwnerAddr: string; postIndex: number }) => {
			const tx: Transaction = {
				function: `${MODULE_ADDRESS}::social_network::like_post`,
				type: 'entry_function_payload',
				type_arguments: [],
				arguments: [params.postOwnerAddr, params.postIndex.toString()]
			};

			const isOk = await sendTx(tx);

			if (isOk) {
				await contract.fetch();
			}
		},
		makeComment: async (params: { postOwnerAddr: string; postIndex: number; content: string }) => {
			const tx: Transaction = {
				function: `${MODULE_ADDRESS}::social_network::make_comment`,
				type: 'entry_function_payload',
				type_arguments: [],
				arguments: [params.postOwnerAddr, params.postIndex.toString(), params.content]
			};

			const isOk = await sendTx(tx);

			if (isOk) {
				await contract.fetch();
			}
		},
		likeComment: async (params: {
			postOwnerAddr: string;
			postIndex: number;
			commentIndex: number;
		}) => {
			const tx: Transaction = {
				function: `${MODULE_ADDRESS}::social_network::like_comment`,
				type: 'entry_function_payload',
				type_arguments: [],
				arguments: [
					params.postOwnerAddr,
					params.postIndex.toString(),
					params.commentIndex.toString()
				]
			};

			const isOk = await sendTx(tx);

			if (isOk) {
				await contract.fetch();
			}
		}
	};
};

export const wallet = createWalletStore();
