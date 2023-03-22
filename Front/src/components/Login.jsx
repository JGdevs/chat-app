import {useState,useRef} from 'react';
import {NavLink,useNavigate} from 'react-router-dom';
import {userRegister,userLogin} from '../services/user.js';
import Header from './Header';
import styles from '../styles/login.module.css';

const Login = ({onIdSubmit,origin,login}) => {

	const [error,setError] = useState(null),

	idRef = useRef(),

	passRef = useRef(),

	errorRef = useRef(),

	nav = useNavigate();

	function handlerSubmit (e) {

		e.preventDefault();

		if(origin === 'Login') {

			let body = {

				username:idRef.current.value,
				password:passRef.current.value,

			},

			options = {

				body,
				headers:{"content-type":"application/json"}

			};

			userLogin(options).then(res => {

				if(!res.err) {

					sessionStorage.setItem('user',JSON.stringify(res.user));

					onIdSubmit(res);

				}

				else {

					errorRef.current.textContent = res.message;
					errorRef.current.classList.remove('none');
					setTimeout(() => {

						errorRef.current.classList.add('none');

					},5000)

				}

			});

		}

		else {

			let body = {

				username:idRef.current.value,
				password:passRef.current.value,
				profileImage:''

			},

			options = {

				body,
				headers:{"content-type":"application/json"}

			};

			userRegister(options).then(res => {

				if(!res.err) {

					window.alert('te has registrado exitosamente :D');

					nav('/');

				}

				else window.alert('lo sentimos ocurrio un error: ' + res.err);

			});
			
		}

	}

	return (

		<>

			<header className="text-white header">
				
				<h1>React Chat</h1>

			</header>

				<section className={styles.container}>
		
					<form className={styles.form} onSubmit={handlerSubmit}>

						<div className={styles.inputContainer}>
							
							<div className={styles.field}>
								
								<input className={styles.input} type="text" ref={idRef} placeholder="enter your username" required/>
								<label className="text-white">Username</label>

							</div>

							<div className={styles.field}>
								
								<input className={styles.input} type="password" ref={passRef} placeholder="enter your password" required/>	
								<label className="text-white">Password</label>

							</div>

							<button className={styles.submit} type="submit">{origin}</button>

							{

								origin === 'Login' && <p className="text-white text-center">No tienes cuenta? registrate<NavLink className="mr-lf text-main-color" to="/Register">Aqui</NavLink></p>

							}

							<p className="text-white none" ref={errorRef}></p>

						</div>
						
					</form>	

				</section>

		</>

	)

}

export default Login;