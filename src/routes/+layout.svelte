<script lang="ts">
	import { contract } from '$lib/stores/contract';
	import { onMount } from 'svelte';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import { wallet } from '$lib/stores/wallet';

	onMount(wallet.connectIfGranted);
	onMount(contract.fetch);
</script>

<Header />

{#if $contract.users.length === 0}
	<LoadingScreen />
{:else}
	<slot />
{/if}
