import {useState,useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import useContacts from '../context/ContactsContext';
import useConversations from '../context/ConversationsContext';
import Contact from './Contact';
import {HelpHttp} from '../helpers/HelpHttp';
import styles from '../styles/NewConversationModal.module.css';

const NewConversationModal = ({close}) => {

	const [selectContact,setSelectContact] = useState(null),

	{id,username} = JSON.parse(sessionStorage.getItem('user')),

	api = HelpHttp(),

	nav = useNavigate(),

	{contacts} = useContacts(),

	{createConversation,conversations} = useConversations();

	function handlerClick () {

		let conversation = (conversations.length > 0 ) ? conversations.find(conversation => conversation.contact === selectContact.id) 

		: false;
 
		if(conversation) {

			sessionStorage.setItem('contact',JSON.stringify(selectContact));

			nav(`/Profile/${username}/Chat/${selectContact.name}`);

		}

		else {

			let url = `http://localhost:4000/newConversation/${id}`,

			body = {contactId:selectContact.id}

			const options = {

				body,
				headers:{"content-type":"application/json"}

			}

			api.post(url,options).then(res => {

				if(!res.err) {

					sessionStorage.setItem('contact',JSON.stringify(selectContact));

					nav(`/Profile/${username}/Chat/${selectContact.name}`);

					close(false);

				}

				else console.log(res.err);

			});

		}

	}

	return (

		<div className={styles.modal}>
			
			<section className={styles.newConversations}>

				<div className={`${styles.titleForm} side-padding`}>
					
					<p className="text-white mr-lf">New conversation with: {selectContact && selectContact.name}</p>

					<i className="bi-x text-white" onClick={() => close(false)}></i>

				</div>
				
				<div className={styles.cardsContainer}>
					
					{

						(contacts.length > 0) ? contacts.map((contact,i) => <Contact key={i} contact={contact} setSelectContact={setSelectContact}/>) 

						: <h3 className="text-white text-center padding-tb">no tienes contactos para iniciar una conversacion</h3>

					}

				</div>

				<div className={styles.buttonContainer}>
					
					<button className={`${styles.submit} mr-center block`} onClick={handlerClick}>Start conversation</button>

				</div>

			</section>

		</div>

	);

}

export default NewConversationModal;