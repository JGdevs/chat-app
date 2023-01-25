import {useState,useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import useContacts from '../context/ContactsContext';
import CloseSessionModal from './CloseSessionModal';
import UserMenu from './UserMenu';
import styles from '../styles/Header.module.css';

const Header = ({user = false,setUser = false}) => {

	const [modal,setModal] = useState(false),

	menuRef = useRef(),

	nav = useNavigate(),

	{contacts,setContacts} = useContacts(),

	toMyProfile = () => nav(`/Profile/${user.username}/MyProfile`),

	userMenuProps = {

		menuRef,
		handlerMenu,
		updateContactsInfo,
		setModal,
		toMyProfile

	}

	function handlerMenu () {

		menuRef.current.classList.toggle('hidden');
		menuRef.current.classList.toggle('visible');

	}

	function closeSession () {

		sessionStorage.removeItem('user');

		nav('/');

		setModal(false);

		setUser(null);

	}

	function updateContactsInfo () {

		contacts.forEach(contact => sessionStorage.removeItem(contact.id))

		setContacts(prevContacts => [...prevContacts]);

	}

	return (

		<>

			<header className={`${styles.header} body-bg-dark text-white`}>
				
				<h1 className={styles.title}>React chat</h1>

				<div className={styles.menuContainer}>

					{user && <i className={`${styles.icon} bi-three-dots-vertical`} onClick={handlerMenu}></i>}

					<UserMenu {...userMenuProps}/>

				</div>

			</header>

			{modal && <CloseSessionModal closeSession={closeSession} close={setModal}/>}

		</>

	);

}

export default Header;