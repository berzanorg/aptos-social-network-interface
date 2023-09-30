<script lang="ts">
	import { base } from '$app/paths';
	import { contract } from '$lib/stores/contract';
	import { wallet } from '$lib/stores/wallet';
	import { Errors } from '$lib/utils/errors';
	import { handlerAutoRows, handlerOnlyAllowPaste } from '$lib/utils/textarea_and_input';

	export let postOwnerAddr: string;
	export let postIndex: number;

	let bindedCommentContent: string = '';

	const handlerMakeComment = async () => {
		if (!bindedCommentContent) return alert(Errors.NoCommentContent);

		await wallet.makeComment({
			postOwnerAddr,
			postIndex,
			content: bindedCommentContent
		});

		bindedCommentContent = '';
	};
</script>

<!-- svelte-ignore a11y-img-redundant-alt -->

<div class="flex flex-col p-6 gap-2 border-b border-neutral-800">
	<textarea
		class="text-lg pl-2 bg-black placeholder:text-neutral-500 hover:placeholder:text-neutral-400 outline-none resize-none overflow-hidden leading-snug transition-colors"
		placeholder="Make a comment..."
		rows={1}
		on:keydown={handlerAutoRows}
		bind:value={bindedCommentContent}
	/>
	<button
		class="self-end text-lg font-semibold px-4 h-9 bg-sky-500 hover:bg-sky-600 hover:scale-95 duration-150 rounded-full"
		on:click={handlerMakeComment}
	>
		Send
	</button>
</div>
