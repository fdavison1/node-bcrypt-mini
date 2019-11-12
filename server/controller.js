const bcrypt = require('bcryptjs');

module.exports = {
    signup: async (req, res) => {
        let {email, password} = req.body
        let db = req.app.get('db')
        let userFound = await db.check_user_exists([email])
        if (userFound[0]){
            return res.status(200).send('Email already exists')
        }
        let salt = bycrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(password, salt)
        let createdUser = await db.create_customer([email, hash])
        req.session.user = {id: createdUser[0], email: createdUser[0].email}
    },
    login: async (req, res) => {
        let {email, password} = req.body
        let db = req.app.get('db')
        let userFound = await db.check_user_exists(email)
        if (!userFound){
            return res.status(200).send('Incorrect email. Please try again.')
        }
        let result = bycrypt.compareSync(password, userFound[0].user_password)
        if (result) {
            req.session.user = {id: userFound[0].id, email: userFound[0].email}
            res.status(200).send(req.session.user)
        } else {
            return res.status(401).send('Incorrect email/password')
        }
    },
    logout: async (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    }
}