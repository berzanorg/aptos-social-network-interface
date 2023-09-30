<script lang="ts">
	import { base } from '$app/paths';
	import { wallet } from '$lib/stores/wallet';
	import { getTimeFromNow } from '$lib/utils/getTimeFromNow';
	import IconComments from './IconComments.svelte';
	import IconLike from './IconLike.svelte';

	export let comment: {
		addr: string;
		name: string;
		pfp: string;
		content: string;
		likeCount: number;
		index: number;
		time: number;
	};

	export let postOwnerAddr: string;
	export let postIndex: number;

	const handlerLikeComment = async () => {
		await wallet.likeComment({
			postIndex,
			postOwnerAddr,
			commentIndex: comment.index
		});
	};
</script>

<!-- svelte-ignore a11y-img-redundant-alt -->

<div class="flex px-4 pt-3 pb-1 gap-4 border-b border-neutral-800">
	<a class="self-start flex rounded-full" href="{base}/user/{comment.name}">
		<img
			class="aspect-square w-11 rounded-full hover:scale-95 duration-150 object-cover"
			src={comment.pfp}
			alt="profile picture"
		/>
	</a>
	<div class="flex flex-col items-start w-full gap-1">
		<div class="flex items-center pl-2 gap-3">
			<a
				class="font-bold hover:text-sky-300 hover:scale-95 duration-150"
				href="{base}/user/{comment.name}">@{comment.name}</a
			>
			<p class="text-sm text-neutral-500">{getTimeFromNow(comment.time)}</p>
		</div>
		<p class="pl-2 text-sm leading-snug">
			{comment.content}
		</p>
		<div class="flex justify-start items-center gap-8 pl-0.5">
			<div class="flex items-center gap-1">
				<button
					class="flex gap-4 items-center h-8 w-8 p-1 fill-neutral-600 hover:fill-red-400 hover:bg-red-950 hover:scale-95 rounded-full duration-150"
					on:click={handlerLikeComment}
				>
					<IconLike />
				</button>
				<p class="text-sm text-neutral-500 font-semibold">{comment.likeCount}</p>
			</div>
		</div>
	</div>
</div>
