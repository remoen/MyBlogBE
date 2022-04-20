const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000
const fs = require('fs')
let variables = ''
let pagesJson = ''

fs.readFile('resource/variables.json', "utf8", (err,data) => {
    if (err) {
        console.error(err)
        return
    }
    variables = JSON.parse(data)
})

fs.readFile('resource/page.json', "utf8", (err,data) => {
    if (err) {
        console.error(err)
        return
    }
    pagesJson = JSON.parse(data)
})

let corsOption = {
    origin: "http://localhost:8080",
    credentials: true,
}

app.get('/', function(req, res) {
    res.send(variables.lastId.toString());
})

app.get('/page', function (req, res) {
    res.send(JSON.stringify(pagesJson))
})

app.use(express.json());

app.post('/post', cors(), function(req, res, next) {
    const jsonfile = JSON.stringify(req.body)

    res.send("게시되었습니다")

    let post = {
        "id": variables.lastId,
        "title": JSON.parse(jsonfile).title,
        "texts": JSON.parse(jsonfile).texts,
        "pass": JSON.parse(jsonfile).pass,
        "comment": {},
        "recommendation": 0
    }

    fs.writeFileSync('.\\posts\\'+variables.lastId+'.json', JSON.stringify(post))

    if (variables.lastId%20 === 0) {
        variables.page = variables.page + 1
    }

    variables.lastId = variables.lastId + 1
    fs.writeFileSync('resource/variables.json', JSON.stringify(variables))

    pagesJson[variables.lastId.toString()] = {"id": post.id, "title": post.title}

    fs.writeFileSync('resource/page.json', JSON.stringify(pagesJson))
    console.log({"id": post.id, "title": post.title})
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.use(cors(corsOption));
