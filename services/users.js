const pool = require("../configs/database")



exports.get = async (req, res) => {
    const conn = await pool.connect()
    try {
        const result = await conn.query(`SELECT * FROM public.user_accounts ORDER BY id ASC`)
        res.send(result.rows)
    } catch (err) {
        console.log(err.stack)
    } finally {
        conn.release()
    }
}

exports.getById = async (req, res) => {
    const conn = await pool.connect()
    const id = parseInt(req.params.id)
    try {
        const result = await conn.query(`SELECT * FROM public.user_accounts WHERE id = $1`, [id])
        res.send(result.rows)
    } catch (err) {
        console.log(err.stack)
    } finally {
        conn.release()
    }
}

// exports.create = async (req, res) => {
//     const conn = await pool.connect()
//     const { username, password, email } = req.body
//     try {
//         const result = await conn.query(`INSERT INTO public.user_accounts (phone, email, password) VALUES ($1, $2, $3)`, [phone, email, password])
//         res.send({ success: `User created with id ${result.insertId}` })
//     } catch (err) {
//         console.log(err.stack)
//     } finally {    
//         conn.release()
//     }
// }

exports.update = async (req, res) => {
    const conn = await pool.connect()
    const id = parseInt(req.params.id)
    const { fullname, id_jabatan, no_telepon, address } = req.body

    try {
        await conn.query(`UPDATE public.user_accounts SET fullname = $1, id_jabatan = $2, no_telepon = $3, address = $4 WHERE id = $5`, [fullname, id_jabatan, no_telepon, address, id])
        res.send({ status: "success" })
    } catch (err) {
        console.log(err.stack)
    } finally {
        conn.release()
    }
}

// exports.delete = async (req, res) => {
//     const conn = await pool.connect()
//     const id = parseInt(req.params.id)
//     try {
//         await conn.query(`DELETE FROM public.user_accounts WHERE id = $1`, [id])
//         res.send({ success: `User deleted with id ${id}` })
//     } catch (err) {
//         console.log(err.stack)
//     } finally {    
//         conn.release()
//     }
// }

exports.updatepassword = async (req, res) => {
    const conn = await pool.connect()
    const id = parseInt(req.params.id)
    const { password } = req.body

    try {
        await conn.query(`UPDATE public.user_accounts SET password = $1 WHERE id = $2`, [password, id])
        res.send({ status: "success" })
    } catch (err) {
        console.log(err.stack)
    } finally {
        conn.release()
    }
}