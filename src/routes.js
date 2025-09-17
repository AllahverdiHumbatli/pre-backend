import {parse} from 'url';
import {getAllUsers, getUserById, totalRequests} from "./repositories/user.repository.js";

export async function router(req, res) {
    // Получаем путь (с помощью утилиты parse) и метод из запроса
    console.log("here ", typeof req.url.split("/")[2]);
    const url = parse(req.url || '', true);
    const method = req.method;
    const now = new Date();
    const formatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

   console.log(`[${method}] ${url.pathname} at ${now.toISOString()}`);
    if (url.pathname === '/hello' && method === 'GET') {
        totalRequests.totalRequests +=  1
        totalRequests.routes.hello +=1

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello from my server!');
        return;
    }

    if (url.pathname === '/time' && method === 'GET') {
        res.writeHead(201, { 'Content-Type': 'text/plain' });
        res.end(`Current time is: ${formatted}`);
        return;
    }
    if (url.pathname === '/about' && method === 'GET') {
        totalRequests.totalRequests +=  1
        totalRequests.routes.about +=1
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('My name is Artem, I study Back-end.');
        return;
    }
    if (
        method === 'GET' &&
        req.url.startsWith('/users/') &&
        typeof req.url.split('/')[2] === 'string' &&
        req.url.split('/')[2] !== ''
    ) {
        const id = req.url.split("/")[2]
        const user = getUserById(id);
        if (!user) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('User not found');
            return
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });

        res.end(JSON.stringify(user));
        return;
    }
    if (url.pathname === '/users' && method === 'GET') {
        totalRequests.totalRequests +=  1
        totalRequests.routes.users +=1
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const users = getAllUsers();
        res.end(JSON.stringify(users));
        return;
    }
    if (url.pathname === '/stats' && method === 'GET') {

        res.writeHead(200, { 'Content-Type': 'application/json' });
        const users = getAllUsers();
        res.end(JSON.stringify(totalRequests));
        return;
    }


    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page not found');
}