import { Row } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { useTable } from "@/lib/context/table-context";

export function CustomCheck({ row }: { row: Row<any> }) {
	const { selectedIds } = useTable();
	return (
		<Checkbox
			className="mx-2"
			checked={selectedIds.includes(row.original?.primaryKey)}
			onCheckedChange={(value) => row.toggleSelected(!!value)}
			aria-label="Select row"
		/>
	);
}
