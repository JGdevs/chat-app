import {useState,useEffect} from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import {HelpHttp} from '../helpers/HelpHttp';
import useContacts from '../context/ContactsContext';
import Loader from './Loader';
import CardSearchResult from './CardSearchResult';
import CardMessage from './CardMessage';
import SearchForm from './SearchForm';
import Contact from './Contact';

const SearchResult = () => {

	let {id,username} = JSON.parse(sessionStorage.getItem('user'))

	const [searchResult,setSearchResult] = useState(null),

	[selectedChat,setSelectedChat] = useState(null),

	[search,setSearch] = useState(false), 

	{contacts} = useContacts(),

	{searchValue} = useParams(),

	nav = useNavigate(),

	api = HelpHttp(),

	url = `http://localhost:4000/SearchResult/${id}`,

	handlerSearch = () => {

		if(!search) setSearch(true);

		else setSearch(false);

	},

	filterContact = () => contacts.filter(contact => contact.name.includes(searchValue));

	function renderSearch () {

		if(!selectedChat) {

				if (!searchResult) return <Loader/>

				else if (searchResult.length > 0) return searchResult.map((result,i) => <CardSearchResult result={result} key={i} setSelectedChat={setSelectedChat}/>) 

				else return false 

		}

		else {

			const contact = selectedChat.contactInfo;

			return selectedChat.messages.map((message,i) => <CardMessage key={i} msg={message} contact={contact}/>)

		} 

	}

	function toProfile (contact) {

		sessionStorage.setItem('contact',JSON.stringify(contact));

		nav(`/Profile/${username}/contact/${contact.name}`)

	}

	useEffect(() =>{

		api.get(url).then(res => {

			if(!res.err) setSearchResult(() => {

				const results = res.filter(conversation => {

					conversation.matches = 0;

					contacts.find(contact => {

						if (contact.id === conversation.contact) return conversation.contactInfo = {name:contact.name,image:contact.profileImage,id:contact.id};

					});

					conversation.messages = conversation.messages.filter(msg => {

						if(msg.message.includes(searchValue)) {

							conversation.matches += 1;

							return msg;

						};

					}); 

					if(conversation.matches > 0) return conversation;

				});

				return results;

			});

			else console.log(res.err);

		}) 

	},[searchValue]);

	return (

		<>

			{search && <SearchForm/>}

			<div className="">
				
				{selectedChat && <i className="bi-arrow-left-circle text-white fs-2 mr-lf" onClick={() => setSelectedChat(null)}></i>}

			</div>

			<div className="">
					
				<p className="text-white text-center fs--1">Mensajes</p>

			</div>

			<section>
			
				{renderSearch()}

				<div>
					
					<p className="text-white fs--1 text-center">Contactos</p>

					{filterContact().map(contact => <Contact contact={contact} setSelectContact={toProfile}/>)}
					
				</div>

			</section>

			<input id="search" className="none" type="radio" onClick={handlerSearch}/>

		</>

	)

}

export default SearchResult;