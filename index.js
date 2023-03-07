if(process.env.NODE_ENV !== 'production') { 
    require('dotenv').config() 
}
const express = require("express");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const app = express();
PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.DATABASE_URI)
mongoose.connection.on('error', error => console.error(error))
mongoose.connection.once('open', () => console.log("Connected to MongoDB"))

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const User = mongoose.model("User", UserSchema)

/*----------------------------------------------------------------------*/
//Uncomment the save function below to regsiter a new user 
//save();

async function save() {
    var new_user = new User ({
        name: "John",
        password: "12345"
    });
    //hash password
    const salt = await bcrypt.genSalt();
    const hashedPwd = await bcrypt.hash(new_user.password, salt);
    new_user.password = hashedPwd
    //save new user
    await new_user.save().then((cb, err) => {
        if(cb) console.log("User created successfully")
        else console.log(err)
    })
}

/*-----------------------------------------------------------------------*/

app.get('/login', (req, res) => {
    res.send("Hello World")
})

app.post('/login', async (req, res) => {

    const newUser = req.body;
    console.log(newUser)
    if (newUser.name && newUser.password) {
        await User.findOne({name: newUser.name})
        .then(user => {
            if(user == null) {
                return res.status(400).send('Can not find user')
            }
            try {
                bcrypt.compare(newUser.password, user.password, (err, result) => {
                    if(result) res.send({message: "Login successful"})
                   else res.json({message: "Wrong username or password"})
                })
            } catch {
                res.status(500).send()
            }
        }) 
        .catch(err => res.send(err))
    } else {
        res.json({message: "Enter username and password"})
    }
})

app.listen(PORT, console.log('Nodejs Server running on PORT', + 3000))
