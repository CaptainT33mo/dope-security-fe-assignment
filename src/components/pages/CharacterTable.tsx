import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { useDebounce } from "../../hooks/useDebounce";
import { DataTable } from "../global/DataTable";
import { DataTableToolbar } from "../global/DataTableToolbar";
import { createColumns } from "../global/columns";

import type { Character } from "../../data/characters";

interface CharacterTableProps {
	data: Character[];
	loading?: boolean;
	onSelectedRowsChange?: (selectedIds: string[]) => void;
}

export function CharacterTable({
	data,
	loading = false,
	onSelectedRowsChange,
}: CharacterTableProps) {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [globalFilter, setGlobalFilter] = useState("");
	const [healthFilter, setHealthFilter] = useState<string[]>([]);
	const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
	const [viewedState, setViewedState] = useState<Record<string, boolean>>({});

	// Debounce the search input with a 300ms delay
	const debouncedGlobalFilter = useDebounce(globalFilter, 300);

	// Filter data based on search and health filter, and apply viewed state changes
	const filteredData = useMemo(() => {
		let filtered = data;

		// Apply global filter (name or location) using debounced value
		if (debouncedGlobalFilter) {
			filtered = filtered.filter(
				(character) =>
					character.name
						.toLowerCase()
						.includes(debouncedGlobalFilter.toLowerCase()) ||
					character.location
						.toLowerCase()
						.includes(debouncedGlobalFilter.toLowerCase()),
			);
		}

		// Apply health filter
		if (healthFilter.length > 0) {
			filtered = filtered.filter((character) =>
				healthFilter.includes(character.health),
			);
		}

		// Apply viewed state changes
		filtered = filtered.map((character) => ({
			...character,
			viewed:
				viewedState[character.id] !== undefined
					? viewedState[character.id]
					: character.viewed,
		}));

		return filtered;
	}, [data, healthFilter, debouncedGlobalFilter, viewedState]);

	// Create columns with health filter
	const columns = useMemo(
		() => createColumns(healthFilter, setHealthFilter),
		[healthFilter],
	);

	// Handle submit selected (mark as viewed/unviewed)
	const handleSubmitSelected = () => {
		const selectedIds = Object.keys(rowSelection)
			.filter((key) => rowSelection[key])
			.map((key) => filteredData[Number.parseInt(key, 10)]?.id)
			.filter(Boolean) as string[];

		if (selectedIds.length === 0) {
			console.log("No items selected");
			return;
		}

		console.log("Toggling viewed state for character IDs:", selectedIds);

		// Toggle viewed state for selected characters
		setViewedState((prev) => {
			const newState = { ...prev };
			for (const id of selectedIds) {
				// Get current viewed state (either from local state or original data)
				const currentViewed =
					newState[id] !== undefined
						? newState[id]
						: data.find((char) => char.id === id)?.viewed || false;
				newState[id] = !currentViewed; // Toggle viewed state
			}
			return newState;
		});

		// Clear selection after marking as viewed/unviewed
		setRowSelection({});
	};

	return (
		<div className="space-y-4">
			{/* Toolbar with search and submit button */}
			<DataTableToolbar
				searchValue={globalFilter}
				onSearchChange={setGlobalFilter}
				selectedCount={Object.keys(rowSelection).length}
				onSubmitSelected={handleSubmitSelected}
			/>

			{/* Data Table */}
			<DataTable
				columns={columns as ColumnDef<Character, unknown>[]}
				data={filteredData}
				rowSelection={rowSelection}
				onRowSelectionChange={setRowSelection}
				sorting={sorting}
				onSortingChange={setSorting}
				onSelectedRowsChange={onSelectedRowsChange}
				loading={loading}
			/>
		</div>
	);
}
