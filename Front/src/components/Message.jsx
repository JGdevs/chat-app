import styles from '../styles/Message.module.css';

const Message = ({msg}) => {

	let {id} = JSON.parse(sessionStorage.getItem('user')),

	style = (msg.emisor === id) ? 'from-me' : 'to-me';

	return (

		<div className={`${styles.msg} ${style}`}>

			<p>{msg.message}</p>

			<small>{msg.sendDate}</small>

		</div>

	);

}

export default Message;