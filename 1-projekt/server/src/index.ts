import express, { Request, Response } from 'express';
import https from 'https';
import fs from 'fs';
import cors from 'cors';

const app = express();

const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;

const config = {
    baseURL: externalUrl || `https://localhost:${port}`,
};

const allowed = ['http://localhost:4000', 'https://nweb-dz-1.onrender.com'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

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