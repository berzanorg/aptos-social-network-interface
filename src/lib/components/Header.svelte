<script>
	import { base } from '$app/paths';
	import { wallet } from '$lib/stores/wallet';
</script>

<header
	class="flex sticky top-0 items-center justify-between h-16 px-4 md:px-6 bg-black/50 backdrop-blur-lg border-b border-neutral-800 select-none"
>
	<a class="text-2xl font-bold" href="{base}/">Social Network</a>
	<button
		class="text-xl font-semibold px-5 h-10 rounded-full bg-sky-500 hover:bg-sky-600 hover:scale-95 duration-150"
		on:click={$wallet.isConnected ? wallet.disconnect : wallet.connect}
	>
		{#if $wallet.isConnected} Disconnect {:else} Connect {/if}
	</button>
</header>
