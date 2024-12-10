// import * as dotenv from 'dotenv';
const dotenv = require('dotenv');
dotenv.config();
var express=require('express');
var cors=require('cors');
var app=express();
var mongodbconnection=process.env.URI;
var mongodbClient=require('mongodb').MongoClient;
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// routes

// user routes

app.get('/',(req,res)=>{
    res.send('<h1>Welcome to Api</h1>');
    res.end();
});

// adding user
app.post('/add-user',(req,res)=>{
    var user={
        UserId:req.body.UserId,
        UserName:req.body.UserName,
        Password:req.body.Password,
        Email:req.body.Email,
        Mobile:req.body.Mobile
    }
    mongodbClient.connect(mongodbconnection).then(clientObj=>{
        var database=clientObj.db('todo-react');
        database.collection('tblusers').insertOne(user).then(()=>{
            res.send('user created');
            res.end();
        })
    })
});

// all users

app.get('/users',(req,res)=>{
    mongodbClient.connect(mongodbconnection).then(clientObj=>{
        var database=clientObj.db('todo-react');
        database.collection('tblusers').find({}).toArray().then(users=>{
            res.send(users);
            res.end();
        })
    })
})

//route for appoinments

// add a appoinment
app.post('/add-appoinment',(req,res)=>{
    var appoinment={
        AppoinmentId:parseInt(req.body.AppoinmentId),
        Title:req.body.Title,
        Description:req.body.Description,
        date:new Date(req.body.date),
        UserId:req.body.UserId
    }
    mongodbClient.connect(mongodbconnection).then(clientObj=>{
        var database=clientObj.db('todo-react');
        database.collection('tblappoinment').insertOne(appoinment).then(()=>{
            res.send('appionment created');
            res.end();
        })
    })
});

// based on userid appoinment
app.get('/appoinment/:userid',(req,res)=>{
    var id=req.params.userid;
    mongodbClient.connect(mongodbconnection).then(clientObj=>{
        var database=clientObj.db('todo-react');
        database.collection('tblappoinment').find({UserId:id}).toArray().then(appoinment=>{
            res.send(appoinment);
            res.end();
        })
    })
});

// based on appoinment id get data

app.get('/appoinment-id/:appoinmentid',(req,res)=>{
    var id=parseInt(req.params.appoinmentid);
    mongodbClient.connect(mongodbconnection).then(clientObj=>{
        var database=clientObj.db('todo-react');
        database.collection('tblappoinment').find({AppoinmentId:id}).toArray().then(appoinment=>{
            res.send(appoinment);
            res.end();
        })
    })
});


// edit appoinment details
app.put('/edit-appoinment/:appoinmentid',(req,res)=>{
    var id=parseInt(req.params.appoinmentid);
    var appoinment={
        AppoinmentId:parseInt(req.body.AppoinmentId),
        Title:req.body.Title,
        Description:req.body.Description,
        date:new Date(req.body.date),
        UserId:req.body.UserId
    }
    mongodbClient.connect(mongodbconnection).then(clientObj=>{
        var database=clientObj.db('todo-react');
        database.collection('tblappoinment').updateOne({AppoinmentId:id},{$set:appoinment}).then(()=>{
            res.send('updated successfully');
            res.end();
        })
    })
})



// delete appoinment using appoinment id
app.delete('/delete-appoinment/:appoinmentid',(req,res)=>{
    var id=parseInt(req.params.appoinmentid);
    mongodbClient.connect(mongodbconnection).then(clientObj=>{
        var database=clientObj.db('todo-react');
        database.collection('tblappoinment').deleteOne({AppoinmentId:id}).then(()=>{
            res.send('deleted appoinment successfully');
            res.end()
        })
    })
})

app.listen(1234);
console.log('server created http://127.0.0.1:1234');
