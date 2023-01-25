import {useState,useEffect,useContext,useRef} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import {HelpHttp} from '../helpers/HelpHttp';
import useConversations from '../context/ConversationsContext';
import SocketContext from '../context/SocketContext';
import Message from './Message';
import Loader from './Loader';
import styles from '../styles/OpenConversation.module.css';

const OpenConversation = () => {

	let userTyping = false,

	stopTyping;

	const [messages,setMessages] = useState(null),

	{socket} = useContext(SocketContext),

	{conversations,setConversations,sendMessage,addMessage,createConversation} = useConversations(),

	[contact,setContact] = useState(JSON.parse(sessionStorage.getItem('contact'))),

	{id,username} = JSON.parse(sessionStorage.getItem('user')),

	nav = useNavigate(),

	api = HelpHttp(),

	inlineRef = useRef(),

	textRef = useRef(),

	msgConRef = useRef(),

	submitRef = useRef(),

	typingRef = useRef(),

	toProfile = () => nav(`/Profile/${username}/contact/${contact.name}`),

	isTyping = () => {

		if(!userTyping) {

			socket.emit('typing',{emisor:id,receptor:contact.id})

			userTyping = true;

			stopTyping = setTimeout(() => {

				userTyping = false

				socket.emit('stop-typing',{emisor:id,receptor:contact.id})

			},1000);

		}

		else {

			clearTimeout(stopTyping);

			stopTyping = setTimeout(() => {

				userTyping = false

				socket.emit('stop-typing',{emisor:id,receptor:contact.id})

			},1000);

		}

	},

	newMsg = (msg) => {

		if(msg.emisor === contact.id) {

			let url = `http://localhost:4000/newMessage/${msg.receptor}`,

			body = msg;

			const options = {

				body,
				headers:{"content-type":"application/json"}

			}

			api.post(url,options).then(res => {

				if(!res.err) {

					setMessages(prevMessages => [...prevMessages,msg]);

					setConversations(prevConversations => prevConversations.map(conversation => conversation.contact === msg.emisor 

						? {...conversation,lastMessage:msg} 

						: conversation

					));

				} 

				else console.log(res.err);

			});

		}

		else {

			let pos = null;

			const obj = conversations.find((conversation,i) => {

				if(conversation.contact === msg.emisor) {

					pos = i;

					return conversation;

				}  

			});

			if(obj) {

				setConversations(prevConversations => {

					prevConversations[pos].noReadMessages += 1;

					prevConversations[pos].lastMessage = msg;

					return prevConversations;

				}

			)}	

			else createConversation(msg.emisor,msg,1);

			new Notification(`nuevo mensaje: ${msg.emisorName}`,{

				body:msg.message,
				icon:require('../logo192.png')


			});

		}

		console.log(msg)

	} 

	function handlerSubmit (e) {

		e.preventDefault();

		let msg = sendMessage(id,contact.id,textRef.current.value,username);

		textRef.current.value = '';

		if(messages.length == 0) createConversation(contact.id,msg,0); 

		else setConversations(prevConversations => prevConversations.map(conversation => conversation.contact === contact.id 

			? {...conversation,lastMessage:msg} 

			: conversation

		));

		setMessages(prevMessages => [...prevMessages,msg]);

	}

	function handlerChange (e) {

		if(e.target.value === '') submitRef.current.classList.add(`${styles.btnDisabled}`)

		else submitRef.current.classList.remove(`${styles.btnDisabled}`)

	}

	useEffect(() => {

		let range = 0;

		let url = `http://localhost:4000/messages/${id}/${contact.id}/${range}`;

		api.get(url).then(res => {

			if(!res.err) {

				setConversations(prevConversations => {

					prevConversations.find((conversation,i) => {

						if(conversation.contact === contact.id) prevConversations[i].noReadMessages = 0;

					});

					return prevConversations;

				});

				setMessages(res);

			}

			else console.log(res.err);

		});

	},[]);

	useEffect(() => {

		if(socket) {

			socket.removeAllListeners('send-message');

			socket.on('send-message',newMsg);

			socket.on('user-inline',() => inlineRef.current.classList.remove('none'));

			socket.on('is-typing',({emisor}) => typingRef.current.classList.remove('none'));

			socket.on('stop-typing',({emisor}) => typingRef.current.classList.add('none'));

			socket.emit('is-inline',{

				user:id,
				contact:contact.id

			});

		}

		return () => {

			socket.removeAllListeners('send-message');

			socket.on('send-message',addMessage);

		};

	},[socket]);

	useEffect(() => {

		if (!msgConRef.current.lastElementChild) return;

		msgConRef.current.lastElementChild.scrollIntoView({smooth:true});

	},[messages]);

	return (

		<>

			<header className={styles.chatHeader} onClick={toProfile}>

				<div className={styles.contactImgSmall}>

					<img src={contact.profileImage}/>

					<div ref={inlineRef} className="inline none"></div>

				</div>

				<div>
					
					<h3 className="text-white">{contact.name}</h3>

					<p className={`${styles.userTyping} fs--3 none`} ref={typingRef}>Escribiendo...</p>

				</div>

			</header>

			<section className={styles.chat}>

				<div className={styles.messages} ref={msgConRef}>
					
					{

						(messages) ? messages.map((msg,i) => <Message msg={msg} key={i}/>) : <Loader/> 

					}

				</div>
				
				<form className={styles.formMessage} onSubmit={handlerSubmit}>
					
					<input className={styles.writeArea} type="text" ref={textRef} onChange={handlerChange} onKeyUp={isTyping}/>
				
					<input className="none" id="input-submit" type="submit"/>
						
					<label className={`${styles.btnSendMessage} ${styles.btnDisabled}`} ref={submitRef} htmlFor="input-submit"><i className="text-white bi-send-fill"></i></label>	

				</form>

			</section>

		</>

	);

}

export default OpenConversation;