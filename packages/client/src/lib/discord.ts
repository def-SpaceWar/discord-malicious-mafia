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

    const currentGuild = guilds.find(g => g.id === sdk.guildId);
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
