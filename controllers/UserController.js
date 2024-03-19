const PasswordToken = require("../models/PasswordToken")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const validator = require('validator');

const secret = "dasdasdasjkhjkyhktfdwer"

class UserController {
  async index(req,res) {
    const users = await User.findAll()
    res.json(users)
  }

  async findUser(req,res) {
    const id = req.params.id
    const user = await User.findById(id)
    if (user == undefined) {
      res.status(404)
      res.json({})
    } else {
      res.status(200)
      res.json(user)
    }
  }

  async create(req, res) {
    var {email, name, password} = req.body

    const isEmail = validator.isEmail(email)

    if (name == undefined || name == '' || name == ' ') {
      res.status(400)
      res.json({err: "O nome é invalido!"})
      return
    }
    if (!isEmail) {
      res.status(400)
      res.json({err: "O e-mail é invalido!"})
      return
    }
    if (password == undefined || password == '' || password == ' ') {
      res.status(400)
      res.json({err: "A senha é invalido!"})
      return
    }
    
    const emailExists = await User.findEmail(email)

    if (emailExists) {
      res.status(405)
      res.json({err: "Esse e-email já está cadastrado!"})
      return
    }

    await User.new(email, password, name)

    res.status(200)
    res.send("Criando usuário!")
  }

  async edit(req, res) {
    const {id, name, role, email} = req.body

    const result = await User.update(id, email, name, role)

    if (result != undefined) {
      if (result.status) {
        res.status(200)
        res.send("Usuário atualizado!")
      } else {
        res.status(406)
        res.send(result.err)
      }
    } else {
      res.status(406)
      res.send("Ocorreu um erro no servidor!")
    }
  }

  async remove(req, res) {
    const id = req.params.id
    const result = await User.delete(id)

    if (result.status) {
      res.status(200)
      res.send("Usuário deletado!")
    } else {
      res.status(406)
      res.send(result.err)
    }
  }

  async recoverPassword(req, res) {
    const email = req.body.email
    const result = await PasswordToken.create(email)

    if (result.status) {
      res.status(200)
      res.send("" + result.token)
    } else {
      res.status(406)
      res.send(result.err)
    }
  }

  async changePassword(req, res) {
    const token = req.body.token
    const password =  req.body.password

    const isTokenValid = await PasswordToken.validate(token)

    if (isTokenValid.status) {
      await User.changePassword(password, isTokenValid.tk.user_id)
      await PasswordToken.setUsed(isTokenValid.tk.token)
      res.status(200)
      res.send("Senha alterada")
    } else {
      res.status(406)
      res.send("Token inválido!")
    }
  }

  async login(req, res) {
    const {email, password} = req.body
    const user = await User.findByEmail(email)

    if (user != undefined) {
      const result = await bcrypt.compare(password, user.password)

      if (result) {
        const token = jwt.sign({ email: user.email, role: user.role }, secret)

        res.status(200)
        res.send(token)
      } else {
        res.status(406)
        res.send({status: false, err: "Senha incorreta!"})
      }
    } else {
      res.status(400)
      res.json({status: false, err: "Usuário não encontrado!"})
    }
  }
}

module.exports = new UserController();