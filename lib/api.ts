import axios from "axios";

export async function getApi(url: string, headers: any = {}) {
	const response = await axios.get(url, { headers, withCredentials: true });
	return response.data;
}

export async function deleteApi(url: string, body: string, headers: any = {}) {
	const response = await axios.delete(url, {
		data: body,
		headers,
		withCredentials: true,
	});
	return response.data;
}

export async function postApi(url: string, body: string, headers: any = {}) {
	const response = await axios.post(url, body, {
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		withCredentials: true,
	});
	return response.data;
}
