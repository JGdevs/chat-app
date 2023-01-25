import {NavLink} from 'react-router-dom';
import styles from '../styles/tabs.module.css';

const NavTabs = ({tab}) => {

	return (

		<nav className={styles.tabs}>
	 
			<NavLink className={`${styles.link} ${styles.conversations}`} id="conversations" to="Conversations">Conversations</NavLink>

			<NavLink className={`${styles.link} ${styles.contacts}`} id="contacts" to="Contacts">Contacts</NavLink>

			<div className={styles.bar}></div>

		</nav>

	)

}

export default NavTabs;