type DatabaseCluster = {
	id: string;
	name: string;
	host: string;
	port: string;
	type: string;
	username: string;
	password: string;
};

export type SidebarNavItem = {
	name: string;
};

export type Schema = {
	column: string;
	dataType: string;
	isNullable: string;
	columnDefault: string;
	position: number;
	isPrimary: boolean;
	index: boolean;
	foreignKey: string;
};
