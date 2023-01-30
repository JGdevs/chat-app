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

export async function deleteContact (id,options) {

	try {

		const contactDeleted = await api.del(`/deleteContacts/${id}`,options);

		return contactDeleted;

	}

	catch (err) {

		console.log(err);

	}

}

export async function createNewContact (id,options) {

	try {

		let newContact = await api.post(`/newContact/${id}`);

		return newContact;

	}

	catch (err) {

		console.log(err);

	}

}

export async function getContactImage (id) {

	try {

		const contactImages = await api.get(`/profileImage/${id}`);

		return contactImages;

	}

	catch (err) {

		console.log(err);

	}

}

