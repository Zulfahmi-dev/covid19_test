const pool = require("../configs/database")
const rand = require("../helpers/rand")
const nodemailer = require("nodemailer")



exports.login = async (req, res) => {
    const conn = await pool.connect()
    const { username, password } = req.body
    try {
        const resUser = await conn.query(`SELECT * FROM public.user_account WHERE username = $1`, [username])
        if (resUser.rows.length > 0) {
            const result = await conn.query(`SELECT * FROM public.user_account WHERE username = $1 AND password = $2`, [username, password])
            if (result.rows.length > 0) {
                res.send({
                    status: "success",
                    data: result.rows[0],
                })
            } else {
                res.send({ 
                    status: "failed",
                    message: "Password tidak sesuai dengan Nomor HP." 
                })
            }
        } else {
            res.send({ 
                status: "failed",
                message: "Nomor HP tidak ditemukan." 
            })
        }
    } catch (err) {
        console.log(err.stack)
    } finally {    
        conn.release()
    }
}

exports.logout = async (req, res) => {
    const conn = await pool.connect()
    const { password } = req.body

    try {
        // await conn.query(``, [password, id])        
        res.send({ status: "success" })
    } catch (err) {
        console.log(err.stack)
    } finally {    
        conn.release()
    }
}