const bcrypt = require('bcryptjs')
const UserModel = require('../model')

class UserController{
    constructor(){
        this.userModel = new UserModel();
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.index = this.index.bind(this);
        this.getById = this.getById.bind(this);
        this.update = this.update.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.delete = this.delete.bind(this);
        this.logout = this.logout.bind(this);

    }

    async index(req, res) {
        try {
            const data = await this.userModel.getAll();

            if (data.length<1) {
                return res.send({
                    status:'failed',
                    message:'Data user tidak ditemukan'
                })    
            }
            
            res.send({
                status:'success',
                data:data
            })

        } catch (error) {
            console.log(error.stack)
        }
    }

    async getById(req, res) {
        try {
            const {id} = req.params
            const data = await this.userModel.getById(id);
            
            if (data.length<1) {
                return res.send({
                    status:'failed',
                    message:'Data user tidak ditemukan'
                })    
            }

            res.send({
                status:'success',
                data:data[0]
            })

        } catch (error) {
            console.log(error.stack)
        }
    }

    async update(req, res){
        try {
            const data = req.body;
            data.id_user = req.params.id;
            const update = await this.userModel.updateUser(data);

            if (update < 1) {
                return res.send({
                    status:'failed',
                    message:'Gagal memperbaharui data'
                })  
            }

            res.send({
                status:'success',
                message:'Berhasil memperbaharui data'
            })

        } catch (error) {
            console.log(error.stack)
        }

    }

    async updatePassword(req, res){
        try {
            const data = req.body;
            data.id_user = req.params.id;
            const update = await this.userModel.updatePassword(data);

            if (update < 1) {
                return res.send({
                    status:'failed',
                    message:'Gagal memperbaharui password'
                })  
            }

            res.send({
                status:'success',
                message:'Berhasil memperbaharui password'
            })

        } catch (error) {
            console.log(error.stack)
        }

    }

    async delete(req, res){
        try {
            const id_user = req.params.id;
            const update = await this.userModel.deleteUser(id_user);

            if (update < 1) {
                return res.send({
                    status:'failed',
                    message:'Gagal menghapus data'
                })  
            }

            res.send({
                status:'success',
                message:'Berhasil menghapus data'
            })

        } catch (error) {
            console.log(error.stack)
        }

    }

    
    async login({ body }, res){
        
        try {
            const {password, hp} = body;
            const data = await this.userModel.getUserByHp(hp);
    
            
            
            if (data.length<1) {
                return res.send({
                    status: "failed",
                    message: "Nomor HP tidak ditemukan."
                })
            }
            
            const isMatch = await bcrypt.compare(password, data[0].password);
            if (!isMatch) {
                return res.send({
                    status: "failed",
                    message: "Password tidak sesuai dengan nomor hp"
                })
            }
            else if (data[0].is_login) {
                return res.send({
                    status: "failed",
                    message: "User sedang aktif"
                })
            }

            const id_user = data[0].id_user;
            await this.userModel.updateLogin(id_user, true);
            data[0].is_login = 1;    
            res.send({
                status: "success",
                data: data[0],
            })
            
        } catch (error) {
            console.log(error)            
        }
    }
    
    async logout(req, res) {
        // const { password } = req.body
        const id_user = req.params.id;
        try {
            await this.userModel.updateLogin(id_user, false);
            // await conn.query(``, [password, id])        
            res.send({ 
                status: "success" 
            })
        } catch (err) {
            console.log(err.stack)
        }
    }
    
    async register({body}, res){
        try {
            body.picture = '';

            console.log(body)
            const result = await this.userModel.addUser(body);
            
            if (!result) {
                return res.send({
                    code:505,
                    status:'failed'
                })
            }
            res.send({
                code:200,
                status:'success'
            })

        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = UserController;