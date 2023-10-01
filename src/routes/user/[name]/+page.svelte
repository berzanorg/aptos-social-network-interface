<script lang="ts">
	import { base } from '$app/paths';
	import CardPost from '$lib/components/CardPost.svelte';
	import Main from '$lib/components/Main.svelte';
	import { contract } from '$lib/stores/contract.js';
	import { wallet } from '$lib/stores/wallet.js';

	export let data;

	$: profile = $contract.users.find(({ name }) => name === data.name);
	$: isUser = profile?.addr === $wallet.address;
	$: posts =
		profile?.posts
			.map((post, i) => ({
				addr: profile?.addr,
				name: profile?.name,
				pfp: profile?.pfp,
				content: post.content,
				image: post.image,
				commentCount: post.comments.length,
				likeCount: post.like_count,
				index: i,
				time: post.time
			}))
			.sort((a, b) => b.time - a.time) || [];
</script>

<svelte:head>
	<title>Aptos Social Network {profile && ` | ${profile.name}`}</title>
</svelte:head>

<!-- svelte-ignore a11y-img-redundant-alt -->

<Main>
	{#if profile}
		<div class="flex flex-col border-b px-4 pt-6 pb-8 gap-4 border-neutral-800">
			<div class="flex items-center justify-between pl-2">
				<img
					class="aspect-square w-24 rounded-full object-cover border border-neutral-900"
					src={profile.pfp}
					alt="profile picture"
				/>

				{#if $wallet.isConnected && isUser}
					<a
						class="flex items-center px-5 h-9 text-lg font-semibold rounded-full border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900 hover:scale-95 duration-150"
						href="{base}/profile"
					>
						Edit Profile</a
					>
				{/if}
			</div>
			<div class="flex flex-col gap-2.5">
				<h1 class="text-2xl font-bold">@{profile.name}</h1>
				<p class="text-sm">{profile.bio}</p>
			</div>
		</div>
		{#each posts as post, index (post.time)}
			<CardPost
				post={{
					addr: profile.addr,
					name: profile.name,
					pfp: profile.pfp,
					content: post.content,
					image: post.image,
					commentCount: post.commentCount,
					likeCount: post.likeCount,
					index,
					time: post.time
				}}
			/>
		{/each}
	{/if}
</Main>
