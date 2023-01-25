import styles from '../styles/CloseSessionModal.module.css';

const CloseSessionModal = ({close,closeSession}) => {

	return (

		<div className={styles.modal}>
			
			<section className={styles.closeContainer}>
					
				<p className="text-white w-fit">Are you sure want close session</p>

				<div className={styles.closeOptions}>
					
					<button onClick={closeSession}>Yes</button>
					<button className="mr-lf-2" onClick={() => close(false)}>No</button>

				</div>

			</section>

		</div>

	);

}

export default CloseSessionModal;