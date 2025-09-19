import { pool }  from '../db.js';

export async function getTimesFiltered({ from, to }) {
    const where = [];
    const params = [];
    let i = 1;

    if (from) {
        where.push(`saved_at >= $${i++}`);
        params.push(from);
    }
    if (to) {
        where.push(`saved_at <= $${i++}`);
        params.push(to);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sql = `SELECT * FROM times ${whereSql} ORDER BY id DESC`;

    const result = await pool.query(sql, params);
    return result.rows;
}

export async function saveCurrentTime() {
    const result = await pool.query('INSERT INTO times (saved_at) VALUES (NOW()) RETURNING *');
    return result.rows[0];
}

export async function deleteTimeById(id) {
    await pool.query('DELETE FROM times WHERE id = $1', [id]);
}
export async function updateTimeById(id, newTimestamp) {
    const result = await pool.query(
        'UPDATE times SET saved_at = $2 WHERE id = $1 RETURNING *',
        [id, newTimestamp]
    );
    console.log(result.rows[0]);
    return result.rows[0];
}