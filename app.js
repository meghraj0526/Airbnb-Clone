const express = require('express');
const app = express();
const mongoose = require('mongoose');

const MONGOO_URL = 'mongodb://127.0.0.1:27017/test';

main().then(() => console.log('Database connected')).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGOO_URL);
}

main().catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});