import {createContext,useState,useEffect,useContext} from 'react';
import {getContacts} from '../services/contacts.js';

const ContactsContext = createContext(),

useContacts = () => useContext(ContactsContext),

ContactsProvider = ({children}) => {

	const [contacts,setContacts] = useState(null),

	createContact = (id,name,profileImage,info) => setContacts(prevContacts => [...prevContacts,{id,name,profileImage,info}]),

	data = {

		contacts,
		setContacts,
		createContact,

	};

	useEffect(() => {

		let {id} = JSON.parse(sessionStorage.getItem('user'));

		getContacts(id).then(res => {

			if(!res.err) {

				setContacts(res);

			}

			else console.log(res.err);

		})


	},[]);

	return (

		<ContactsContext.Provider value={data}>

			{children}

		</ContactsContext.Provider>

	)

};

export default useContacts;

export {ContactsProvider};