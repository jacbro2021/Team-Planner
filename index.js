const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
app.use(bodyParser.urlencoded({extended: false }))
app.use(bodyParser.json())
let port = 3000

//Work Computer IPV4 = 10.10.201.111

let config = {
    //configuration settings for CFS server
    server: '10.10.200.214',
    user: 'jbrown',
    password: 'jbrown',
    database: 'learning',
    options: {
        trustServerCertificate: true,
        cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
        }
    }
}

const db = new sqlite3.Database('public/data/mock.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log(err)
    } else {
        //console.log('new database created in mock.db file')
    }
})

//db.run('CREATE TABLE users(fname, lname)')

const sql = 'INSERT INTO users(fname, lname) VALUES(?, ?)'
const del = 'DELETE FROM users'
const qry = 'SELECT fname FROM users'

//db.run(del, (err) => {
//    if (err) {
//        console.log(err)
//    } else {
//        console.log('The table was deleted.')
//    }
//})

//db.run(sql, ['Niels', 'Boor'], (err) => {
//    if (err) {
//        console.log(err)
//    } else {
//        console.log('The data was succesfully inserted into users.')
//    }
//})

db.all(qry, [], (err, rows) => {
    if (err) {
        console.log(err)
    } else {
        rows.forEach((rows) => {
            console.log(rows.fname)
        })
    }
})

let tab = {fname:[]}

db.all(qry, [], (err, rows) => {
    //Init the tab json object with data from db at program runtime.
    if (err) {
        console.log(err)
    } else {
        rows.forEach((rows) => {
            tab.fname.push(rows.fname)
        })
    }
})

app.get('/users', (req, res) => {
    //Sends the tab json object on get request. 
    res.json(tab)
})

app.post('/users', function(req, res) {
    //Appends user input to database and displays on page.
    db.run(sql, [req.body.user, 'lname'])
    tab.fname.push(req.body.user)   
    res.json(tab)
})

app.use(express.static(path.join(__dirname, 'public')))

app.all('*', function(req, res) {
    //sends 404 error if user navigate to non-existent page
    res.status(404).send('<h1>resource not found</h1>')
    //console.log('user recieved 404 error.')
})

console.log("Server listening on port " + port)
app.listen(port)

//db.close((err) => {
//    if (err) {
//        console.log(err)
//    } else {
//        console.log('The database closed succesfully.')
//    }
//})