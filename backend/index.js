const express = require('express');
const PORT = 4000;
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGOBD_URL } = require('./config')
const path = require('path');

global.__basedir = __dirname;
mongoose.connect(MONGOBD_URL);

mongoose.connection.on('connected', () => {
    console.log("DB connected");
})
mongoose.connection.on('error', (error) => {
    console.log("Some error while connecting to DB");
})

require('./models/user_model');
require('./models/tweet_model');

app.use(cors());
app.use(express.json());
app.use("/images",express.static(path.join(__dirname,"images")))

app.use(require('./routes/auth_route'));
app.use(require('./routes/user_route'));
app.use(require('./routes/tweet_route'));

app.listen(PORT, () => {
    console.log("Server started");
});