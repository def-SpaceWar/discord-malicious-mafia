import path from 'path';
import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import { fetchAndRetry } from './utils';
dotenv.config({ path: '../../.env' });

const app: Application = express();
const port: number = Number(process.env.PORT) || 3001;

app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../../client/dist');
    app.use(express.static(clientBuildPath));
}

app.post('/api/token', async (req: Request, res: Response) => {
    const response = await (await fetchAndRetry(
        `https://discord.com/api/oauth2/token`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.VITE_CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: req.body.code,
            }),
        },
    )).json() as { access_token: string };

    res.send({ access_token: response.access_token });
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}!`);
});
