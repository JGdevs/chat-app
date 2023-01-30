import {useState} from 'react';
import useContacts from '../context/ContactsContext';
import useConversations from '../context/ConversationsContext';
import Conversation from './Conversation';
import NewConversationModal from './NewConversationModal';
import Loader from './Loader';
import DeleteCounter from './DeleteCounter';
import SearchForm from './SearchForm';
import {deleteConversations} from '../services/conversations.js';
import styles from '../styles/Conversations.module.css';

const Conversations = () => {

	const [modal,setModal] = useState(false),

	[box,setBox] = useState([]),

	[del,setDel] = useState(false),

	[search,setSearch] = useState(false),

	{id} = JSON.parse(sessionStorage.getItem('user')),

	{conversations,setConversations,sortConversations} = useConversations(),

	{contacts} = useContacts(),

	handlerClick = () => {

		if(!del) setDel(true)

		else setDel(false); 

	},

	handlerSearch = () => {

		if(!search) setSearch(true);

		else setSearch(false);

	},

	handlerIcon = () => {

		if(del) {

		 let options = {

				body:box,
				headers:{"content-type":"application/json"}

			}

			if(box.length == 0) return false;

			else {
		
				deleteConversations(url,options).then(res => {
			
					if(!res.err) {
			
						setConversations(prevConversations => {

							let arr = [];

							box.forEach((el,i) => {

								if(i == 0) arr = prevConversations.filter(conversation => conversation.contact !== el);

								else arr = arr.filter(conversation => conversation.contact !== el);

							});

							return arr;

						});
			
					}

					else console.log(res.err);

				});

				setDel(false);

			}

		}

		else setModal(true);

	},

	selectAll = ({target}) => {

		if(target.dataset.state === 'none') {

			target.dataset.state = 'all';

			Array.from(document.querySelectorAll('input[type="checkbox"]')).forEach(input => input.checked = true);

			let arr = conversations.map(conversation => conversation.contact);

			setBox(arr);

		}

		else {

			target.dataset.state = 'none';

			Array.from(document.querySelectorAll('input[type="checkbox"]')).forEach(input => input.checked = false);

			setBox([]);

		}

	}

	return (

		<>

			{search && <SearchForm/>}

			{del && <DeleteCounter box={box.length} handlerClick={selectAll}/>}

			<section className={`${styles.container} conversations`}>
				
				{

					(conversations && contacts) 

					? (conversations.length > 0 && contacts.length > 0) 

					? (
							conversations.map((conversation,i) => {

								let card = contacts.find(contact => contact.id === conversation.contact);

								return <Conversation del={del} key={i} contact={card} setBox={setBox} conversation={conversation}/>

							})

						)


					: <div className="text-center mr-tp-l">
						
							<h2 className="text-white">No hay Conversaciones</h2>

							<i className="text-white bi-envelope-open-fill fs-5"></i>

						</div>
					
					: <Loader/>
 
				

				}

			</section>

			{modal && <NewConversationModal close={setModal}/>}

			<div className={styles.newIcons} onClick={handlerIcon}>

				<i className={(del) ? 'bi-trash3-fill' : 'bi-chat-left-text-fill'}></i>

			</div>

			<input id="search" className="none" type="radio" onClick={handlerSearch}/>

			<input id="admin" className="none" type="radio" onClick={handlerClick}/>

		</>

	);

}

export default Conversations;




