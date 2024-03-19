class HomeController{
    async index(req, res){
        res.send("APP EXPRESS! Funcionado perfeitamente.");
    }

    async validate(req, res) {
        res.status(200)
        res.send("Autorizado!")
    }
}

module.exports = new HomeController();