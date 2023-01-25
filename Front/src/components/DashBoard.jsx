import {useEffect} from 'react';
import {Outlet,useNavigate,useLocation} from 'react-router-dom';
import {ContactsProvider} from '../context/ContactsContext';
import {ConversationsProvider} from '../context/ConversationsContext';
import {SocketProvider} from '../context/SocketContext';
import Header from './Header';
import NavTabs from './NavTabs';

const DashBoard = ({user,setUser}) => {

	const nav = useNavigate(),

	location = useLocation().pathname,

	header = (location.includes('Chat') || location.includes('contact') || location.includes('MyProfile')) ? false : true,

	menu = (location.includes('Conversations') || location.includes('Contacts')) ? true : false,

	menuTabs = location.split('/')[3];

	useEffect(() => {

		if(!user) nav('/');

		Notification.requestPermission();

	},[user]);

	return (

		<main>

			<SocketProvider user={user}>

				<ContactsProvider>

					<ConversationsProvider>

						{header && <Header user={user} setUser={setUser}/>}

						{menu && <NavTabs tab={menuTabs}/>}

						<Outlet/>		

					</ConversationsProvider>

				</ContactsProvider>

			</SocketProvider>

		</main>

	);

}

export default DashBoard;