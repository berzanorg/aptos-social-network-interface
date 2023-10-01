<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import CardComment from '$lib/components/CardComment.svelte';
	import CardMakeComment from '$lib/components/CardMakeComment.svelte';
	import CardPost from '$lib/components/CardPost.svelte';
	import Main from '$lib/components/Main.svelte';
	import { contract, type User } from '$lib/stores/contract.js';
	import { Errors } from '$lib/utils/errors.js';

	export let data;

	$: postIndex = (() => {
		try {
			return parseInt(data.postindex);
		} catch {
			alert(Errors.PostNotFound);
			goto(`${base}/`);
			//unreachable
			return -1;
		}
	})();

	$: profile = $contract.users.find(({ name }) => data.name === name);
	$: post = profile?.posts.at(postIndex);

	$: comments =
		post?.comments
			.map((c, i) => {
				const commentUser = $contract.users.find(({ addr }) => addr === c.addr) as User;

				return {
					addr: c.addr,
					name: commentUser.name,
					pfp: commentUser.pfp,
					content: c.content,
					likeCount: c.like_count,
					index: i,
					time: c.time
				};
			})
			.sort((a, b) => b.time - a.time) || [];
</script>

<svelte:head>
	<title>Aptos Social Network {profile && ` | ${profile.name} | ${postIndex}`}</title>
</svelte:head>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<Main>
	{#if profile && post}
		<CardPost
			post={{
				addr: profile.addr,
				name: profile.name,
				pfp: profile.pfp,
				content: post.content,
				image: post.image,
				commentCount: post.comments.length,
				likeCount: post.like_count,
				index: postIndex,
				time: post.time
			}}
		/>
		<CardMakeComment {postIndex} postOwnerAddr={profile.addr} />
		{#each comments as comment (comment.time)}
			<CardComment {comment} {postIndex} postOwnerAddr={profile.addr} />
		{/each}
	{/if}
</Main>
