import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Character } from "../../../data/characters";
import { CharacterTable } from "../CharacterTable";

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
	{
		id: "char_3",
		name: "Gaara",
		location: "Suna",
		health: "Critical",
		power: 4000,
		viewed: false,
	},
	{
		id: "char_4",
		name: "Kakashi Hatake",
		location: "Konoha",
		health: "Healthy",
		power: 6000,
		viewed: false,
	},
];

describe("CharacterTable", () => {
	const mockOnSelectedRowsChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		// Mock console.log to avoid noise in tests
		vi.spyOn(console, "log").mockImplementation(() => {});
	});

	it("renders loading state correctly", () => {
		render(
			<CharacterTable
				data={[]}
				loading={true}
				onSelectedRowsChange={mockOnSelectedRowsChange}
			/>,
		);

		expect(screen.getByText("Loading characters...")).toBeInTheDocument();
	});

	it("renders table with character data", () => {
		render(
			<CharacterTable
				data={mockCharacters}
				loading={false}
				onSelectedRowsChange={mockOnSelectedRowsChange}
			/>,
		);

		// Check if character names are displayed
		expect(screen.getByText("Naruto Uzumaki")).toBeInTheDocument();
		expect(screen.getByText("Sasuke Uchiha")).toBeInTheDocument();
		expect(screen.getByText("Gaara")).toBeInTheDocument();
		expect(screen.getByText("Kakashi Hatake")).toBeInTheDocument();

		// Check if locations are displayed (use getAllByText since there are multiple Konoha entries)
		expect(screen.getAllByText("Konoha")).toHaveLength(3); // 3 characters from Konoha
		expect(screen.getByText("Suna")).toBeInTheDocument();

		// Check if health statuses are displayed (use getAllByText for Healthy since there are 2 healthy characters)
		expect(screen.getAllByText("Healthy")).toHaveLength(2); // 2 characters are healthy
		expect(screen.getByText("Injured")).toBeInTheDocument();
		expect(screen.getByText("Critical")).toBeInTheDocument();
	});

	it("shows search input", () => {
		render(
			<CharacterTable
				data={mockCharacters}
				loading={false}
				onSelectedRowsChange={mockOnSelectedRowsChange}
			/>,
		);

		expect(
			screen.getByPlaceholderText(/search characters by name or location/i),
		).toBeInTheDocument();
	});

	it("shows submit button with correct initial state", () => {
		render(
			<CharacterTable
				data={mockCharacters}
				loading={false}
				onSelectedRowsChange={mockOnSelectedRowsChange}
			/>,
		);

		const submitButton = screen.getByText(/mark as viewed\/unviewed \(0\)/i);
		expect(submitButton).toBeDisabled();
	});

	it("displays power values correctly", () => {
		render(
			<CharacterTable
				data={mockCharacters}
				loading={false}
				onSelectedRowsChange={mockOnSelectedRowsChange}
			/>,
		);

		// Check if power values are displayed with proper formatting
		expect(screen.getByText("5,000")).toBeInTheDocument();
		expect(screen.getByText("4,500")).toBeInTheDocument();
		expect(screen.getByText("4,000")).toBeInTheDocument();
		expect(screen.getByText("6,000")).toBeInTheDocument();
	});

	it("shows health filter in column header", () => {
		render(
			<CharacterTable
				data={mockCharacters}
				loading={false}
				onSelectedRowsChange={mockOnSelectedRowsChange}
			/>,
		);

		// Check if health column header with filter is present
		expect(screen.getByText("Health")).toBeInTheDocument();
		// The filter button doesn't have accessible name, so we check for the button with dropdown trigger
		const buttons = screen.getAllByRole("button");
		const filterButton = buttons.find(
			(button) => button.getAttribute("aria-haspopup") === "menu",
		);
		expect(filterButton).toBeInTheDocument();
	});

	it("shows power column with sort button", () => {
		render(
			<CharacterTable
				data={mockCharacters}
				loading={false}
				onSelectedRowsChange={mockOnSelectedRowsChange}
			/>,
		);

		// Check if power column header with sort button is present
		expect(screen.getByText("Power")).toBeInTheDocument();
		const sortButtons = screen.getAllByRole("button");
		const sortButton = sortButtons.find(
			(button) => button.querySelector("svg"), // Look for chevron icon
		);
		expect(sortButton).toBeInTheDocument();
	});
});
