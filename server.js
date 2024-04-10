const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/slide_navbar_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.post('/signup', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    newUser.save((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error signing up');
        } else {
            res.status(200).send('Signed up successfully');
        }
    });
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email, password: password }, (err, user) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error logging in');
        } else if (!user) {
            res.status(404).send('User not found');
        } else {
            res.status(200).send('Logged in successfully');
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
