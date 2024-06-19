<script lang="ts">
    import { onMount } from "svelte";
    import {
        getChannelName,
        getGuildImageUrl,
        setupDiscordSdk,
    } from "./lib/discord";
    import { loadImage } from "./lib/image";
    import voiceIconUrl from "./assets/png/voice_icon.png";
    import Loading from "./Loading.svelte";
    import Central from "./Central.svelte";
    import {
        debugLog,
        debugInfo,
        debugError,
        setDebugLog,
        setDebugInfo,
        setDebugError,
    } from "./lib/debug";

    let debug: HTMLElement;
    let guildImage: HTMLImageElement;
    let voiceIcon: HTMLImageElement;
    let channelName: HTMLParagraphElement;

    setDebugLog((text: string) => {
        const e = document.createElement("p");
        e.innerText = text;
        debug.appendChild(e);
        debug.scrollTop = debug.scrollHeight;
        return e;
    });

    setDebugInfo((text: string) => {
        const e = document.createElement("p");
        e.style.color = "#0099FF";
        e.style.fontStyle = "italic";
        e.innerText = text;
        debug.appendChild(e);
        debug.scrollTop = debug.scrollHeight;
        return e;
    });

    setDebugError((text: string) => {
        const e = document.createElement("p");
        e.style.color = "#FF0000";
        e.style.fontWeight = "bold";
        e.innerText = text;
        debug.appendChild(e);
        debug.scrollTop = debug.scrollHeight;
        return e;
    });

    let loading = new Promise<void>((res) =>
        onMount(async () => {
            const voice = loadImage(voiceIcon, voiceIconUrl);

            debugInfo("Setting up SDK...");
            await setupDiscordSdk();
            debugInfo("SDK setup finished!");

            await Promise.all([
                loadImage(guildImage, await getGuildImageUrl()).catch(e => {
                    debugError("Image may contain errors!");
                    guildImage.remove();
                }),
                (async () => await getChannelName()
                    .then(v => channelName.innerText = v)
                    .catch(e => {
                        debugError("Channel name may contain errors!")
                        channelName.remove();
                    }))(),
            ]);
            debugLog("Image + channel text loaded.");

            await voice;
            res();
        }),
    );
</script>

<code id="debug" bind:this={debug}>
    <p style="font-weight: bold; color: #FF9900">Debug:</p>
</code>

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
    #debug {
        position: absolute;
        right: 0vw;
        width: 20vw;
        bottom: 0vh;
        height: 30vh;
        padding: 1vw;
        z-index: 2;
        overflow: scroll;
        font-size: 85%;
        background-color: black;
        color: #00ff00;
        -ms-overflow-style: none; /* Internet Explorer 10+ */
        scrollbar-width: none; /* Firefox */
    }
    #debug::-webkit-scrollbar {
        display: none; /* Safari and Chrome */
    }

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
        margin-left: 4vh;
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
        transform: translateY(0.5vh);
    }

    #spacer {
        flex-grow: 1;
    }
</style>
