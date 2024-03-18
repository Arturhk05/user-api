const jwt = require("jsonwebtoken")
const secret = "dasdasdasjkhjkyhktfdwer"

module.exports = function(req, res, next) {
  const authToken = req.headers['authorization']

  if (authToken != undefined) {
    const bearer = authToken.split(" ")
    const token = bearer[1]
    
    try {
      const decoded = jwt.verify(token, secret)
      
      if (decoded.role == 1) {
        next()
      } else {
        res.status(403)
        res.send("Sem permissão!")
        return
      }
    } catch (error) {
      res.status(403)
      res.send("Não autenticado!")
      return
    }
  } else {
    res.status(403)
    res.send("Não autenticado!")
    return
  }
}