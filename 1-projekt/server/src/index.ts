import express, { Request, Response } from 'express';

const app = express();

const port = process.env.PORT || 3000;
const externalUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`;

app.listen(<number>port, '0.0.0.0', () => {
    console.log(`Server run on ${externalUrl}`);
});