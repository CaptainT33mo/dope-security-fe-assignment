import { createColumnHelper } from "@tanstack/react-table";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import { useState } from "react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import type { Character } from "../../data/characters";

const columnHelper = createColumnHelper<Character>();

interface HealthColumnProps {
	healthFilter: string[];
	onHealthFilterChange: (value: string[]) => void;
}

const HealthColumnHeader = ({
	healthFilter,
	onHealthFilterChange,
}: HealthColumnProps) => {
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	const handleHealthFilterChange = (status: string, checked: boolean) => {
		if (checked) {
			onHealthFilterChange([...healthFilter, status]);
		} else {
			onHealthFilterChange(healthFilter.filter((s) => s !== status));
		}
	};

	return (
		<div className="flex items-center gap-1">
			Health
			<DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="h-6 w-6 p-0">
						<Filter className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-[150px]">
					<DropdownMenuLabel>Filter by health</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{["Healthy", "Injured", "Critical"].map((status) => (
						<DropdownMenuCheckboxItem
							key={status}
							className="capitalize"
							checked={healthFilter.includes(status)}
							onCheckedChange={(checked) =>
								handleHealthFilterChange(status, checked)
							}
						>
							{status}
						</DropdownMenuCheckboxItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
			{healthFilter.length > 0 && (
				<Badge
					variant="secondary"
					className="rounded-sm px-1 font-normal text-xs"
				>
					{healthFilter.length}
				</Badge>
			)}
		</div>
	);
};

export const createColumns = (
	healthFilter: string[],
	onHealthFilterChange: (value: string[]) => void,
) => [
	// Selection column
	columnHelper.display({
		id: "select",
		size: 50,
		minSize: 50,
		maxSize: 50,
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllRowsSelected() ||
					(table.getIsSomeRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label={`Select row ${row.index + 1}`}
			/>
		),
		enableSorting: false,
		enableHiding: false,
	}),
	// Name column
	columnHelper.accessor("name", {
		header: "Name",
		size: 200,
		minSize: 150,
		maxSize: 300,
		cell: ({ getValue }) => (
			<div className="font-medium truncate" title={getValue() as string}>
				{getValue() as string}
			</div>
		),
	}),
	// Location column
	columnHelper.accessor("location", {
		header: "Location",
		size: 120,
		minSize: 100,
		maxSize: 150,
		cell: ({ getValue }) => (
			<div
				className="text-muted-foreground truncate"
				title={getValue() as string}
			>
				{getValue() as string}
			</div>
		),
	}),
	// Health column with filter
	columnHelper.accessor("health", {
		header: () => (
			<HealthColumnHeader
				healthFilter={healthFilter}
				onHealthFilterChange={onHealthFilterChange}
			/>
		),
		size: 140,
		minSize: 120,
		maxSize: 160,
		cell: ({ getValue }) => {
			const health = getValue() as string;
			const colorClass =
				health === "Healthy"
					? "text-green-600 dark:text-green-400"
					: health === "Injured"
						? "text-yellow-600 dark:text-yellow-400"
						: "text-red-600 dark:text-red-400";
			return (
				<div className={`${colorClass} truncate`} title={health}>
					{health}
				</div>
			);
		},
	}),
	// Power column with sorting
	columnHelper.accessor("power", {
		header: ({ column }) => (
			<div className="flex items-center gap-2">
				Power
				<Button
					variant="ghost"
					size="sm"
					className="h-6 w-6 p-0"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					{{
						asc: <ChevronUp className="h-4 w-4" />,
						desc: <ChevronDown className="h-4 w-4" />,
					}[column.getIsSorted() as string] ?? (
						<ChevronUp className="h-4 w-4 opacity-50" />
					)}
				</Button>
			</div>
		),
		size: 120,
		minSize: 100,
		maxSize: 140,
		cell: ({ getValue }) => (
			<div
				className="text-left font-mono truncate"
				title={(getValue() as number).toLocaleString()}
			>
				{(getValue() as number).toLocaleString()}
			</div>
		),
		sortingFn: "basic",
	}),
];
