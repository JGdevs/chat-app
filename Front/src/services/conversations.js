import {HelpHttp} from '../helpers/HelpHttp.js';

const api = HelpHttp('http://localhost:4000');

export async function getConversations (id) {

	try {

		const conversations = await api.get(`/conversations/${id}`);

		return conversations;

	}

	catch (err) {

		console.log(err);

	}

}

export async function deleteConversations (id,options) {

	try {

		const conversationsDeleted = api.del(`/deleteConversations/${id}`);

		return conversationsDeleted;

	}

	catch (err) {

		console.log(err);

	}

}

export async function createNewConversation (id,options) {

	try {

		const newConversation = await api.post(`/newConversation/${id}`,options)

		return newConversation;

	}

	catch (err) {

		console.log(err);

	}

}