const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
app.use(bodyParser.urlencoded({extended: false }))
app.use(bodyParser.json())
let port = 3000

//Work Computer IPV4 = 10.10.201.111 (DHCP)

//let config = {
//    //configuration settings for CFS server
//    server: '10.10.200.214',
//    user: 'jbrown',
//    password: 'jbrown',
//    database: 'learning',
//    options: {
//        trustServerCertificate: true,
//        cryptoCredentialsDetails: {
//            minVersion: 'TLSv1'
//        }
//    }
//}

const db = new sqlite3.Database('public/data/mock.db', sqlite3.OPEN_READWRITE, (err) => {
    //opens database
    if (err) {
        console.log(err)
    } else {
        //console.log('new database created in mock.db file')
    }
})

//db.run('CREATE TABLE users(fname, pass, job)')

//shortcuts for frequented queries
const insert = 'INSERT INTO users(fname, pass, job) VALUES(?, ?, ?)'
const clear = 'DELETE FROM users'
const qry = 'SELECT fname, pass, job FROM users'
const del = 'DROP TABLE users'

//db.run(del, (err) => {
//    if (err) {
//        console.log(err)
//    } else {
//        console.log('TABLE DELETED')
//    }
//})

//db.run(clear, (err) => {
//    if (err) {
//        console.log(err)
//    } else {
//        console.log('The table was cleared.')
//    }
//})

//db.run(insert, ['Barrack', 'HopeChange','Pass the affordable care act'], (err) => {
//    if (err) {
//        console.log(err)
//    } else {
//        console.log('The data was succesfully inserted into users.')
//    }
//})

//db.all(qry, [], (err, columns) => {
//    if (err) {
//        console.log(err)
//    } else {
//        columns.forEach((columns) => {
//            console.log(columns.fname)
//            console.log(columns.pass)
//            console.log(columns.job)
//        })
//    }
//})

let tab = {
    fname:[],
    pass:[],
    job:[]
}

db.all(qry, [], (err, columns) => {
    //Init the tab json object 'tab' with data from db at program runtime.
    if (err) {
        console.log(err)
    } else {
        columns.forEach((columns) => {
            tab.fname.push(columns.fname)
            tab.pass.push(columns.pass)
            tab.job.push(columns.job)
        })
    }
})

app.get('/users', (req, res) => {
    //Sends the tab json object on get request. 
    res.json(tab)
})

app.post('/users', function(req, res) {
    //Appends user input to database and displays on page.
    db.run(insert, [req.body.user, req.body.pass, req.body.job])
    tab.fname.push(req.body.user)
    tab.pass.push(req.body.pass) 
    tab.job.push(req.body.job)  
    res.json(tab)
})

//didrects app to the public directory to find resources
app.use(express.static(path.join(__dirname, 'public')))

app.all('*', function(req, res) {
    //sends 404 error if user navigate to non-existent page
    res.status(404).send('<h1>resource not found</h1>')
    //console.log('user recieved 404 error.')
})

//serves the server on the local host at the port specified at top of this file
console.log("Server listening on port " + port)
app.listen(port)

//db.close((err) => {
//    if (err) {
//        console.log(err)
//    } else {
//        console.log('The database closed succesfully.')
//    }
//})