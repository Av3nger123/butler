export async function getApi(url: string) {
	return await fetch(url).then(async (result) => {
		return await result.json();
	});
}

export async function deleteApi(url: string, body: string) {
	return await fetch(url, { method: "DELETE", body }).then(async (result) => {
		return await result.json();
	});
}

export async function postApi(url: string, body: string) {
	return await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body,
	}).then(async (result) => {
		return await result.json();
	});
}
