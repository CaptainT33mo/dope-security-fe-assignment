import {
	type ColumnDef,
	type Row,
	type RowSelectionState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { type HTMLAttributes, forwardRef, useEffect } from "react";
import { TableVirtuoso } from "react-virtuoso";

import { cn } from "../../lib/utils";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

import type { Character } from "../../data/characters";

const LoadingSkeleton = <TData, TValue>({
	columns,
}: { columns: ColumnDef<TData, TValue>[] }) => (
	<div className="rounded-md border overflow-hidden">
		<div className="h-96 overflow-auto">
			<Table className="table-fixed" style={{ tableLayout: "fixed" }}>
				<TableHeader className="sticky top-0 z-10 bg-background">
					<TableRow>
						{columns.map((column, index) => (
							<TableHead key={column.id || `header-${index}`}>
								<div className="h-4 bg-muted animate-pulse rounded" />
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 10 }, (_, rowIndex) => {
						const rowId = `skeleton-row-${rowIndex}`;
						return (
							<TableRow key={rowId}>
								{columns.map((column, colIndex) => (
									<TableCell key={`${rowId}-${column.id || `col-${colIndex}`}`}>
										<div className="h-4 bg-muted animate-pulse rounded" />
									</TableCell>
								))}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	</div>
);

const TableComponent = forwardRef<
	HTMLTableElement,
	React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
	<table
		ref={ref}
		className={cn("w-full caption-bottom text-sm table-fixed", className)}
		style={{ tableLayout: "fixed" }}
		{...props}
	/>
));
TableComponent.displayName = "TableComponent";

const TableRowComponent = <TData,>(rows: Row<TData>[]) =>
	function getTableRow(props: HTMLAttributes<HTMLTableRowElement>) {
		// @ts-expect-error data-index is a valid attribute
		const index = props["data-index"];
		const row = rows[index];
		if (!row) return null;

		const rowData = row.original as { viewed?: boolean };
		const isViewed = rowData?.viewed === true;

		return (
			<TableRow
				key={row.id}
				data-state={row.getIsSelected() && "selected"}
				className={isViewed ? "opacity-60" : ""}
				{...props}
			>
				{row.getVisibleCells().map((cell) => (
					<TableCell key={cell.id}>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</TableCell>
				))}
			</TableRow>
		);
	};

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	rowSelection: RowSelectionState;
	onRowSelectionChange: (selection: RowSelectionState) => void;
	sorting: { id: string; desc: boolean }[];
	onSortingChange: (sorting: { id: string; desc: boolean }[]) => void;
	onSelectedRowsChange?: (selectedIds: string[]) => void;
	loading?: boolean;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	rowSelection,
	onRowSelectionChange,
	sorting,
	onSortingChange,
	onSelectedRowsChange,
	loading = false,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		state: {
			rowSelection,
			sorting,
		},
		enableRowSelection: true,
		enableColumnResizing: true,
		columnResizeMode: "onChange",
		onRowSelectionChange: (updaterOrValue) => {
			if (typeof updaterOrValue === "function") {
				onRowSelectionChange(updaterOrValue(rowSelection));
			} else {
				onRowSelectionChange(updaterOrValue);
			}
		},
		onSortingChange: (updaterOrValue) => {
			if (typeof updaterOrValue === "function") {
				onSortingChange(updaterOrValue(sorting));
			} else {
				onSortingChange(updaterOrValue);
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	const { rows } = table.getSortedRowModel();

	// Virtualization setup - only for large datasets
	const shouldVirtualize = rows.length > 100;

	useEffect(() => {
		if (onSelectedRowsChange) {
			const selectedIds = Object.keys(rowSelection)
				.filter((key) => rowSelection[key])
				.map((key) => {
					const row = rows[Number.parseInt(key, 10)];
					return row?.original
						? (row.original as unknown as Character).id
						: null;
				})
				.filter(Boolean) as string[];
			onSelectedRowsChange(selectedIds);
		}
	}, [rowSelection, onSelectedRowsChange, rows]);

	if (loading) {
		return (
			<div className="space-y-4">
				<LoadingSkeleton columns={columns} />
				<div className="flex items-center justify-between text-sm text-muted-foreground">
					<div>Loading characters...</div>
					<div>Please wait</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Virtualized Table */}
			<div className="rounded-md border overflow-hidden">
				{shouldVirtualize ? (
					<TableVirtuoso
						className="h-full min-h-[calc(100vh_-_240px)]"
						totalCount={rows.length}
						components={{
							Table: TableComponent,
							TableRow: TableRowComponent(rows),
						}}
						fixedHeaderContent={() =>
							table.getHeaderGroups().map((headerGroup) => (
								<TableRow
									className="bg-card hover:bg-muted"
									key={headerGroup.id}
								>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead
												key={header.id}
												colSpan={header.colSpan}
												style={{
													width: header.getSize(),
												}}
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))
						}
					/>
				) : (
					/* Non-virtualized table for small datasets */
					<div className="h-96 overflow-auto">
						<Table className="table-fixed" style={{ tableLayout: "fixed" }}>
							<TableHeader className="sticky top-0 z-10 bg-background">
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => (
											<TableHead
												key={header.id}
												style={{ width: header.getSize() }}
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										))}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{rows.map((row) => {
									// Check if the row data has a viewed property and apply opacity
									const rowData = row.original as { viewed?: boolean };
									const isViewed = rowData?.viewed === true;

									return (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && "selected"}
											className={isViewed ? "opacity-60" : ""}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</TableCell>
											))}
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				)}
			</div>

			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<div>
					Showing {rows.length} of {data.length} characters
				</div>
				<div>Total rows: {rows.length}</div>
			</div>
		</div>
	);
}
