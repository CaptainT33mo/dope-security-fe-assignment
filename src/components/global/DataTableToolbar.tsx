import { Search } from "lucide-react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface DataTableToolbarProps {
	searchValue: string;
	onSearchChange: (value: string) => void;
	selectedCount: number;
	onSubmitSelected: () => void;
}

export function DataTableToolbar({
	searchValue,
	onSearchChange,
	selectedCount,
	onSubmitSelected,
}: DataTableToolbarProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				{/* Search Input */}
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search characters by name or location..."
						value={searchValue}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-8"
					/>
				</div>
			</div>

			{/* Submit Selected Button */}
			<div className="flex items-center space-x-2">
				<Button
					onClick={onSubmitSelected}
					disabled={selectedCount === 0}
					size="sm"
					className="h-8"
				>
					Mark as Viewed/Unviewed ({selectedCount})
				</Button>
			</div>
		</div>
	);
}
