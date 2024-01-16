export async function getApi(url: string, headers: any = {}) {
	return await fetch(url, { headers, credentials: "include" }).then(
		async (result) => {
			return await result.json();
		}
	);
}

export async function deleteApi(url: string, body: string, headers: any = {}) {
	return await fetch(url, {
		method: "DELETE",
		body,
		headers,
		credentials: "include",
	}).then(async (result) => {
		return await result.json();
	});
}

export async function postApi(url: string, body: string, headers: any = {}) {
	return await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
		credentials: "include",
		body,
	}).then(async (result) => {
		return await result.json();
	});
}
