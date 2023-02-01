import {HelpHttp} from '../helpers/HelpHttp.js';

const api = HelpHttp('http://localhost:4000');

export async function changeImageProfile (id,options) {

	try {

		const changeImg = await api.post(`/changeImage/${id}`,options);

		return changeImg;

	}

	catch (err) {

		console.log(err);

	}

}

export async function changeNameProfile (id,value) {

	try {

		const profileName = await api.post(`/modifyName/${id}/${value}`);

		return profileName;

	}

	catch (err) {

		console.log(err);

	}

}

export async function changeInfoProfile (id,value) {

	try {

		const profileInfo = await api.post(`/modifyInfo/${id}/${value}`);

		return profileInfo;

	}

	catch (err) {

		console.log(err);

	}

}
