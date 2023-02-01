import {HelpHttp} from '../helpers/HelpHttp.js';

const api = HelpHttp('http://localhost:4000');

export async function userRegister (options) {

	try {

		const register = await api.post(`/register`,options);

		return register;

	}

	catch (err) {

		console.log()

	}

}

export async function userLogin (options) {

	try {

		const login = await api.post(`/login`,options);

		return login;

	}

	catch (err) {

		console.log(err);

	}

}