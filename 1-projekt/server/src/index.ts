import express, { Request, Response } from 'express';
import https from 'https';
import fs from 'fs';
import cors from 'cors';
import { auth } from 'express-oauth2-jwt-bearer';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

dotenv.config({ path: '.env' });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

const app = express();

const externalUrl = process.env.RENDER_EXTERNAL_URL;
//const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;

/*const config = {
    baseURL: externalUrl || `https://localhost:${port}`,
};*/

const checkJwtM2M = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`
});

//TODO: uncomment
/*const allowedUrls = ['http://localhost:4000',
    'http://localhost:4000/generateGiftCard',
    'https://nweb-dz-1.onrender.com/',
    'https://nweb-dz-1.onrender.com/generateGiftCard'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedUrls.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));*/

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.get('/api/giftCards', async (req: Request, res: Response) => {
    try {
        console.log('GET /api/giftCards');
        const result = await pool.query('SELECT * FROM gift_cards');
        res.setHeader('Content-Type', 'application/json');
        res.json({num: result.rows.length});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.post('/api/giftCards/generate', checkJwtM2M, async (req: Request, res: Response) : Promise<any> => {
    const { oib, firstName, lastName} = req.body;

    if (!oib || !firstName || !lastName) {
        return res.status(400).json({error: 'Missing required fields for gift card generation'});
    }

    const gitfCardsNumByOib = await pool.query(
        'SELECT COUNT(*) FROM gift_cards WHERE oib = $1',
        [oib]
    );

    if (gitfCardsNumByOib.rows[0].count >= 3) {
        return res.status(400).json({error: 'Maximum number of gift cards reached for this OIB'});
    }

    const giftCardId = uuidv4();

    const result = await pool.query('INSERT INTO gift_cards (id, oib, first_name, last_name, created) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)', [giftCardId, oib, firstName, lastName]);

    const giftCardUrl = `${process.env.FRONTEND_URL}/#/giftCard/${giftCardId}`;

    const qrCode = await QRCode.toDataURL(giftCardUrl);

    res.json({qrCode: qrCode});
});

app.get('/api/giftCard/:id', async (req: Request, res: Response) : Promise<any> => {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM gift_cards WHERE id = $1', [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({error: 'Gift card not found'});
    }

    res.json(result.rows[0]);
});
//TODO
/*
if (externalUrl === undefined) {
    const hostname = '0.0.0.0';
    app.listen(port, hostname, () => {
        console.log(`locally run on: http://${hostname}:${port}/ available on url: ${externalUrl}`);
    });
}
else {
    const httpsOptions = {
        /!*key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert'),*!/
    };

    https.createServer(httpsOptions, app).listen(port, () => {
        console.log(`Server running on: ${externalUrl}`);
    });
}*/
const port = process.env.PORT || 4080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});