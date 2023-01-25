import {useLayoutEffect,useRef,useId} from 'react';
import {HelpHttp} from '../helpers/HelpHttp';
import styles from '../styles/Contacts.module.css';

const Contact = ({del,contact,setSelectContact,setBox}) => {

	const api = HelpHttp(),

	id = useId(),

	infoRef = useRef(),

	bio = JSON.parse(sessionStorage.getItem(contact.id)),

	handlerChange = ({target}) => {

		if(target.checked) setBox(prevBox => [...prevBox,contact.id]);

		else setBox(prevBox => prevBox.filter(box => box !== contact.id));

	}

	useLayoutEffect(() => {

		if (bio) infoRef.current.textContent = bio.info;

		else {

			api.get(contact.info).then(res => {

				if(!res.err) {

					infoRef.current.textContent = res.info;

					sessionStorage.setItem(res._id,JSON.stringify(res));

				}

				else console.log(res.err);

			});

		}


	},[bio]);

	return (

		<article className={`${styles.contactContainer} side-padding`} onClick={() => setSelectContact(contact)}>				

		 <div className={styles.contactImg}>

		 	<img src={contact.profileImage}/>

			 <label className={styles.checkboxContainer} htmlFor={id}>
						
					<input className={styles.checkboxInput} id={id} type="checkbox" onChange={handlerChange}/>

					{del && 

						<div className={styles.checkboxCheckbox}>
					
							<i className="bi-check-lg"></i>

						</div>

					}

			</label>

		 </div>

		 <div className={`${styles.conversationInfo} mr-lf`}>
		 
		 		<h3 className="text-white fs--2">{contact.name}</h3>

				<p className="text-gray fs--3" ref={infoRef}></p>
	
		 </div>
		
		</article>

	);

}

export default Contact;