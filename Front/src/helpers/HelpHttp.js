export const HelpHttp = (baseURL) => {

	const customFetch = (endpoint,options) => {

		const defaultHeaders = {

			accept: "application/json",

		}

		const controller = new AbortController();

		options.signal = controller.signal;

		options.method = options.method || "GET";

		options.headers = options.headers ? {...defaultHeaders,...options.headers} : defaultHeaders;

		options.body = JSON.stringify(options.body) || false;

		if(!options.body) delete options.body;

		setTimeout(() => controller.abort(),5000);

		return fetch(endpoint,options)

		.then(res => (res.ok) ? res.json() : Promise.reject({err:true,status:res.status || "00",statusText:res.statusText || "ocurrio un error"}))

		.catch(err => err);

	}

	const get = (url,options = {}) => {

		if(baseURL) url = (url) ? baseURL + url : baseURL; 

		return customFetch(url,options);

	}


	const post = (url,options = {}) => {

		options.method = "POST";

		if(baseURL) url = (url) ? baseURL + url : baseURL;

		return customFetch(url,options);

	} 

	const put = (url,options = {}) => {

		options.method = "PUT";

		if(baseURL) url = (url) ? baseURL + url : baseURL;

		return customFetch(url,options);

	} 

	const del = (url,options = {}) => {

		options.method = "DELETE";

		if(baseURL) url = (url) ? baseURL + url : baseURL;

		return customFetch(url,options);

	} 

	
	return {

		get,
		post,
		put,
		del	

	}

}

	