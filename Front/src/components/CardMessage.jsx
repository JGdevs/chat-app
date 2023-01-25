import styles from '../styles/CardMessage.module.css';

const CardMessage = ({msg,contact}) => {

	const user = JSON.parse(sessionStorage.getItem('user')),

	image = (msg.emisor === user.id) ? user.profileImage : contact.image,

	name = (msg.emisor === user.id) ? user.username : contact.name;

	return (

		<section className={`${styles.conversationContainer} text-white`}>

			<div className={`${styles.contactImg} mr-rg`}>
				
				<img src={image}/>	

			</div>
			
			<article className={styles.conversationInfo}>
			
				<h3>{name}</h3>
					
				<p className="fs--3">{msg.message}</p>

			</article>

		</section>

	)

}

export default CardMessage;