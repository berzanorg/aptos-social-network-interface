<script lang="ts">
	import { base } from '$app/paths';
	import { contract } from '$lib/stores/contract';
	import { wallet } from '$lib/stores/wallet';
	import { Errors } from '$lib/utils/errors';
	import { handlerAutoRows, handlerOnlyAllowPaste } from '$lib/utils/textarea_and_input';
	import IconImage from './IconImage.svelte';

	let isShown = false;
	const toggleIsShown = () => (isShown = !isShown);

	let bindedPostContent: string = '';
	let bindedImageURL: string = '';

	const handlerMakePost = async () => {
		if (!bindedPostContent) return alert(Errors.NoPostContent);

		await wallet.makePost({
			content: bindedPostContent,
			image: bindedImageURL || undefined
		});

		bindedPostContent = '';
		bindedImageURL = '';
	};

	export let user: {
		name: string;
		pfp: string;
	};
</script>

<!-- svelte-ignore a11y-img-redundant-alt -->

<div class="flex px-4 pt-4 pb-3 gap-4 border-b border-neutral-800">
	<a class="flex flex-col" href="{base}/user/{user.name}">
		<img
			class="w-14 max-h-14 aspect-square rounded-full object-cover"
			src={user.pfp}
			alt="profile picture"
		/>
	</a>
	<div class="flex flex-col w-full gap-4">
		<textarea
			class="text-lg pl-2 bg-black placeholder:text-neutral-500 hover:placeholder:text-neutral-400 outline-none resize-none overflow-hidden leading-snug transition-colors"
			placeholder="Make a post..."
			rows={2}
			on:keydown={handlerAutoRows}
			bind:value={bindedPostContent}
		/>
		<div class="flex justify-between items-center gap-6">
			<div class="flex items-center w-full gap-1">
				<button
					class="p-1.5 rounded-full hover:bg-sky-950 fill-neutral-600 hover:fill-sky-400 hover:scale-95 duration-150"
					on:click={toggleIsShown}
				>
					<IconImage />
				</button>
				{#if isShown}
					<input
						class="px-3 h-8 text-sm bg-black placeholder:text-neutral-500 hover:placeholder:text-neutral-400 focus:placeholder:text-neutral-400 outline-none border border-neutral-800 hover:border-neutral-700 focus:border-sky-500 rounded-full w-full"
						placeholder="Paste an image URL..."
						bind:value={bindedImageURL}
						on:keydown={handlerOnlyAllowPaste}
					/>
				{/if}
			</div>
			<button
				class="text-lg font-semibold px-4 h-9 bg-sky-500 hover:bg-sky-600 hover:scale-95 duration-150 rounded-full"
				on:click={handlerMakePost}
			>
				Post
			</button>
		</div>
	</div>
</div>
