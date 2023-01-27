import styles from '../styles/Profile.module.css'; 
import {useState,useEffect} from 'react';
import {getContactInfo} from '../services/contacts.js';

const Profile = () => {

	const contact = JSON.parse(sessionStorage.getItem('contact')),

	[contactInfo,setContactInfo] = useState([]);

	useEffect(() => {

		getContactInfo(contact.id).then(res => {

			if(!res.err) {

				setContactInfo(res);

			}

			else console.log(res.err);

		})

	},[contact.info]);

	return (

		<>

			<section className={styles.profileContactContainer}>
				
				<div className={`${styles.profileImgContainer} mr-center w-fit`}>
					
					{

						(contact.profileImage === "") 

						? <i className="bi-person-circle text-white"></i> 

						: <div className={styles.profileImg}><img src={contact.profileImage}/></div>

					}

				</div>

				<h3 className="text-white w-fit mr-center">{contact.name}</h3>

				<div className="w-fit mr-center">
					
					<p className="text-white text-center">id del contacto:</p>
					<p className="text-white text-center">{contact.id}</p>

				</div>

				<div className={`${styles.options} mr-center`}>

					<div className={styles.optionIcon}>
							
						<i className="bi-chat-text text-white"></i>
						<span className="text-white">Mensaje</span>

					</div>

					<div className={styles.optionIcon}>

						<i className="bi-camera-video-fill text-white"></i>
						<span className="text-white">Video</span>

					</div>

				</div>

			</section>

			<section className={styles.profileContactBio}>

				<i className="bi-exclamation-circle fs-3"></i>
				
				<p className="text-white fs--2">{contactInfo.info}</p>

			</section>

			<section className={styles.createGroupContainer}>
				
				<div className={`mr-lf-2 ${styles.createGroupIcon} text-center`}>
					
					<i className="text-white bi-people-fill fs-1"></i>

				</div>

				<p className="text-white mr-lf fs--2">Crear grupo con {contact.name}</p>

			</section>

		</>	

	)

}

export default Profile;