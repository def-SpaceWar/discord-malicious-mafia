<script lang="ts">
    import { onMount } from "svelte";
    import {
        getChannelName,
        getGuildImageUrl,
        setupDiscordSdk,
    } from "./lib/discord";
    import { loadImage } from "./lib/image";
    import voiceIconUrl from "./assets/voice_icon.png";
    import Loading from "./Loading.svelte";
    import Central from "./Central.svelte";

    let guildImage: HTMLImageElement;
    let voiceIcon: HTMLImageElement;
    let channelName: HTMLParagraphElement;

    let loading = new Promise<void>((res) =>
        onMount(async () => {
            const voice = loadImage(voiceIcon, voiceIconUrl);

            await setupDiscordSdk();
            await Promise.all([
                loadImage(guildImage, await getGuildImageUrl()),
                (async () =>
                    (channelName.innerText = await getChannelName()))(),
            ]);

            await voice;
            res();
        }),
    );
</script>

{#await loading}
    <Loading />
{/await}

<nav>
    <img alt="Guild" id="guild-image" bind:this={guildImage} />
    <img alt="Voice Channel" id="voice-icon" bind:this={voiceIcon} />
    <div id="channel-name"><p bind:this={channelName}></p></div>
    <div id="spacer"></div>
    <!--Put user icon + name-->
</nav>

{#await loading then}
    <Central />
{/await}

<style>
    nav {
        background-color: var(--dark-bg);
        position: sticky;
        top: 0;
        left: 0;
        width: 100vw;
        height: 10vh;
        display: flex;
    }

    #guild-image {
        margin-left: 1vh;
        margin-top: 1vh;
        margin-bottom: 1vh;
        margin-right: 2vh;
        height: 8vh;
        border-radius: 50%;
    }

    #voice-icon {
        margin-top: 2.5vh;
        margin-bottom: 2.5vh;
        margin-left: 2vh;
        height: 5vh;
    }

    #channel-name {
        margin-top: 1vh;
        margin-bottom: 1vh;
        margin-right: 2vh;
        margin-left: 1vh;
        transform: translateY(-0.175vh);
    }

    #spacer {
        flex-grow: 1;
    }
</style>
