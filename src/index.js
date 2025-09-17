import http from 'http';
import { router } from './routes.js';

const port = Number(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
    router(req, res).catch((err) => {
        console.error(err);
        res.writeHead(500);
        res.end('Internal Server Error');
    });

});

server.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});