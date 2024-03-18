const knex = require("../database/connection")
const bcrypt = require("bcrypt")

class User {
  async findAll() {
    try {
      return await knex.select(["id", "email", "name", "role"]).table("users")
    } catch (error) {
      console.log(error)
      return []
    }
  }

  async findById(id) {
    try {
      const result = await knex.select(["id", "email", "name", "role"]).where({id: id}).table("users")

      if (result.length > 0) {
        return result[0]
      } else {
        return undefined
      }
    } catch (error) {
      console.log(error)
      return undefined
    }
  }

  async findByEmail(email) {
    try {
      const result = await knex.select(["id", "email", "password", "name", "role"]).where({email: email}).table("users")

      if (result.length > 0) {
        return result[0]
      } else {
        return undefined
      }
    } catch (error) {
      console.log(error)
      return undefined
    }
  }

  async new(email, password, name) {
    try {
      const hash = await bcrypt.hash(password, 10)

      await knex.insert({name, email, password: hash, role: 0}).table("users")
    } catch (error) {
      console.log(error)
    }
  }

  async findEmail(email) {
    try {
      const result = await knex.select("*").from("users").where({email: email})
      
      if (result.length > 0) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log(error)
    }
  }

  async update(id, email, name, role) {
    const user = await this.findById(id)

    if (user != undefined) {
      const editUser = {}

      if (email != undefined) {
        if (email != user.email) {
          const emailExists = await this.findEmail(email)
          if (!emailExists) {
            editUser.email = email
          } else {
            return {status: false, err: "O e-mail já está cadastrado!"}
          }
        }
      }

      if (name != undefined) {
        editUser.name = name
      }

      if (role != undefined) {
        editUser.role = role
      }

      try {
        await knex.update(editUser).where({id: id}).table("users")
        return {status: true}
      } catch (error) {
        return {status: false, error}
      }

    } else {
      return {status: false, err: "O usuário não existe!"}
    }
  }

  async delete(id) {
    const user = await this.findById(id)

    if (user != undefined) {
      try {
        await knex.delete().where({id: id}).table("users")
        return {status: true}
      } catch (error) {
        return {status: false, err: error}
      }
    } else {
      return {status: false, err: "O usuário não existe!"}
    }
  }

  async changePassword(newPassword, id) {
    const hash = await bcrypt.hash(newPassword, 10)

    await knex.update({password: hash}).where({id: id}).table("users")
  }
}

module.exports = new User