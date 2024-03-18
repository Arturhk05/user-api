class HomeController{
    async index(req, res){
        res.send("APP EXPRESS! Funcionado perfeitamente.");
    }

}

module.exports = new HomeController();