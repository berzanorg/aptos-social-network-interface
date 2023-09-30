<script lang="ts">
	import IconLike from './IconLike.svelte';
	import IconComments from './IconComments.svelte';
	import { base } from '$app/paths';
	import { wallet } from '$lib/stores/wallet';
	import { getTimeFromNow } from '$lib/utils/getTimeFromNow';

	export let post: {
		addr: string;
		name: string;
		index: number;
		pfp: string;
		content: string;
		image: string;
		commentCount: number;
		likeCount: number;
		time: number;
	};

	const handlerLikePost = async (e: MouseEvent) => {
		e.preventDefault();

		await wallet.likePost({
			postOwnerAddr: post.addr,
			postIndex: post.index
		});
	};
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-img-redundant-alt -->

<a
	class="flex items-start px-4 pt-4 pb-1.5 gap-4 border-b border-neutral-800 hover:bg-neutral-950 duration-150"
	href="{base}/user/{post.name}/post/{post.index}"
>
	<a class="flex rounded-full" href="{base}/user/{post.name}">
		<img
			class="aspect-square w-14 rounded-full hover:scale-95 duration-150 object-cover"
			src={post.pfp}
			alt="profile picture"
		/>
	</a>
	<div class="flex flex-col items-start w-full gap-2">
		<div class="flex items-center pl-2 gap-4">
			<a
				class="font-bold text-lg hover:text-sky-300 hover:scale-95 duration-150"
				href="{base}/user/{post.name}">@{post.name}</a
			>
			<p class="text-neutral-500">{getTimeFromNow(post.time)}</p>
		</div>
		{#if post.image !== 'none'}
			<div class="pl-2 py-1.5">
				<img
					class="rounded-2xl border border-neutral-900 bg-black"
					src={post.image}
					alt="post image"
				/>
			</div>
		{/if}
		<p class="pl-2 leading-snug">
			{post.content}
		</p>
		<div class="flex justify-start items-center gap-8 pl-0.5">
			<div class="flex items-center gap-1">
				<button
					class="flex gap-4 items-center h-10 w-10 p-1.5 fill-neutral-600 hover:fill-red-400 hover:bg-red-950 hover:scale-95 rounded-full duration-150"
					on:click={handlerLikePost}
				>
					<IconLike />
				</button>
				<p class="text-neutral-500 font-semibold">{post.likeCount}</p>
			</div>

			<div class="flex items-center gap-1">
				<a
					class="h-10 w-10 p-1.5 fill-neutral-600 hover:fill-sky-400 hover:bg-sky-950 hover:scale-95 rounded-full duration-150"
					href="{base}/user/{post.name}/post/{post.index}"
				>
					<IconComments />
				</a>
				<p class="text-neutral-500 font-semibold">{post.commentCount}</p>
			</div>
		</div>
	</div>
</a>
