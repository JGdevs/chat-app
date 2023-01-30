import {useState,useEffect,useRef} from 'react';
import {changeImageProfile} from '../services/profile.js';
import styles from '../styles/ChangeImageModal.module.css';

const ChangeImageModal = ({image,close,userImage,imageRef}) => {

	const user = JSON.parse(sessionStorage.getItem('user')),

	containerRef = useRef(),

	cropImgRef = useRef(),

	canvasRef = useRef(),

	targetImgRef = useRef(),

	{id,username} = JSON.parse(sessionStorage.getItem('user'));

	let event_state = {},
	ratio = 1.0,
	keyZoomValue = 4.0,
	MINWIDTH = 50,
	MINHEIGHT = 50,
	CROPWIDTH = 200,
	CROPHEIGHT = 200,
	cropLeft = 0,
	cropTop = 0,
	cropWidth = 0,
	cropHeight = 0

	function removeHandlers() {

		if(containerRef.current) {

			containerRef.current.removeEventListener('mousedown', startMoving);
			containerRef.current.removeEventListener('touchstart', startMoving);
			containerRef.current.removeEventListener('wheel', resizing);

		}

		document.removeEventListener('mouseup', endMoving);
		document.removeEventListener('touchend', endMoving);
		document.removeEventListener('mousemove', moving);
		document.removeEventListener('touchmove', moving);
		document.removeEventListener('keypress', keyHandler);

	}

	function addHandlers() {

		containerRef.current.addEventListener('mousedown', startMoving, false);
		containerRef.current.addEventListener('touchstart', startMoving, false);
		containerRef.current.addEventListener('wheel', resizing, false);

		document.addEventListener('keypress', keyHandler, false);
		//document.querySelector('.btn-crop').addEventListener('click', openCropCanvasImg);

	}

	function updateCropSize(width, height) {

		containerRef.current.style.width = width + 'px';
		containerRef.current.style.height = height + 'px';

	}

	function updateCropImage(left, top) {

		cropLeft = -left * ratio;
		cropTop = -top * ratio;
		left = -left + 'px';
		top = -top + 'px';

		cropImgRef.current.style.top = top;
		cropImgRef.current.style.left = left;

	}

	function updateContainer(left, top) {

		top = top + (CROPWIDTH / 2) + 'px';
		left = left + (CROPHEIGHT / 2) + 'px';

		containerRef.current.style.top = top;
		containerRef.current.style.left = left;

	}
				
	function saveEventState(e) {

		event_state.container_width = containerRef.current.offsetWidth;
		event_state.container_height = containerRef.current.offsetHeight;

		event_state.container_left = containerRef.current.offsetLeft;
		event_state.container_top = containerRef.current.offsetTop;

		event_state.mouse_x = (e.clientX || e.pageX || e.touches && e.touches[0].clientX) + window.scrollX;
		event_state.mouse_y = (e.clientY || e.pageY || e.touches && e.touches[0].clientY) + window.scrollY;

	}

	function imgZoom(zoom) {

		zoom = zoom * Math.PI * 2
		let newWidth = Math.floor(containerRef.current.clientWidth + zoom),
		newHeight = Math.floor(containerRef.current.clientHeight + zoom),
		w = cropImgRef.current.clientWidth,
		h = cropImgRef.current.clientHeight,
		left,
		top,
		right,
		bottom;

		if (newWidth < MINWIDTH) {
				return;
		} else if (newWidth > w) {
				return;
		}

		left = containerRef.current.offsetLeft - (zoom / 2);
		top = containerRef.current.offsetTop - (zoom / 2);
		right = left + newWidth;
		bottom = top + newHeight;

		if (left < 0) {
				left = 0;
		}
		if (top < 0) {
				top = 0;
		}
		if (right > w) {
				return;
		}
		if (bottom > h) {
				return;
		}

		ratio = CROPWIDTH / newWidth;

		updateCropSize(newWidth, newWidth);
		updateCropImage(left, top);
		updateContainer(left, top);
		crop();

	}

	function keyHandler(e) {

		e.preventDefault();

		switch (String.fromCharCode(e.charCode)) {

			case '+' :
					imgZoom(keyZoomValue);
					break;
			case '-' :
					imgZoom(-keyZoomValue);
					break;

		}

	}

	function resizing(e) {

		e.preventDefault();
		imgZoom(e.deltaY > 0 ? 1 : -1);

	}

	function startMoving(e) {

		e.preventDefault();
		e.stopPropagation();

		saveEventState(e);

		document.addEventListener('mousemove', moving);
		document.addEventListener('touchmove', moving);
		document.addEventListener('mouseup', endMoving);
		document.addEventListener('touchend', endMoving);

	}

	function endMoving(e) {

		e.preventDefault();

		document.removeEventListener('mouseup', endMoving);
		document.removeEventListener('touchend', endMoving);
		document.removeEventListener('mousemove', moving);
		document.removeEventListener('touchmove', moving);

	}

	function moving(e) {

		let curuntTouch = {},
		left,
		top,
		w,
		h;

		//e.preventDefault();
		e.stopPropagation();

		curuntTouch.x = e.pageX || e.touches && e.touches[0].pageX;
		curuntTouch.y = e.pageY || e.touches && e.touches[0].pageY;

		left = curuntTouch.x - (event_state.mouse_x - event_state.container_left);
		top = curuntTouch.y - (event_state.mouse_y - event_state.container_top);
		w = containerRef.current.offsetWidth;
		h = containerRef.current.offsetHeight;

		if (left < 0) {
				left = 0;
		} else if (left > cropImgRef.current.offsetWidth - w) {
				left = cropImgRef.current.offsetWidth - w;
		}
		if (top < 0) {
				top = 0;
		} else if (top > cropImgRef.current.offsetHeight - h) {
				top = cropImgRef.current.offsetHeight - h;
		}

		updateCropImage(left, top);
		updateContainer(left, top);

	}

	function crop() {

		cropWidth = cropImgRef.current.width * ratio;
		cropHeight = cropImgRef.current.height * ratio;

		canvasRef.current.width = CROPWIDTH;
		canvasRef.current.height = CROPHEIGHT;

		let ctx = canvasRef.current.getContext('2d');
		ctx.drawImage(cropImgRef.current,
						cropLeft, cropTop,
						cropWidth, cropHeight
		);

	}

	function openCropCanvasImg() {

		crop();
		
		try {

			let base64Img = canvasRef.current.toDataURL('image/png', 1.0);

			return base64Img;

		} catch(e) {
			alert(e);
		} finally {
			// removeHandlers();
		}

	}

	function closeModal () {

		removeHandlers();

		close(null);

	}

	function uploadImage () {

		let base64Img = openCropCanvasImg(),

		options = {

			body:{base64Img,userImage},
			headers:{"content-type":"application/json"}

		}

		changeImageProfile(id,options).then(res => {

			if(!res.err) {

				removeHandlers();

				imageRef.current.src = base64Img;

				user.profileImage = base64Img;

				sessionStorage.setItem('user',JSON.stringify(user,));

				close(null);

			}

			else alert('hubo un problema al cambiar la imagen intente de nuevo');	

		});

	}

	useEffect(() => {

		let left = targetImgRef.current.offsetWidth / 2 - CROPWIDTH / 2,
		top = targetImgRef.current.offsetHeight / 2 - CROPHEIGHT / 2;

		updateCropImage(left, top);
		addHandlers();

		return () => removeHandlers();

	},[])

	return (

		<div className={styles.modal}>

			<div className={styles.icons}>
				
				<i className="bi-save text-white fs-2" onClick={uploadImage}></i>

				<i className="bi-x text-white fs-3 mr-lf" onClick={closeModal}></i>

			</div>


			<div className={styles.cropComponent}>
					
				<div className={styles.overlay} ref={containerRef}>
					
					<img ref={cropImgRef} src={image}/>

				</div>

				<img className={`${styles.cropImage} crop-blur`} ref={targetImgRef} alt="" src={image}/>

			</div>

			<canvas ref={canvasRef} className="none"></canvas>

		</div>

	)

}

export default ChangeImageModal;