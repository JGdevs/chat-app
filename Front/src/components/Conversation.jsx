import {useRef,useId} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from '../styles/Conversations.module.css';

const Conversation = ({del,contact,setBox,conversation}) => {

	const nav = useNavigate(),

	id = useId(),

	lastMessageRef = useRef(),

	{username} = JSON.parse(sessionStorage.getItem('user')),

	openConversation = () => {

		if (del) return false;

		sessionStorage.setItem('contact',JSON.stringify(contact));

		nav(`/Profile/${username}/Chat/${contact.name}`);

	},

	handlerChange = ({target}) => {

		if(target.checked) setBox(prevBox => [...prevBox,contact.id]);

		else setBox(prevBox => prevBox.filter(box => box !== contact.id));

	},

	getDate = () => {

		if(!conversation.lastMessage) return false;

		let date = new Intl.DateTimeFormat('es-ES',{

			day:'numeric'

		}).format(new Date()),

		{sendDate} = conversation.lastMessage,

		msgDate = sendDate.slice(0,sendDate.indexOf('/'));

		if (msgDate === date) return sendDate.slice(sendDate.indexOf(',') + 1);

		else if (msgDate < date) return 'ayer';

		else return sendDate.slice(0,sendDate.indexOf(','));

	}

	//sliceLastMessage = () => if(conversation.lastMessage.length > '180' ? conversation.lastMessage.message.slice() : conversation.lastMessage.message);

	return (

		<article className={`${styles.conversationContainer} side-padding`} onClick={openConversation}>

				<div className={`${styles.contactImg} mr-rg`}>

					<img src={contact.profileImage}/>

					<label className={styles.checkboxContainer} htmlFor={id}>
						
						<input className={styles.checkboxInput} type="checkbox" id={id} onChange={handlerChange}/>

						{del && 

							<div className={styles.checkboxCheckbox}>
								
								<i className="bi-check-lg"></i>

							</div>

						}

					</label>

				</div>

				<div className={styles.conversationInfo}>
					
					<div className={styles.headerConversation}>
						
						<h3 className="text-white fs--2">{contact.name}</h3>

						<span className="text-white fs--2 mr-rg">{getDate()}</span>

					</div>

					<div className={styles.footerConversation}>
						
						{(conversation.lastMessage) && <p ref={lastMessageRef} className="text-gray fs--3 last-message">{conversation.lastMessage.message}</p>}

						{(conversation.noReadMessages > 0) && <span className="count-messages mr-rg mr-tp"><b>{conversation.noReadMessages}</b></span>}

					</div>

				</div>

		</article>

	);

}

export default Conversation;
