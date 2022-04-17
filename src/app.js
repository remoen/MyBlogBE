const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000

let corsOption = {
    origin: "http://localhost:8080",
    credentials: true,
}

app.get('/', function(req, res) {
    res.send("test1");
})

app.use(express.json());

app.post('/post', cors(), function(req, res, next) {
    console.log(req.body)
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.use(cors(corsOption));
