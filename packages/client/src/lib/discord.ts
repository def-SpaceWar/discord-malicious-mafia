import { DiscordSDK } from '@discord/embedded-app-sdk';
import type { CommandResponse } from '@discord/embedded-app-sdk';
import { debugError, debugLog } from './debug';

type Auth = CommandResponse<'authenticate'>;
let auth: Auth;
let sdk: DiscordSDK;

export async function setupDiscordSdk(): Promise<void> {
    try {
        sdk = new DiscordSDK(import.meta.env.VITE_CLIENT_ID);
        await sdk.ready();
        const e = debugLog("SDK ready.");

        const { code } = await sdk.commands.authorize({
            client_id: import.meta.env.VITE_CLIENT_ID,
            response_type: 'code',
            state: '',
            prompt: 'none',
            scope: [
                'identify',
                'guilds',
                'applications.commands',
            ],
        });
        e.innerText = "Got authorization code.";

        const response = await fetch('/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        });
        e.innerText = "Fetching access token.";
        const { access_token } = await response.json();
        e.innerText = "Access token fetched.";

        auth = await sdk.commands.authenticate({ access_token });
        if (auth == null) throw new Error('Authenticate failed. ;(');
        e.innerText = "Successfully authenticated.";
    } catch (e) {
        debugError(e as string);
        throw e;
    }
}

export async function getGuildImageUrl(): Promise<string> {
    try {
        const guilds: Array<{ id: string; icon: string }> = await fetch(`https://discord.com/api/users/@me/guilds`, {
            headers: { Authorization: `Bearer ${auth.access_token}`, 'Content-Type': 'application/json' },
        }).then((reply) => reply.json());

        const currentGuild = guilds.find(g => g.id === sdk.guildId);
        if (currentGuild == null) throw new Error("Not in a guild!");

        return `https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.webp?size=128`;
    } catch (e) {
        debugError(e as string);
        throw e;
    }
}

export async function getChannelName(): Promise<string> {
    try {
        let activityChannelName = 'Unknown';

        if (sdk.channelId == null || sdk.guildId == null) return activityChannelName;
        const channel = await sdk.commands.getChannel({ channel_id: sdk.channelId });
        if (channel.name != null) activityChannelName = channel.name;

        return activityChannelName;
    } catch (e) {
        debugError(e as string);
        throw e;
    }
}
