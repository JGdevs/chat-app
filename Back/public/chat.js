((io,d) => {

	const socket = io();

	d.querySelector('#chat-form').addEventListener('submit',(e) => {

		e.preventDefault();

		socket.emit('new message',d.querySelector('#message-text').value);
	
		d.querySelector('#message-text').value = "";

		return false;			

	});

	socket.on('new user',({message}) => alert(message));

	socket.on('user says',(message) => {

		const msg = d.createElement('LI');

		msg.textContext = message;

		d.querySelector('#chat').appendChild(msg);

	});

	socket.on('goodbye', ({msg}) => alert(msg));

})(io,document);