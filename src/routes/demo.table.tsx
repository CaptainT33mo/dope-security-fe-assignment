import { createFileRoute } from "@tanstack/react-router";
import { CharacterTable } from "../components/pages/CharacterTable";
import { useCharacters } from "../hooks/useCharacters";

export const Route = createFileRoute("/demo/table")({
	component: TableDemo,
});

function TableDemo() {
	const { characters, loading, error } = useCharacters();

	const handleSelectedRowsChange = (selectedIds: string[]) => {
		console.log("Selected character IDs:", selectedIds);
	};

	if (error) {
		return (
			<div className="min-h-screen bg-background p-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-lg text-destructive">
						Error loading characters: {error}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background p-6">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						Character Table Demo
					</h1>
					<p className="text-muted-foreground">
						A performant table with react-virtuoso virtualization (auto-enabled
						for 100+ rows), filtering, sorting, and selection
					</p>
				</div>
				<CharacterTable
					data={characters}
					loading={loading}
					onSelectedRowsChange={handleSelectedRowsChange}
				/>
			</div>
		</div>
	);
}
