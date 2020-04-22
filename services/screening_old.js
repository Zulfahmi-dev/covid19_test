const pool = require("../configs/database")
const moment = require("moment")

exports.get = async (req, res) => {
    const conn = await pool.connect()
    const { nama, tgl_mulai, tgl_akhir, id_status_covid } = req.query
    try {
        let filter = " WHERE 1 = 1 "
        if (nama) filter += ` AND nama >= '%${nama}%'`
        if (tgl_mulai) filter += ` AND date_entry >= '${moment(tgl_mulai).format("YYYY-MM-DD")}'`
        if (tgl_akhir) filter += ` AND date_entry <= '${moment(tgl_akhir).format("YYYY-MM-DD")}'`
        if (id_status_covid) filter += ` AND id_status_covid = ${id_status_covid}`
        const query = ` SELECT * 
                        FROM public.screeening 
                        ${filter}
                        ORDER BY id ASC`
        const result = await conn.query(query)
        res.send({
            status: "success",
            data: result.rows,
        })
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
        const result = await conn.query(`SELECT * FROM public.screeening WHERE id = $1`, [id])
        res.send({
            status: "success",
            data: result.rows[0],
        })
    } catch (err) {
        console.log(err.stack)
    } finally {
        conn.release()
    }
}

exports.create = async (req, res) => {
    const conn = await pool.connect()
    const form = JSON.parse(req.body.form)

    const filesIdentitas = req.files.identitas ? req.files.identitas.map(x => ({ filename: x.filename, encoding: x.encoding, size: x.size })) : []
    const filesScreening = req.files.screening ? req.files.screening.map(x => ({ filename: x.filename, encoding: x.encoding, size: x.size })) : []

    const { status_covid, no_identitas, nama, jenis_kelamin, negara, provinsi, kota_kabupaten, kecamatan, desa_kelurahan, dusun, rt, rw } = form
    const foto = {
        identitas: {
            dir: 'uploads/identitas',
            files: filesIdentitas
        },
        screening: {
            dir: 'uploads/screening',
            files: filesScreening
        }
    }

    try {
        const insertParams = [
            (status_covid || 1),
            foto,
            no_identitas,
            nama,
            jenis_kelamin,
            negara,
            provinsi,
            kota_kabupaten,
            kecamatan,
            desa_kelurahan,
            dusun,
            rt,
            rw,
            moment(new Date()).format("YYYY-MM-DD"),
        ]
        const result = await conn.query(`INSERT INTO public.screeening (
            id_status_covid,
            photos,
            no_identitas,
            nama,
            jenis_kelamin,
            negara,
            provinsi,
            kota_kabupaten,
            kecamatan,
            desa_kelurahan,
            alamat,
            rt,
            rw,
            date_entry
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`, insertParams)
        if (result.rowCount) {
            res.send({ status: "success" })
        } else {
            res.send({ status: "failed" })
        }
    } catch (err) {
        console.log({ status: JSON.stringify(err) })
    } finally {
        conn.release()
    }
}