import { string } from "zod";

interface JSONData {
	[key: string]: { [key: string]: { newValue: any; oldValue: any } };
}

interface QueryResults {
	queries: string[];
	revertQueries: string[];
}

export function generateQueriesFromJSON(
	jsonData: JSONData,
	tableName: string,
	primaryKeyFormat: string
): QueryResults {
	if (!jsonData) {
		return {
			queries: [],
			revertQueries: [],
		};
	}
	try {
		const queries = [];
		const revertQueries = [];

		for (const operationType of Object.keys(jsonData)) {
			for (const key of Object.keys(jsonData[operationType])) {
				const newValue = jsonData[operationType][key].newValue;
				const oldValue = jsonData[operationType][key].oldValue;

				switch (operationType) {
					case "update":
						const updateQuery = generateUpdateQuery(
							key,
							newValue,
							oldValue,
							tableName,
							primaryKeyFormat
						);
						const revertUpdateQuery = generateRevertUpdateQuery(
							key,
							oldValue,
							newValue,
							tableName,
							primaryKeyFormat
						);
						queries.push(updateQuery);
						revertQueries.push(revertUpdateQuery);
						break;
					case "add":
						const insertQuery = generateInsertQuery(newValue, tableName);
						const revertInsertQuery = generateRevertInsertQuery(
							newValue,
							tableName,
							primaryKeyFormat
						);
						queries.push(insertQuery);
						revertQueries.push(revertInsertQuery);
						break;
					case "delete":
						const deleteQuery = generateDeleteQuery(
							key,
							oldValue,
							tableName,
							primaryKeyFormat
						);
						const revertDeleteQuery = generateRevertDeleteQuery(
							oldValue,
							tableName
						);
						queries.push(deleteQuery);
						revertQueries.push(revertDeleteQuery);
						break;
					default:
						console.warn(`Unknown operation type: ${operationType}`);
						break;
				}
			}
		}

		return { queries, revertQueries };
	} catch (error) {
		console.error("Error generating queries:", error);
		throw error;
	}
}

function generateUpdateQuery(
	key: string,
	newValue: any,
	oldValue: any,
	tableName: string,
	primaryKeyColumn: string
) {
	const setClause = Object.entries(newValue)
		.map(([column, value]) =>
			typeof value == "string"
				? `"${column}" = '${value}'`
				: `"${column}" = ${value}`
		)
		.join(", ");
	const conditions = primaryKeyColumn
		.split("~")
		.map((key) => `"${key}" = ${oldValue[key]}`);
	return `UPDATE "${tableName}" SET ${setClause} WHERE ${conditions}`;
}

function generateInsertQuery(value: any, tableName: string) {
	const columns = Object.keys(value).filter((val) => val != "primaryKey");
	const values = columns.map((key) => value[key]);
	const placeholders = values
		.map((val) =>
			val == null ? "NULL" : typeof val == "string" ? `'${val}'` : val
		)
		.join(", ");
	return `INSERT INTO "${tableName}" ('${columns.join(
		'", "'
	)}') VALUES (${placeholders})`;
}

function generateDeleteQuery(
	key: string,
	oldValue: any,
	tableName: string,
	primaryKeyColumn: string
) {
	const conditions = primaryKeyColumn
		.split("~")
		.map((key: string) => `"${key}" = ${oldValue[key]}`);
	return `DELETE FROM "${tableName}" WHERE ${conditions}`;
}

function generateRevertUpdateQuery(
	key: string,
	oldValue: any,
	newValue: any,
	tableName: string,
	primaryKeyColumn: string
) {
	const setClause = Object.entries(newValue).map(([column, value]) =>
		typeof value == "string"
			? `"${column}" = '${value}'`
			: `"${column}" = ${value}`
	);
	const conditions = primaryKeyColumn
		.split("~")
		.map((key) => `"${key}" = ${oldValue[key]}`);
	return `UPDATE "${tableName}" SET ${setClause} WHERE ${conditions}`;
}

function generateRevertInsertQuery(
	newValue: any,
	tableName: string,
	primaryKeyColumn: string
) {
	const conditions = primaryKeyColumn
		.split("~")
		.map((key: string) => `"${key}" = ${newValue[key]}`);
	return `DELETE FROM "${tableName}" WHERE ${conditions}`;
}

function generateRevertDeleteQuery(value: any, tableName: string) {
	const columns = Object.keys(value).filter((val) => val != "primaryKey");
	const values = columns.map((key) => value[key]);
	const placeholders = values
		.map((val) =>
			val == null ? "NULL" : typeof val == "string" ? `'${val}'` : val
		)
		.join(", ");
	return `INSERT INTO "${tableName}" ("${columns.join(
		'", "'
	)}") VALUES (${placeholders})`;
}
