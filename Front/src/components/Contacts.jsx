import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {HelpHttp} from '../helpers/HelpHttp';
import useContacts from '../context/ContactsContext';
import useConversations from '../context/ConversationsContext';
import NewContactModal from './NewContactModal';
import Contact from './Contact';
import DeleteCounter from './DeleteCounter';
import SearchForm from './SearchForm';
import styles from '../styles/Contacts.module.css';

const Contacts = () => {

	const {id} = JSON.parse(sessionStorage.getItem('user')),

	[modal,setModal] = useState(false),

	[box,setBox] = useState([]),

	[search,setSearch] = useState(false),

	[del,setDel] = useState(false),

	nav = useNavigate(),

	api = HelpHttp(),

	{contacts,setContacts} = useContacts(),

	{conversations,setConversations} = useConversations(),

	{username} = JSON.parse(sessionStorage.getItem('user')),

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

			let confirm = window.confirm('si borras este contacto tambien se eliminaran los mensajes asociados con el');

			if (!confirm) return false;

			let url = `http://localhost:4000/deleteContacts/${id}`,

			options = {

				body:box,
				headers:{"content-type":"application/json"}

			}

			if(box.length == 0) return false;

			else {
		
				api.del(url,options).then(res => {
			
					if(!res.err) {
			
						setContacts(prevContacts => {

							let arr = [];

							box.forEach((el,i) => {

								if(i == 0) arr = prevContacts.filter(contact => contact.id !== el);

								else arr = arr.filter(contact => contact.id !== el);

							});

							return arr;

						});

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

			let arr = contacts.map(contact => contact.id);

			setBox(arr);

		}

		else {

			target.dataset.state = 'none';

			Array.from(document.querySelectorAll('input[type="checkbox"]')).forEach(input => input.checked = false);

			setBox([]);

		}

	}

	function toProfile (contact) {

		if(del) return;

		sessionStorage.setItem('contact',JSON.stringify(contact));

		nav(`/Profile/${username}/contact/${contact.name}`)

	}

	return (

		<>

		{search && <SearchForm/>}

		{del && <DeleteCounter box={box.length} handlerClick={selectAll}/>}

		<section className={`${styles.container} contacts`}>
			
			{(contacts && contacts.length > 0) 

			? contacts.map((contact,i) => <Contact key={i} del={del} contact={contact} setSelectContact={toProfile} setBox={setBox}/>) 

			: <div className="text-center mr-tp-l">
				
					<h2 className="text-white">No tienes ningun contacto todavia</h2>

					<i className="text-white bi-people-fill fs-5"></i>

				</div>

			}

		</section>

		{modal && <NewContactModal close={setModal}/>}

		<input className="none" id="admin" type="radio" onClick={handlerClick}/>

		<div className={styles.newIcons} onClick={handlerIcon}>

			<i className={(del) ? 'bi-trash3-fill' :'bi-person-plus-fill'}></i>

		</div>

		<input id="search" className="none" type="radio" onClick={handlerSearch}/>

		</>

	);

}

export default Contacts;