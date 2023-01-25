'use strict';

const express = require('express'),

mongoose = require('mongoose'),

restFull = require('express-method-override')('_method'),

bodyParser = require('body-parser'),

fs = require('fs'),

port = (process.env.PORT || 4000),

//conectandose con mongo
	
conf = {

	host:'localhost',
	db:'chatbase'

},

Schema = mongoose.Schema,

userSchema = new Schema({

	username:'string',
	password:'string',
	profileImage:'string',
	info:'string',
	contacts:'array',
	conversations:'array'

}),

conn = mongoose.model("users",userSchema);

mongoose.connect(`mongodb:\/\/${conf.host}/${conf.db}`);

//fin conexion mongo

const app = express(),

http = require('http').createServer(app),

io = require('socket.io')(http,{

	cors:'http://localhost:3000'

}),

users = {};

//configurando app

http.listen(port,() => console.log(`Iniciando express en el puerto ${port}`));

// ejecutando middlewares

//parse application/json

//parse application/x-www-form-urlencoded

app.use(bodyParser.json({limit:'50mb'}));

app.use(bodyParser.urlencoded({extended:false,limit:'50mb'}));

app.use(restFull);

app.use((req,res,next) => {

	res.header({'Access-Control-Allow-Origin': '*'});

	res.header({'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'});

	res.header({'Access-Control-Allow-Headers': '*'});

	if(req.method === 'OPTIONS') res.sendStatus(200);
	else next();

});

app.post('/register',(req,res,next) => {

	let user = req.body;

	conn.create(user,(err) => {

		if(err) throw err;

		res.sendStatus(200);

	});

});

app.post('/login',(req,res,next) => {

	let {username,password} = req.body;

	conn.findOne({username,password}).exec((err,user) => {

		if(err) throw err;

		if(!user) {

			let response = {

				err:false,
				user

			}

			res.writeHead(200,{'content-type':'application/json'});

			res.end(JSON.stringify(response));

		}

		else {

			user = {

				id:user._id,
				username:user.username,
				profileImage:user.profileImage,
				info:user.info

			}

			let response = {

				err:false,
				user

			}

			res.writeHead(200,{'content-type':'application/json'});

			res.end(JSON.stringify(response));

		}

	});	

});

app.post('/newContact/:user',(req,res,next) => {

	const {user} = req.params,

	newContact = req.body;

	conn.findOne({_id:req.body.id}).exec((err,doc) => {

		if(err) throw err;

		else if(doc === null) {

			let response = {

				err:true,
				data:null,
				msg:'el id no existe en nuestro registros'

			}

			res.writeHead(200,{'content-type':'application/json'});

			res.end(JSON.stringify(response));

		}

		else conn.findOneAndUpdate({_id:user},{$addToSet:{contacts:newContact}}).exec(err => res.sendStatus(200));

	});

});

app.get('/contacts/:userId',(req,res,next) => {

	let {userId} = req.params;

	conn.findOne({_id:userId},{contacts:1}).exec((err,docs) => {

		if (err) throw err;

		res.writeHead(200,{'content-type':'application/json'});

		res.end(JSON.stringify(docs.contacts));

	});

});

app.get('/conversations/:userId',(req,res,next) => {

	let {userId} = req.params;

	conn.findOne({_id:userId},{conversations:1}).exec((err,docs) => {

		if (err) throw err;

		docs.conversations.forEach(conversation => {

			conversation.lastMessage = conversation.messages[parseInt(conversation.messages.length) - 1];

			delete conversation.messages;

		});

		res.writeHead(200,{'content-type':'application/json'});

		res.end(JSON.stringify(docs.conversations));

	});	

});

app.get('/profileImage/:userId',(req,res,next) => {

	let {userId} = req.params;

	fs.access(`./profileImages/image-${userId}.png`,fs.F_OK,(err) => {

		if (err) {

			fs.readFile(`./profileImages/profile-img.png`,(err,svg) => {

				res.writeHead(200,{'content-type':'application/json'});

				res.end(svg);

			});

		}	

		else {

			fs.readFile(`./profileImages/image-${userId}.png`,(err,img) => {

				res.writeHead(200,{'content-type':'application/json'});

				res.end(img);

			})

		}

	});

});

app.get('/info/:userId',(req,res,next) => {

	let {userId} = req.params;

	conn.findOne({_id:userId},{username:1,info:1}).exec((err,info) => {

		if (err) throw err;

		res.writeHead(200,{'content-type':'application/json'});

		res.end(JSON.stringify(info));

	});

});

app.post('/newConversation/:userId',(req,res,next) => {

	let {userId,num} = req.params,

	contact = req.body.contactId;

	conn.findOneAndUpdate({_id:userId},{$addToSet:{conversations:{contact,messages:[],noReadMessages:num}}}).exec((err,user) => {

		if (err) throw err;

		else res.sendStatus(200);

	});

});

app.post('/newMessage/:userId',(req,res,next) => {

	let {userId} = req.params,

	{emisor,receptor} = req.body;

	conn.findOneAndUpdate({_id:receptor,'conversations.contact':emisor},{$addToSet:{'conversations.$.messages':req.body}}).exec(err => {

		if (err) throw err;

		res.sendStatus(200);

	});

});

