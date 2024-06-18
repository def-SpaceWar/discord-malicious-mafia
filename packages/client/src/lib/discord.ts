import { DiscordSDK } from '@discord/embedded-app-sdk';
import type { CommandResponse } from '@discord/embedded-app-sdk';

type Auth = CommandResponse<'authenticate'>;
let auth: Auth;
let sdk: DiscordSDK;

export async function setupDiscordSdk(): Promise<void> {
    sdk = new DiscordSDK(import.meta.env.VITE_CLIENT_ID);
    await sdk.ready();

    const { code } = await sdk.commands.authorize({
        client_id: import.meta.env.VITE_CLIENT_ID,
        response_type: 'code',
        state: '',
        prompt: 'none',
        scope: [
            'applications.commands',
            'identify',
            'guilds',
            'rpc.voice.read',
        ],
    });

    // Retrieve an access_token from your activity's server
    const response = await fetch('/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
    });
    const { access_token } = await response.json();

    auth = await sdk.commands.authenticate({ access_token });
    if (auth == null) throw new Error('Authenticate command failed');
}

export async function getGuildImageUrl(): Promise<string> {
    const guilds: Array<{ id: string; icon: string }> = await fetch(`https://discord.com/api/users/@me/guilds`, {
        headers: { Authorization: `Bearer ${auth.access_token}`, 'Content-Type': 'application/json' },
    }).then((reply) => reply.json());

    const currentGuild = guilds.find((g) => g.id === sdk.guildId);
    if (currentGuild == null) throw new Error("Not in a guild!");
    return `https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.webp?size=128`;
}

export async function getChannelName(): Promise<string> {
    let activityChannelName = 'Unknown';

    if (sdk.channelId == null || sdk.guildId == null) return activityChannelName;
    const channel = await sdk.commands.getChannel({ channel_id: sdk.channelId });
    if (channel.name != null) activityChannelName = channel.name;

    return activityChannelName;
}

/**

/**
 * This function fetches the current voice channel over RPC. It then creates a
 * text element that displays the voice channel's name
 *
export async function appendVoiceChannelName(elem: HTMLElement) {
    let activityChannelName = 'Unknown';

    // Requesting the channel in GDMs (when the guild ID is null) requires
    // the dm_channels.read scope which requires Discord approval.
    if (discordSdk.channelId != null && discordSdk.guildId != null) {
        // Over RPC collect info about the channel
        const channel = await discordSdk.commands.getChannel({ channel_id: discordSdk.channelId });
        if (channel.name != null) {
            activityChannelName = channel.name;
        }
    }

    // Update the UI with the name of the current voice channel
    const textTagString = `Activity Channel: "${activityChannelName}"`;
    const textTag = document.createElement('p');
    textTag.textContent = textTagString;
    elem.appendChild(textTag);
}

/**
 * This function utilizes RPC and HTTP apis, in order show the current guild's avatar
 * Here are the steps:
 * 1. From RPC fetch the currently selected voice channel, which contains the voice channel's guild id
 * 2. From the HTTP API fetch a list of all of the user's guilds
 * 3. Find the current guild's info, including its "icon"
 * 4. Append to the UI an img tag with the related information
 *
export async function appendGuildAvatar(elem: HTMLElement) {
    // 1. From the HTTP API fetch a list of all of the user's guilds
    const guilds: Array<{ id: string; icon: string }> = await fetch(`https://discord.com/api/users/@me/guilds`, {
        headers: {
            // NOTE: we're using the access_token provided by the "authenticate" command
            Authorization: `Bearer ${auth.access_token}`,
            'Content-Type': 'application/json',
        },
    }).then((reply) => reply.json());

    // 2. Find the current guild's info, including it's "icon"
    const currentGuild = guilds.find((g) => g.id === discordSdk.guildId);

    // 3. Append to the UI an img tag with the related information
    if (currentGuild != null) {
        const guildImg = document.createElement('img');
        guildImg.setAttribute(
            'src',
            // More info on image formatting here: https://discord.com/developers/docs/reference#image-formatting
            `https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.webp?size=128`,
        );
        guildImg.setAttribute('width', '128px');
        guildImg.setAttribute('height', '128px');
        guildImg.setAttribute('style', 'border-radius: 50%;');
        elem.appendChild(guildImg);
    }
}
*/
