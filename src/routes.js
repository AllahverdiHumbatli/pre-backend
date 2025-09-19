import {parse} from 'url';
import {getAllUsers, getUserById, totalRequests} from "./repositories/user.repository.js";
import {deleteTimeById, getTimesFiltered, saveCurrentTime, updateTimeById} from "./repositories/timer.repository.js";

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
    if (url.pathname === '/hello' && method === 'GET') {
        totalRequests.totalRequests +=  1
        totalRequests.routes.hello +=1

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Hello from my server!');
        return;
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    if (req.method === 'GET' && req.url?.startsWith('/timer')) {
        const parsed = new URL(req.url, `http://${req.headers.host}`);
        const from = parsed.searchParams.get('from'); // ISO или null
        const to = parsed.searchParams.get('to');     // ISO или null

        // валидатор ISO UTC
        const isValidISO = (s) => {
            const d = new Date(s);
            return !Number.isNaN(d.getTime()) && d.toISOString() === s;
        };

        if (from && !isValidISO(from)) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Invalid from format' }));
            return;
        }
        if (to && !isValidISO(to)) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: 'Invalid to format' }));
            return;
        }

        const times = await getTimesFiltered({ from, to });

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(times));
        return;
    }


    if (url.pathname === '/timer/save' && method === 'POST') {
        const time = await saveCurrentTime();
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(time));
        return;
    }

    if (url.pathname?.startsWith('/timer/') && method === 'DELETE') {
        const id = url.pathname.split('/')[2];
        await deleteTimeById(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `Deleted time with ID ${id}` }));
        return;
    }
    if (req.method === 'PUT' && req.url.startsWith('/timer/')) {
        try {
            // Надежный парсинг URL
            const parsed = new URL(req.url, `http://${req.headers.host}`);
            console.log("parsed URL: " + parsed);
            const pathname = parsed.pathname;
            console.log("pathname: " + pathname);// например: /timer/123
            const savedAt = parsed.searchParams.get('saved_at'); // берём из query: ?saved_at=...
            console.log("savedAt: " + savedAt);

            // Извлечь id из пути
            const parts = pathname.split('/').filter(Boolean); // ['timer','123']
            const idStr = parts[1] || '';                      // '123'
            console.log("idr", idStr);

            // Валидация id
            const idNum = Number(idStr);
            if (!idStr || Number.isNaN(idNum) || !Number.isFinite(idNum) || idNum <= 0) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Invalid timer ID' }));
                return;
            }

            // Валидация saved_at (обязательный параметр)
            if (typeof savedAt !== 'string' || savedAt.length === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Invalid saved_at format' }));
                return;
            }

            const date = new Date(savedAt);
            // Invalid Date => getTime() = NaN
            if (Number.isNaN(date.getTime())) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Invalid saved_at format' }));
                return;
            }

            // Принимаем только каноничный ISO UTC вид: YYYY-MM-DDTHH:mm:ss.sssZ
            if (date.toISOString() !== savedAt) {
                res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
                res.end(JSON.stringify({ error: 'Invalid saved_at format' }));
                return;
            }

            // Бизнес-логика
            const updated = await  updateTimeById(idNum, savedAt);
            if (!updated) {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('User not found');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(updated));
            return;
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Ошибка сервера');
            return;
        }
    }


    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page not found');
}