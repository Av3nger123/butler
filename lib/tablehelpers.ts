const defaultRow = (schema: any) => {
	let finalObject: any = {};
	Object.keys(schema).forEach((key) => {
		finalObject[key] = "";
	});
	return finalObject;
};
