import {HelpHttp} from '../helpers/HelpHttp';

const api = HelpHttp('http://localhost:4000');

export async function sendMsgServices (receptor,options) {

	try {

		let msg = await api.post(`/newMessage/${receptor}`,options);

		return msg;

	}

	catch (err) {

		console.log(err);

	}


}

export async function getMsgServices (id,contactId,range) {

	try {

		let getMsg = api.get(`/messages/${id}/${contactId}/${range}`)

		return getMsg;

	}

	catch(err) {

		console.log(err);

	}

}