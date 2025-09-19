const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

// Промисификация fs.readFile
function readFilePromise(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// Функция delay - промис с задержкой
function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

// Создаем HTTP сервер
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Устанавливаем заголовки для HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');

    try {
        if (pathname === '/home' && req.method === 'GET') {
            // Искусственная задержка 1500 мс
            await delay(1500);

            // Асинхронное чтение файла home.html
            const homeContent = await readFilePromise('./home.html');

            res.statusCode = 200;
            res.end(homeContent);

        } else if (pathname === '/about' && req.method === 'GET') {
            // Искусственная задержка 2000 мс
            await delay(2000);

            // Асинхронное чтение файла about.html
            const aboutContent = await readFilePromise('./about.html');

            res.statusCode = 200;
            res.end(aboutContent);

        } else {
            // 404 для неизвестных маршрутов
            res.statusCode = 404;
            res.end('<h1>404 - Страница не найдена</h1>');
        }

    } catch (error) {
        // Обработка любых ошибок
        console.error('Ошибка сервера:', error);
        res.statusCode = 500;
        res.end('Ошибка сервера');
    }
});

// Запускаем сервер на порту 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log('Доступные маршруты:');
    console.log('  GET /home  - главная страница');
    console.log('  GET /about - страница о нас');
});