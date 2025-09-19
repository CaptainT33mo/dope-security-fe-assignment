import type { ColumnDef } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Character } from "../../../data/characters";
import { generateCharacters } from "../../../data/characters";
import { DataTable } from "../DataTable";

// Mock data for testing
const mockCharacters: Character[] = [
	{
		id: "char_1",
		name: "Naruto Uzumaki",
		location: "Konoha",
		health: "Healthy",
		power: 5000,
		viewed: false,
	},
	{
		id: "char_2",
		name: "Sasuke Uchiha",
		location: "Konoha",
		health: "Injured",
		power: 4500,
		viewed: false,
	},
];

// Simple columns for testing
const mockColumns: ColumnDef<Character>[] = [
	{
		id: "select",
		header: "Select",
		cell: ({ row }) => (
			<input
				type="checkbox"
				checked={row.getIsSelected()}
				onChange={() => row.toggleSelected()}
			/>
		),
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ getValue }) => <span>{getValue() as string}</span>,
	},
	{
		accessorKey: "location",
		header: "Location",
		cell: ({ getValue }) => <span>{getValue() as string}</span>,
	},
	{
		accessorKey: "health",
		header: "Health",
		cell: ({ getValue }) => <span>{getValue() as string}</span>,
	},
	{
		accessorKey: "power",
		header: "Power",
		cell: ({ getValue }) => (
			<span>{(getValue() as number).toLocaleString()}</span>
		),
	},
];

describe("DataTable", () => {
	const mockOnRowSelectionChange = vi.fn();
	const mockOnSortingChange = vi.fn();
	const mockOnSelectedRowsChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("renders table with data", () => {
		render(
			<DataTable
				columns={mockColumns}
				data={mockCharacters}
				rowSelection={{}}
				onRowSelectionChange={mockOnRowSelectionChange}
				sorting={[]}
				onSortingChange={mockOnSortingChange}
				onSelectedRowsChange={mockOnSelectedRowsChange}
			/>,
		);

		// Check if data is rendered
		expect(screen.getByText("Naruto Uzumaki")).toBeInTheDocument();
		expect(screen.getByText("Sasuke Uchiha")).toBeInTheDocument();
		expect(screen.getAllByText("Konoha")).toHaveLength(2); // Both characters are from Konoha
		expect(screen.getByText("Healthy")).toBeInTheDocument();
		expect(screen.getByText("Injured")).toBeInTheDocument();
		expect(screen.getByText("5,000")).toBeInTheDocument();
		expect(screen.getByText("4,500")).toBeInTheDocument();
	});

	it("shows row count information", () => {
		render(
			<DataTable
				columns={mockColumns}
				data={mockCharacters}
				rowSelection={{}}
				onRowSelectionChange={mockOnRowSelectionChange}
				sorting={[]}
				onSortingChange={mockOnSortingChange}
				onSelectedRowsChange={mockOnSelectedRowsChange}
			/>,
		);

		// Check if row count is displayed
		expect(screen.getByText(/showing 2 of 2 characters/i)).toBeInTheDocument();
	});

	it("handles empty data gracefully", () => {
		render(
			<DataTable
				columns={mockColumns}
				data={[]}
				rowSelection={{}}
				onRowSelectionChange={mockOnRowSelectionChange}
				sorting={[]}
				onSortingChange={mockOnSortingChange}
				onSelectedRowsChange={mockOnSelectedRowsChange}
			/>,
		);

		// Should show 0 characters
		expect(screen.getByText(/showing 0 of 0 characters/i)).toBeInTheDocument();
	});

	it("renders table headers correctly", () => {
		render(
			<DataTable
				columns={mockColumns}
				data={mockCharacters}
				rowSelection={{}}
				onRowSelectionChange={mockOnRowSelectionChange}
				sorting={[]}
				onSortingChange={mockOnSortingChange}
				onSelectedRowsChange={mockOnSelectedRowsChange}
			/>,
		);

		// Check if headers are rendered
		expect(screen.getByText("Select")).toBeInTheDocument();
		expect(screen.getByText("Name")).toBeInTheDocument();
		expect(screen.getByText("Location")).toBeInTheDocument();
		expect(screen.getByText("Health")).toBeInTheDocument();
		expect(screen.getByText("Power")).toBeInTheDocument();
	});

	it("enables virtualization for large datasets", () => {
		// Generate 150 characters to trigger virtualization (threshold is 100)
		const largeDataset = generateCharacters(150);

		render(
			<DataTable
				columns={mockColumns}
				data={largeDataset}
				rowSelection={{}}
				onRowSelectionChange={mockOnRowSelectionChange}
				sorting={[]}
				onSortingChange={mockOnSortingChange}
				onSelectedRowsChange={mockOnSelectedRowsChange}
			/>,
		);

		// Check if virtualization indicator is shown
		expect(
			screen.getByText(/virtualized with react-virtuoso/i),
		).toBeInTheDocument();
		expect(
			screen.getByText(/showing 150 of 150 characters/i),
		).toBeInTheDocument();
	});

	it("disables virtualization for small datasets", () => {
		render(
			<DataTable
				columns={mockColumns}
				data={mockCharacters}
				rowSelection={{}}
				onRowSelectionChange={mockOnRowSelectionChange}
				sorting={[]}
				onSortingChange={mockOnSortingChange}
				onSelectedRowsChange={mockOnSelectedRowsChange}
			/>,
		);

		// Check that virtualization indicator is not shown for small datasets
		expect(screen.queryByText(/virtualized/i)).not.toBeInTheDocument();
		expect(screen.getByText(/showing 2 of 2 characters/i)).toBeInTheDocument();
	});
});
