import {createContext,useContext,useState,useEffect} from 'react';
import SocketContext from '../context/SocketContext';
import {HelpHttp} from '../helpers/HelpHttp';

const ConversationsContext = createContext(),

useConversations = () => useContext(ConversationsContext),

ConversationsProvider = ({children}) => {

	const [conversations,setConversations] = useState(null),

	{socket} = useContext(SocketContext),

	api = HelpHttp(),

	createConversation = (contact,msg,num) => setConversations(prevConversations => [...prevConversations,{contact,lastMessage:msg,noReadMessages:num}]),

	addMessage = (msg) => {

		let newConversation = null;

		setConversations(prevConversations => {

			const newConversations = prevConversations.filter((conversation,i) => {

				if(conversation.contact === msg.emisor) {

					newConversation = {...conversation,noReadMessages:conversation.noReadMessages + 1,lastMessage:msg}

					return false;

				}

				else return true;

			});

			if(newConversation) {

				newConversations.unshift(newConversation);

				return newConversations;

			}

			else {

				newConversations.unshift({contact:msg.emisor,messages:[msg],noReadMessages:1,lastMessage:msg})

				return newConversations;

			}

		});

		new Notification(msg.emisorName,{

			body:msg.message,
			icon:require('../logo192.png')

		});

	},

	sendMessage = (userId,contactId,textMessage,emisorName) => {

		let date = new Intl.DateTimeFormat('es-ES',{

			dateStyle:'short',
			timeStyle:'short'

		}).format(new Date());

		const msg = {

			emisor:userId,
			receptor:contactId,
			message:textMessage,
			sendDate:date,
			sortDate:Date.now(),
			emisorName

		}

		socket.emit('new-message',msg);

		return msg;

	},

	sortConversations = (arr) => {

		if (arr.length <= 1) return arr;

		let nombres = [],

		arrSort = [];	

		for(let i = 0; i < arr.length; i++) if (arr[i].lastMessage) nombres.push(arr[i].lastMessage.sortDate);

		nombres.sort();

		let long = nombres.length;

		while(arrSort.length < long) {

			for(let i = 0;; i++) {

				if(nombres[0] == arr[i].lastMessage.sortDate) {

					arrSort.push(arr[i]);

					nombres.shift();

					arr.splice(i,1);	

					break;

				}		

			}

		}

		arrSort.reverse()

		return arrSort;

	},

	/*openConversation = () => {

		sessionStorage.setItem('contact',JSON.stringify(contact));

		nav(`/Profile/${username}/Chat/${contact.name}`);

	},*/

	data = {

		conversations,
		setConversations,
		createConversation,
		sendMessage,
		addMessage

	}

	useEffect(() => {

		let {id} = JSON.parse(sessionStorage.getItem('user')),

		url = `http://localhost:4000/conversations/${id}`;

		api.get(url).then(res => {

			if(!res.err) {

				const arr = sortConversations(res);

				setConversations(arr);

			}

			else console.log(res.err);

		});

	},[]);

	useEffect(() => {

		if(!socket) return;

		socket.on('send-message',addMessage)

		return () => socket.off('send-message');

	},[socket]);

	return (

		<ConversationsContext.Provider value={data}>

			{children}

		</ConversationsContext.Provider>

	)

};

export default useConversations;

export {ConversationsProvider};