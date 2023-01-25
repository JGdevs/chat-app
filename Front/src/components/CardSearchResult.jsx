import {useNavigate} from 'react-router-dom';
import styles from '../styles/CardSearchResult.module.css';

const CardSearchResult = ({result,setSelectedChat}) => {

	const nav = useNavigate(),

	{username} = JSON.parse(sessionStorage.getItem('user')),

	openConversation = () => {

		sessionStorage.setItem('contact',JSON.stringify(result.contactInfo));

		nav(`/Profile/${username}/Chat/${result.contactInfo.name}`);

	}

	return (

		<section className={`${styles.conversationContainer} text-white`} onClick={(result.matches > 1) ? () => setSelectedChat(result) : openConversation}>

			<div className={`${styles.contactImg} mr-rg`}>
				
				<img src={result.contactInfo.image}/>	

			</div>
			
			<article className={styles.conversationInfo}>
			
				<h3>{result.contactInfo.name}</h3>
					
				<p className="fs--3">{(result.matches > 1 ? `${result.matches} mensajes coincidentes` : result.messages[0].message)}</p>

			</article>

		</section>


	)

}

export default CardSearchResult;