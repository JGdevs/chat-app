import {HelpHttp} from '../helpers/HelpHttp.js';

const api = HelpHttp('http://localhost:4000');

export async function getConversations (id) {

	try {

		const conversations = await api.get(`/conversations/${id}`);

		return conversations

	}

	catch (err) {

		console.log(err);

	}

}