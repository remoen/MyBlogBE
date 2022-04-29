const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000
const fs = require('fs')
let variables = ''
let pagesJson = ''

fs.readFile('resource/variables.json', "utf8", (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    variables = JSON.parse(data)
})

fs.readFile('resource/page.json', "utf8", (err, data) => {
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

app.get('/', function (req, res) {
    res.send(variables.lastId.toString());
})

app.get('/page/*', cors(), function (req, res) {
    let num = req.path.split('/')[2]
    let pageArray = []
    for (let key in pagesJson) {
        if (num.toString() === pagesJson[key].page.toString()) {
            pageArray.push(pagesJson[key])
        }
    }

    let pageObject = JSON.parse(JSON.stringify(pageArray))

    res.send(pageObject)
})

app.get('/maxPage', cors(), function (req, res) {
    res.send(variables.page.toString());
})

app.get('/post/*', cors(), function (req, res) {
    let num = req.path.split('/')[2]
    let post = ''

    fs.readFile('.\\posts\\' + num.toString() + '.json', "utf8", (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        post = JSON.parse(data)
        res.send(post)
    })
})

app.use(express.json());

app.post('/post', cors(), function (req, res, next) {
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

    fs.writeFileSync('.\\posts\\' + variables.lastId + '.json', JSON.stringify(post))

    if (variables.lastId % 20 === 0) {
        variables.page = variables.page + 1
    }

    variables.lastId = variables.lastId + 1
    fs.writeFileSync('resource/variables.json', JSON.stringify(variables))

    pagesJson[variables.lastId.toString()] = {"id": post.id, "title": post.title, "page": variables.page}

    fs.writeFileSync('resource/page.json', JSON.stringify(pagesJson))
    console.log({"id": post.id, "title": post.title})
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

app.use(cors(corsOption));
