import {createContext,useState,useEffect,useContext} from 'react';
import {HelpHttp} from '../helpers/HelpHttp';

const ContactsContext = createContext(),

useContacts = () => useContext(ContactsContext),

ContactsProvider = ({children}) => {

	const [contacts,setContacts] = useState(null),

	createContact = (id,name,profileImage,info) => setContacts(prevContacts => [...prevContacts,{id,name,profileImage,info}]),

	data = {

		contacts,
		setContacts,
		createContact,

	},

	api = HelpHttp();

	useEffect(() => {

		let {id} = JSON.parse(sessionStorage.getItem('user')),

		url = `http://localhost:4000/contacts/${id}`;

		api.get(url).then(res => {

			if(!res.err) setContacts(res);

			else console.log(res.err);

		});

	},[]);

	return (

		<ContactsContext.Provider value={data}>

			{children}

		</ContactsContext.Provider>

	)

};

export default useContacts;

export {ContactsProvider};