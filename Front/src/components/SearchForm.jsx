import {useState,useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from '../styles/SearchForm.module.css';

const SearchForm = () => {

	const nav = useNavigate(),

	searchRef = useRef(),

	{username} = JSON.parse(sessionStorage.getItem('user')),

	handlerSubmit = (e) => {

		e.preventDefault();

		if (searchRef.current.value === '') return false;

		else nav(`/Profile/${username}/Search/${searchRef.current.value}`);
	}
	
	return (

		<form className={`mr-center ${styles.searchForm}`} onClick={handlerSubmit}>
			
			<input className={styles.text} type="text" ref={searchRef}/>
			<button className={styles.btn}><i className={`bi-search text-white ${styles.i}`}></i></button>

		</form>

	)

}

export default SearchForm;