import {useState,useRef,useLayoutEffect} from 'react';
import ChangeImageModal from './ChangeImageModal';
import ChangeProfileModal from './ChangeProfileModal'
import styles from '../styles/MyProfile.module.css';

const MyProfile = () => {

	const user = JSON.parse(sessionStorage.getItem('user')),

	[editName,setEditName] = useState(false),

	[editInfo,setEditInfo] = useState(false),

	[image,setImage] = useState(null),

	imageRef = useRef(),

	changeImage = ({target}) => {

		const reader = new FileReader();

		reader.addEventListener('loadend',({target}) => setImage(target.result));

		reader.readAsDataURL(target.files[0]);

	}
 
	return (

		<>

			<section className={styles.profileContainer}>
				
				<div className={`${styles.profileImgContainer} mr-center w-fit`}>
					
					{

						(user.profileImage === "") 

						? <i className="bi-person-circle text-white"></i> 

						: <div className={styles.profileImg}>

								<img src={user.profileImage} ref={imageRef}/>

							</div>

					}

					<label htmlFor="image">
							
						<i className={`bi-camera-fill text-main-color fs-2 ${styles.changeImage}`}></i>

					</label>

				</div>

			</section>

			<section className={styles.profileInfo}>

				<div className={styles.profileInfoContent}>
					
					<i className="text-white bi-person-circle fs-2"></i>

					<label className="text-white bold-text">Nombre: {user.username}</label>

				</div>

				<i onClick={() => setEditName(true)} className="bi-pen-fill fs-0"></i>

			</section>

			<section className={styles.profileInfo}>

				<div className={styles.profileInfoContent}>
					
					<i className="text-white bi-exclamation-circle fs-2"></i>

					<label className="text-white bold-text">Info: {user.info}</label>

				</div>

				<i onClick={() => setEditInfo(true)} className="bi-pen-fill fs-0"></i>

			</section>

			<section className={styles.profileInfo}>

				<div className={styles.profileInfoContent}>
					
					<i className="text-white bi-telephone-fill fs-2"></i>

					<label className="text-white bold-text">Id: {user.id}</label>

				</div>

			</section>

			<input id="image" type="file" hidden onChange={changeImage}/>

			{image && <ChangeImageModal image={image} close={setImage} userImage={user.profileImage} imageRef={imageRef}/>}

			{editName && <ChangeProfileModal origin="nombre" currentValue={user.username} close={setEditName}/>}

			{editInfo && <ChangeProfileModal origin="info" currentValue={user.info} close={setEditInfo}/>}

		</>

	)

}

export default  MyProfile;