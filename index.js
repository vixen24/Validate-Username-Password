if(process.env.NODE_ENV !== 'production') { 
    require('dotenv').config() 
}
const express = require("express");
const mongoose = require("mongoose")
const app = express();
PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.DATABASE_URI)
mongoose.connection.on('error', error => console.error(error))
mongoose.connection.once('open', () => console.log("Connected to MongoDB"))


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

const router = require("./routes/router")

app.use("/", router)

app.listen(PORT, console.log('Nodejs Server running on PORT', + 3000))
