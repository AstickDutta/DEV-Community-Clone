const express = require("express");
const bodyParser = require("body-parser");
const route = require("./Routes/route.js");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://AstickDutta:0MMV3nbNKa1dnexV@cluster0.ekhharn.mongodb.net/projectDB", {
    useNewUrlParser: true
})


.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});