<script>
	import CardCreateProfile from '$lib/components/CardCreateProfile.svelte';
	import CardInformConnection from '$lib/components/CardInformConnection.svelte';
	import CardMakePost from '$lib/components/CardMakePost.svelte';
	import CardPost from '$lib/components/CardPost.svelte';
	import Main from '$lib/components/Main.svelte';
	import { contract } from '$lib/stores/contract';
	import { wallet } from '$lib/stores/wallet';

	$: user = $contract.users.find(({ addr }) => addr === $wallet.address);
	$: posts = $contract.users
		.map(({ addr, name, pfp, posts }) =>
			posts.map((post, i) => ({
				addr: addr,
				name: name,
				pfp: pfp,
				content: post.content,
				image: post.image,
				commentCount: post.comments.length,
				likeCount: post.like_count,
				index: i,
				time: post.time
			}))
		)
		.flat(1)
		.sort((a, b) => b.time - a.time);
</script>

<svelte:head>
	<title>Aptos Social Network</title>
</svelte:head>

<Main>
	{#if $wallet.isConnected}
		{#if user}
			<CardMakePost user={{ name: user.name, pfp: user.pfp }} />
		{:else}
			<CardCreateProfile />
		{/if}
	{:else}
		<CardInformConnection />
	{/if}
	{#each posts as post (post.time)}
		<CardPost {post} />
	{/each}
</Main>
