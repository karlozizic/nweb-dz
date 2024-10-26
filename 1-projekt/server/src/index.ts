import express, { Request, Response } from 'express';
import https from 'https';
import fs from 'fs';

const app = express();

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;

const config = {
    baseURL: externalUrl || `https://localhost:${port}`,
};

app.get('/', (req: Request, res: Response) => {
    res.send('app working');
});

app.get('/test', (req: Request, res: Response) => {
    res.send('testing route');
});

if (externalUrl) {
    const hostname = '0.0.0.0';
    app.listen(port, hostname, () => {
        console.log(`locally run on: http://${hostname}:${port}/ available on url: ${externalUrl}`);
    });
}
else {
    https.createServer(
        {
            key: fs.readFileSync('server.key'),
            cert: fs.readFileSync('server.cert'),
        },
        app
    ).listen(port, () => {
        console.log(`server run on: https://localhost:${port}/`);
    });
}