app.post('/modifyName/:userId/:newName',(req,res,next) => {

	let {newName,userId} = req.params;

	conn.findOneAndUpdate({_id:userId},{username:newName}).exec((err) => {

		if(err) throw err

		else res.sendStatus(200);

	});
 
})

app.post('/modifyInfo/:userId/:newInfo',(req,res,next) => {

	let {newInfo,userId} = req.params;

	conn.findOneAndUpdate({_id:userId},{info:newInfo}).exec((err) => {

		if(err) throw err;

		else res.sendStatus(200);

	});	

});

app.post('/changeImage/:userId',(req,res,next) => {

	let {userId} = req.params,

	{base64Img,userImage} = req.body,

	newBase64Img = base64Img.replace(/^data:image\/png;base64,/,""),

	buffer = Buffer.from(newBase64Img,'base64');

	fs.writeFile(`profileImages/image-${userId}.png`,buffer,(err,file) => {

		if (err) throw err;

		else if(userImage === '') conn.findOneAndUpdate({_id:userId},{profileImage:`http://localhost:4000/profileImage/${userId}`}).exec(err => {if (err) throw err});

		res.sendStatus(200);

	});

});

app.get('/messages/:userId/:contactId/:range',(req,res,next) => {

	let {userId,contactId,range} = req.params;

	if(range == 0) {

		conn.findOne({_id:userId},{conversations:1}).exec((err,docs) => {

			if (err) throw err;

			else {

				conn.findOneAndUpdate({_id:userId,'conversations.contact':contactId},{'conversations.$.noReadMessages':0}).exec(function (err) {if (err) throw err;})

				let conversation = docs.conversations.find(conversation => conversation.contact == contactId);

				res.writeHead(200,{'content-type':'application/json'});

				res.end(JSON.stringify(conversation.messages));

			}

		});

	}

});

app.get('/SearchResult/:userId',(req,res,next) => {

	let {userId} = req.params;

	conn.findOne({_id:userId},{conversations:1}).exec((err,docs) => {

		res.writeHead(200,{'content-type':'application/json'});

		res.end(JSON.stringify(docs.conversations));

	});

});

app.delete('/deleteConversations/:userId',(req,res,next) => {

	let {userId} = req.params;

	conn.updateMany({_id:userId},{$pull:{conversations:{contact:{$in:req.body}}}},{multi:true}).exec((err) => {

		if (err) throw err;

		res.sendStatus(200);

	});

});

app.delete('/deleteContacts/:userId',(req,res,next) => {

	let {userId} = req.params;

	conn.updateMany({_id:userId},{$pull:{contacts:{id:{$in:req.body}}}},{multi:true}).exec((err) => {

		if (err) throw err;

		conn.updateMany({_id:userId},{$pull:{conversations:{contact:{$in:req.body}}}},{multi:true}).exec((err) =>{

			if (err) throw err;

			res.sendStatus(200);

		});

	});

});

io.on('connection',(socket) => {

	const user = socket.handshake.query;

	socket.join(user.id);

	socket.userId = user.id;

	users[user.id] = user.username;

	socket.on('new-message',(msg) => {

		const {emisor,receptor,message,sendDate} = msg;

		conn.findOneAndUpdate({_id:emisor,'conversations.contact':receptor},{$addToSet:{'conversations.$.messages':msg}}).exec(err => {

			if (err) throw err;

			if(users.hasOwnProperty(receptor)) socket.broadcast.to(receptor).emit('send-message',msg);

			conn.findOne({_id:receptor},{conversations:1,contacts:1}).exec((err,user) => {

				let contact = user.contacts.find(contact => contact.id === emisor);

				if (!contact) return false;

				if(user.conversations.length > 0) {

					let conversation = user.conversations.find(conversation => conversation.contact === emisor);

					if (conversation) {

						conn.findOneAndUpdate({_id:receptor,'conversations.contact':emisor},{$addToSet:{'conversations.$.messages':msg},$inc:{'conversations.$.noReadMessages':1}}).exec(err => {

							if (err) throw err;

						});

					}

					else {

						conn.findOneAndUpdate({_id:receptor},{$addToSet:{conversations:{contact:emisor,messages:[msg],noReadMessages:1}}}).exec((err) => {

							if (err) throw err;

						});

					}

				}

				else {

					conn.findOneAndUpdate({_id:receptor},{$addToSet:{conversations:{contact:emisor,messages:[msg],noReadMessages:1}}}).exec((err) => {

						if (err) throw err;

					});

				}

			});

		});

	});

	socket.on('disconnect',() => {

		delete users[socket.userId];

	});

	socket.on('is-inline',({user,contact}) => {

		if(users.hasOwnProperty(contact)) socket.emit('user-inline');

	});

	socket.on('typing',({emisor,receptor}) => socket.broadcast.to(receptor).emit('is-typing',{emisor}));

	socket.on('stop-typing',({emisor,receptor}) => socket.broadcast.to(receptor).emit('stop-typing',{emisor}));

});

module.exports = app;