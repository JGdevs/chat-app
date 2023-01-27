import {HelpHttp} from '../helpers/HelpHttp.js';

const api = HelpHttp('http://localhost:4000');

export async function getContacts (id) {

	try {

		const contacts = await api.get(`/contacts/${id}`)

		return contacts;

	}


	catch (err) {

		console.log(err);

	}

}

export async function getContactInfo (id) {

	try {

		const contactInfo = await api.get(`/info/${id}`);

		return contactInfo;

	}

	catch (err) {

		console.log(err)

	}

}

