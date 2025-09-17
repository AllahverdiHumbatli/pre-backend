// import {pool} from "./db.js";
//
// export async function init() {
//     try {
//         await pool.query(`
//       CREATE TABLE IF NOT EXISTS times (
//         id SERIAL PRIMARY KEY,
//         saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
//       );
//     `);
//         console.log('✅ Таблица создана или уже существует.');
//     } catch (err) {
//         console.error('Ошибка при создании таблицы:', err);
//     } finally {
//         await pool.end();
//     }
// }
// init();