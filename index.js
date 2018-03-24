const mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/edx-course-db');
  
const express = require('express') 
const logger = require('morgan')
const bodyParser = require('body-parser')
const errorhandler = require('errorhandler')

let app = express()
app.use(logger('dev'))
app.use(bodyParser.json())

const accnt = mongoose.model('Account', { name: String,
    name: String,
    balance: Number
  })
  
app.get('/accounts', (req, res, next) => {
    accnt.find({}, null, {sort: {_id: -1}}, (error, accounts) => {
      if (error) return next(error)
      res.send(accounts)
    })
})
  
app.param('id', (req, res, next) => { // OPTIONALLY: you can use middleware to fetch account object
    accnt.findById(req.params.id, (error, account) => {
      req.account = account
      next()
    })
})
  
app.get('/accounts/:id', (req, res, next) => {
    //accnt.findById(req.params.id, (error, account) => {
      //if (error) return next(error)
      res.send(req.account.toJSON())
    })
//})
  
app.post('/accounts', (req, res, next) => {
    let newAccount = new accnt(req.body)
    newAccount.save((error, results) => {
      if (error) return next(error)
      res.send(results)
    })
})
  
app.put('/accounts/:id', (req, res, next) => {
    //accnt.findById(req.params.id, (error, account) => {
      //if (error) return account.name = req.body.name
      if (req.body.balance) req.account.balance = req.body.balance
      req.account.save((error, results) => {
        res.send(results)
      })
    })
//})
  
app.delete('/accounts/:id', (req, res, next) => {
    //accnt.findById(req.params.id, (error, account) => {
      //if (error) return next(error)
      req.account.remove((error, results) => {
        if (error) return next(error)
        res.send(results)
      })
    })
//})
  
  

// run it

app.use(errorhandler())

app.listen(3000)