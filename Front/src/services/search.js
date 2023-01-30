import {HelpHttp} from '../helpers/HelpHttp.js';

const api = HelpHttp('http://localhost:4000');

export async function search (id) {

	try {

		const stringSearch = await api.get(`/SearchResult/${id}`);

		return stringSearch;

	}

	catch (err) {

		console.log(err);

	}

}