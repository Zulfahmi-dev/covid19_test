const db = require('../../../configs/database');
const bcrypt = require('bcryptjs');

class UserModel{
    constructor(){
        this.tbl_name = 'user_account';
    }

    async getAll(){
        try {
            
            const result = await db.query(`select * from ${this.tbl_name} ORDER BY id_user ASC`);
            // console.log(`select * from ${this.tbl_name} where hp=${data.hp}`);
            
            return result.rows;

        } catch (error) {
            console.log(error)
        }
    } 
    
    async getById(id_user){
        try {
            
            const result = await db.query(`select * from ${this.tbl_name} where id_user=${id_user} ORDER BY id_user ASC`);
            // console.log(`select * from ${this.tbl_name} where hp=${data.hp}`);
            
            return result.rows;

        } catch (error) {
            console.log(error)
        }
    } 

    async getUserByHp(hp){
        try {
            
            const result = await db.query(`select * from ${this.tbl_name} where no_telpon='${hp}'`);
            // console.log(`select * from ${this.tbl_name} where hp=${data.hp}`);
            
            return result.rows;

        } catch (error) {
            console.log(error)
        }
    }    

    async addUser(data){
        const {nama, password, no_telpon, alamat, jabatan, picture} = data;
        try {
            let password_hash = await bcrypt.hash(password, 10);
    
            let {rowCount, rows} = await db.query(`select id_user from ${this.tbl_name} order by id_user desc limit 1`);
            let id_user = rowCount > 0 ? rows[0].id_user+1 : 1;
    
            const result = await db.query(`insert into ${this.tbl_name}(
                id_user, nama, password, no_telpon, alamat, jabatan, created_on, updated_on, picture) 
                values(${id_user}, '${nama}', '${password_hash}', '${no_telpon}', '${alamat}', '${jabatan}', now(), now(), '${picture}')`);
    
            return result.rowCount;
        } catch (error) {
            console.log(error)
        }
    }

    async updateUser(data){
        console.log(data)
        const {nama, no_telpon, alamat, jabatan, id_user } = data;
        
        try {
            const update = await db.query(`UPDATE ${this.tbl_name} SET nama = $1, no_telpon = $2, alamat = $3, jabatan=$4, updated_on = now() WHERE id_user = $5`, [nama, no_telpon, alamat, jabatan, id_user])
    
            return update.rowCount;
        } catch (error) {
            console.log(error)
        }       
    }

    async updatePassword(data){
        const {password, id_user} = data;
        const password_hash = await bcrypt.hash(password, 10);
        
        try {
            const update = await db.query(`UPDATE ${this.tbl_name} SET password = $1, updated_on = now() WHERE id_user = $2 `, [password_hash, id_user]);
    
            return update.rowCount;
        } catch (error) {
            console.log(error)
        }
    }

    async updateLogin(id_user, login){
        try {

            let isLogin = login ? 1 : 0;
            let last_login = login ? ', last_login = now()' : '';
            const update = await db.query(`UPDATE ${this.tbl_name} SET is_login = $1 ${last_login} WHERE id_user = $2`, [isLogin, id_user])
    
            return update.rowCount;
        } catch (error) {
            console.log(error)
        }       
    }

    async deleteUser(id_user){

        try {
            const update = await db.query(`delete from ${this.tbl_name} where id_user = $1`, [id_user])
    
            return update.rowCount;
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = UserModel;