import {useState,useEffect} from 'react';
import {Routes,Route,useNavigate,useLocation} from 'react-router-dom';
import Header from './Header';
import Login from './Login';
import DashBoard from './DashBoard';
import Conversations from './Conversations';
import Contacts from './Contacts';
import OpenConversation from './OpenConversation';
import Profile from './Profile';
import SearchResult from './SearchResult';
import MyProfile from './MyProfile';

const ChatApp = () => {

	const [user,setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || null),

	nav = useNavigate(),

	location = useLocation().pathname;

	useEffect(() => {

		if(user) nav(`/Profile/${user.username}/Conversations`);

	},[user]);

	return (

		<>

			<Routes>
			
				<Route path="/" element={<Login origin="Login" onIdSubmit={setUser}/>}/>

				<Route path="/Register" element={<Login origin="Register"/>}/>

				<Route path="/Profile/:user" element={<DashBoard user={user} setUser={setUser}/>}>
					
					<Route path="Conversations" element={<Conversations/>}/>

					<Route path="Contacts" element={<Contacts/>}/>

					<Route path="Search/:searchValue" element={<SearchResult/>}/>

					<Route path="Chat/:user" element={<OpenConversation/>}/>

					<Route path="contact/:user" element={<Profile/>}/>

					<Route path="MyProfile" element={<MyProfile/>}/>

				</Route>

			</Routes>

		</>

	);

}

export default ChatApp; 


