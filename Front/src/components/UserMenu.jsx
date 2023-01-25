import {useLocation} from 'react-router-dom';
import styles from '../styles/UserMenu.module.css';

const UserMenu = ({menuRef,handlerMenu,updateContactsInfo,setModal,toMyProfile}) => {

	const location = useLocation();

	return (

		<ul className={`${styles.menuHidden} hidden`} ref={menuRef} onClick={handlerMenu}>
			
			<label htmlFor="search">Buscar</label>
			<span onClick={toMyProfile}>Mi perfil</span>
			<label htmlFor="admin">Administrar</label>
			{(location.pathname.includes('Contacts')) && <span onClick={updateContactsInfo}>Actualizar</span>}
			<span onClick={() => setModal(true)}>Cerrar sesion</span>

		</ul>

	)

}

export default UserMenu;