// import { pool }  from '../db.js';
//
// export async function getAllTimes() {
//     const result = await pool.query('SELECT * FROM times ORDER BY id DESC');
//     return result.rows;
// }
//
// export async function saveCurrentTime() {
//     const result = await pool.query('INSERT INTO times (saved_at) VALUES (NOW()) RETURNING *');
//     return result.rows[0];
// }
//
// export async function deleteTimeById(id) {
//     await pool.query('DELETE FROM times WHERE id = $1', [id]);
// }