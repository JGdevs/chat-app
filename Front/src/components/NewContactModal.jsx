import {useRef} from 'react';
import useContacts from '../context/ContactsContext';
import {HelpHttp} from '../helpers/HelpHttp';
import styles from '../styles/NewContactModal.module.css';

const NewContactModal = ({close}) => {

	const {id} = JSON.parse(sessionStorage.getItem('user')),

	api = HelpHttp(),

	{createContact} = useContacts();

	let idRef = useRef(),

	nameRef = useRef();

	function handlerSubmit (e) {

		e.preventDefault();

		let url = `http://localhost:4000/newContact/${id}`,

		profileImage = `http://localhost:4000/profileImage/${idRef.current.value}`,

		body = {

			id:idRef.current.value,
			name:nameRef.current.value,
			profileImage,
			info

		},

		options = {

			body,
			headers:{"content-type":"application/json"}

		}

		api.post(url,options).then(res => {

			if(!res.err) {

				createContact(idRef.current.value,nameRef.current.value,profileImage,info);

				close(false);

			}

			else console.log(res.err);

		});

	}

	return (

		<div className={styles.modal}>
			
			<form className={styles.contactForm} onSubmit={handlerSubmit}>

				<div className={styles.titleForm}>
					
					<p className="text-white mr-lf">Create a new contact</p>

					<i className="bi-x text-white" onClick={() => close(false)}></i>

				</div>
				
				<div className={styles.formField}>
					
					<label className="text-white">ID</label>
					<input className={styles.formInput} type="text" placeholder="id del usuario" ref={idRef} minLength="24" maxLength="24" pattern="[a-z0-9]+" required/>

				</div>

				<div className={styles.formField}>
					
					<label className="text-white">Name</label>
					<input className={styles.formInput} type="text" placeholder="nombre de contacto" ref={nameRef} required/>

				</div>

				<input className={`${styles.submit} mr-center`} type="submit" value="Create"/>

			</form>

		</div>

	);

}

export default NewContactModal;