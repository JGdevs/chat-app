import {createContext,useEffect,useState} from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(),	

SocketProvider = ({user,children}) => {

	const [socket,setSocket] = useState(null),

	data = {

		socket,
		setSocket,

	}

	let {id,username} = user,

	obj = {id,username}

	useEffect(() => {

		const newSocket = io('http://localhost:4000',{query:obj});

		setSocket(newSocket);

		return () => newSocket.close();

	},[]);

	return (

		<SocketContext.Provider value={data}>

			{children}

		</SocketContext.Provider>

	);

}

export default SocketContext;

export {SocketProvider};