import styles from '../styles/DeleteCounter.module.css';

const DeleteCounter = ({box,handlerClick}) => {

	return (

		<div className={styles.selectAll}>

			<span className="text-white text-center">has seleccionado {box}</span>

			<button className={`${styles.selectAllBtn} text-white`} data-state="none" onClick={handlerClick}>Seleccionar Todos</button>

		</div>	

	)

}

export default DeleteCounter;