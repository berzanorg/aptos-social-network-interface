import { Errors } from '$lib/utils/errors';
import { writable } from 'svelte/store';
import { Network, Provider } from 'aptos';
import { MODULE_ADDRESS } from '$lib/utils/contract';
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
		if (window.aptos) {
			const { hash } = await window.aptos.signAndSubmitTransaction(tx);
			return true;
		} else if (window.pontem) {
			const res = await window.pontem.signAndSubmit(tx);
			console.log(res);
			return true;
		} else {
			alert(Errors.AnyWalletNotFound);
			return false;
		}
	}

	return {
		subscribe,
		connect: async () => {
			try {
				if (window.aptos) {
					const account = await window.aptos.connect();
					const network = await window.aptos.network();

					if (!account.address) return;

					set({
						isConnected: true,
						isDevnet: network === 'Devnet',
						address: account.address
					});
				} else if (window.pontem) {
					const account = await window.pontem.connect();
					const network = await window.pontem.network();

					if (!account.address) return;

					set({
						isConnected: true,
						isDevnet: network.chainId === '81',
						address: account.address
					});
				} else {
					return alert(Errors.AnyWalletNotFound);
				}
			} catch {}
		},
		disconnect: async () => {
			try {
				if (window.aptos) {
					await window.aptos.disconnect();

					set({
						isConnected: false,
						isDevnet: false,
						address: undefined
					});
				} else if (window.pontem) {
					await window.pontem.disconnect();

					set({
						isConnected: false,
						isDevnet: false,
						address: undefined
					});
				} else {
					return alert(Errors.AnyWalletNotFound);
				}
			} catch {}
		},
		listenEvents: () => {
			if (window.aptos) {
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
			} else if (window.pontem) {
				window.pontem.onChangeAccount((address) => {
					update((state) => ({
						...state,
						address
					}));
				});

				window.pontem.onChangeNetwork(({ chainId }) => {
					update((state) => ({
						...state,
						isDevnet: chainId === '81'
					}));
				});
			} else {
				return alert(Errors.AnyWalletNotFound);
			}
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
		makeComment: async (params: { postOwnerAddr: string; postIndex: number; comment: string }) => {
			const tx: Transaction = {
				function: `${MODULE_ADDRESS}::social_network::make_comment`,
				type: 'entry_function_payload',
				type_arguments: [],
				arguments: [params.postOwnerAddr, params.postIndex.toString(), params.comment]
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
