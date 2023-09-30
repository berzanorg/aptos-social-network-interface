declare interface Window {
	aptos?: PetraWallet;
	pontem?: PontemWallet;
}

type Account = { address?: string };

type Transaction = {
	arguments: Array<string>;
	function: string;
	type: 'entry_function_payload';
	type_arguments: Array<string>;
};

interface PetraWallet {
	connect: () => Promise<Account>;
	disconnect: () => Promise<void>;
	network: () => Promise<'Devnet' | 'Testnet' | 'Mainnet'>;
	onAccountChange: (callback: (account: Account) => void) => void;
	onNetworkChange: (callback: (network: 'Devnet' | 'Testnet' | 'Mainnet') => void) => void;
	signAndSubmitTransaction: (tx: Transaction) => Promise<{ hash: string }>;
	account: () => Promise<Account>;
}

interface PontemWallet {
	connect: () => Promise<Account>;
	disconnect: () => Promise<void>;
	network: () => Promise<{ chainId: string }>;
	onChangeAccount: (callback: (address?: string) => void) => void;
	onChangeNetwork: (callback: (network: { chainId: string }) => void) => void;
	signAndSubmit: (tx: Transaction) => Promise<void>;
	account: () => Promise<string>;
}
