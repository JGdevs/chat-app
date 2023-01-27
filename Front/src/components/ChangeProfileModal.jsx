import {useRef} from 'react';
import styles from '../styles/ChangeProfileModal.module.css';
import {changeNameProfile,changeInfoProfile} from '../services/profile.js';

const ChangeProfileModal = ({origin,currentValue,close}) => {

	const inputRef = useRef(),

	user = JSON.parse(sessionStorage.getItem('user')),

	handlerSubmit = () => {

		if(origin === 'nombre') changeName();

		else changeInfo();

	},

	changeName = () => {

		changeNameProfile(user.id,inputRef.current.value).then((res) => {

			if(!res.err) {

				user.username = inputRef.current.value;

				sessionStorage.setItem('user',JSON.stringify(user));

				close(false);
				
			}

			else console.log(res.err);

		})

	},

	changeInfo = () => {

		changeInfoProfile(user.id,inputRef.current.value).then(res => {

			if(!res.err) {

				user.info = inputRef.current.value;

				sessionStorage.setItem('user',JSON.stringify(user));

				close(false);

			}

			else console.log(res.err)

		})
		
	}

	return (

		<div className={styles.modal}>
			
			<form className={styles.form} onSubmit={handlerSubmit}>

				<div className={styles.titleForm}>
					
					<p className="text-white mr-lf">{`Escribe tu ${origin}`}</p>

					<i className="bi-x text-white fs-1" onClick={() => close(false)}></i>

				</div>
				
				<div className={styles.formField}>
					
					<label className="text-white">{origin}</label>
					<input className={styles.formInput} type="text" ref={inputRef} maxLength="30" defaultValue={currentValue} required/>

				</div>

				<input className={`${styles.submit} mr-center`} type="submit" value="Change"/>

			</form>

		</div>

	)

}

export default ChangeProfileModal;