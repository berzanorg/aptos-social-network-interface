<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import CardInformConnection from '$lib/components/CardInformConnection.svelte';
	import Main from '$lib/components/Main.svelte';
	import { contract } from '$lib/stores/contract';
	import { wallet } from '$lib/stores/wallet';
	import { Errors } from '$lib/utils/errors';
	import { handlerAutoRows, handlerOnlyAllowPaste } from '$lib/utils/textarea_and_input';
	import { onMount } from 'svelte';

	let bindedImageURL = '';
	let bindedName = '';
	let bindedBio = '';

	$: user = $contract.users.find(({ addr }) => addr === $wallet.address);

	onMount(async () => {
		bindedImageURL = user?.pfp || '';
		bindedName = user?.name || '';
		bindedBio = user?.bio || '';
	});

	const handlerCreateProfile = async () => {
		if (!bindedImageURL) return alert(Errors.NoProfilePictureURL);
		if (!bindedName) return alert(Errors.NoName);
		if (!bindedBio) return alert(Errors.NoBio);

		await wallet.createUserProfile({
			pfp: bindedImageURL,
			name: bindedName,
			bio: bindedBio
		});

		goto(`${base}/user/${bindedName}`);
	};

	const handlerEditProfile = async () => {
		if (!bindedImageURL) return alert(Errors.NoProfilePictureURL);
		if (!bindedName) return alert(Errors.NoName);
		if (!bindedBio) return alert(Errors.NoBio);
		if (bindedImageURL === user?.pfp && bindedName === user?.name && bindedBio === user?.bio)
			return alert(Errors.ProfileNotEdited);

		await wallet.updateUserProfile({
			pfp: bindedImageURL,
			name: bindedName,
			bio: bindedBio
		});

		goto(`${base}/user/${bindedName}`);
	};
</script>

<svelte:head>
	<title>Aptos Social Network | Profile</title>
</svelte:head>

<Main
	>{#if $wallet.isConnected}
		<div class="flex flex-col px-4 sm:px-6 py-5 gap-12 border-b border-neutral-800">
			<h1 class="text-4xl font-semibold">
				{#if user}
					Edit Profile
				{:else}
					Create Profile
				{/if}
			</h1>
			<div class="flex flex-col gap-10">
				<div class="flex flex-col gap-2">
					<p class="text-lg font-semibold">Address:</p>
					<p
						class="flex items-center px-4 h-9 bg-black text-neutral-700 border border-neutral-800 rounded-full cursor-not-allowed"
						placeholder="Paste your profile picture URL..."
					>
						{$wallet.address?.slice(0, 16)}...{$wallet.address?.slice(-16)}
					</p>
				</div>
				<div class="flex flex-col gap-2">
					<p class="text-lg font-semibold">Profile Picture URL:</p>
					<input
						class="px-4 h-9 bg-black placeholder:text-neutral-500 hover:placeholder:text-neutral-400 focus:placeholder:text-neutral-400 outline-none border border-neutral-800 hover:border-neutral-700 focus:border-sky-500 rounded-full w-full"
						placeholder="Paste your profile picture URL..."
						on:keydown={handlerOnlyAllowPaste}
						bind:value={bindedImageURL}
					/>
				</div>
				<div class="flex flex-col gap-2">
					<p class="text-lg font-semibold">Name:</p>
					<input
						class="px-4 h-9 bg-black placeholder:text-neutral-500 hover:placeholder:text-neutral-400 focus:placeholder:text-neutral-400 outline-none border border-neutral-800 hover:border-neutral-700 focus:border-sky-500 rounded-full w-full"
						placeholder="Write your name..."
						bind:value={bindedName}
					/>
				</div>
				<div class="flex flex-col gap-2">
					<p class="text-lg font-semibold">Bio:</p>
					<textarea
						class="px-4 py-2 bg-black placeholder:text-neutral-500 hover:placeholder:text-neutral-400 focus:placeholder:text-neutral-400 outline-none border border-neutral-800 hover:border-neutral-700 focus:border-sky-500 rounded-2xl w-full duration-150 resize-none overflow-hidden"
						placeholder="Write your bio..."
						rows={3}
						on:keydown={handlerAutoRows}
						bind:value={bindedBio}
					/>
				</div>
			</div>

			<button
				class="self-end text-lg font-semibold px-4 h-9 rounded-full bg-sky-500 hover:bg-sky-600 hover:scale-95 duration-150"
				on:click={user ? handlerEditProfile : handlerCreateProfile}
			>
				{#if user}
					Save
				{:else}
					Create
				{/if}
			</button>
		</div>
	{:else}
		<CardInformConnection />
	{/if}
</Main>
