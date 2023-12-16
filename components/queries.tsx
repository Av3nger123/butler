export function Queries({ query }: { query: string }) {
	return (
		<div>
			{queries.map((query) => (
				<div key={query}>{query}</div>
			))}
		</div>
	);
}
