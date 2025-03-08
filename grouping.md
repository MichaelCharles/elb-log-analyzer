# Table Grouping Feature Documentation

This document provides a comprehensive guide to how the grouping functionality was implemented in the Load Balancer Log Viewer application.

## Overview

The grouping feature allows users to organize log entries by specific columns, creating collapsible groups that make it easier to analyze patterns in the data. Users can activate grouping by clicking on a grouping icon next to column headers. Groups display summary information and can be expanded to show individual records.

## Technical Implementation

### 1. Dependencies

The implementation relies on TanStack Table (formerly React Table) v8.x, specifically using its grouping capabilities:

```typescript
import {
  getGroupedRowModel,
  getExpandedRowModel
} from '@tanstack/react-table';
```

### 2. State Management

Two pieces of state are needed in the main table container component (`LogViewerContainer.tsx`):

```typescript
// State for tracking which columns are being grouped by
const [grouping, setGrouping] = useState<string[]>([]);

// State for tracking which grouped rows are expanded
const [expanded, setExpanded] = useState({});
```

### 3. Table Configuration

The table instance must be configured to use grouping:

```typescript
const table = useReactTable({
  // ... other configurations
  
  // Add grouping state to the table
  state: {
    // ... other state
    grouping,
    expanded,
  },
  
  // Add handlers for updating grouping and expanded state
  onGroupingChange: setGrouping,
  onExpandedChange: setExpanded,
  
  // Add these get*Model functions to enable grouping functionality
  getGroupedRowModel: getGroupedRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
});
```

### 4. Column Configuration

Columns that should support grouping need to have the `enableGrouping` property set to `true`. Optionally, `aggregationFn` can be specified for numerical columns:

```typescript
// For a text-based column:
columnHelper.accessor(row => row.protocol, {
  id: 'protocol',
  header: () => 'Protocol',
  cell: info => info.getValue(),
  filterFn: 'equals',
  enableGrouping: true, // Enable grouping for this column
})

// For a numerical column with aggregation:
columnHelper.accessor(row => row.statusCode, {
  id: 'statusCode',
  header: () => 'Status',
  cell: info => { /* ... */},
  filterFn: 'equals',
  enableGrouping: true,
  aggregationFn: 'count', // Provides a count of entries in the group
})
```

Common aggregation functions include:
- 'count': Counts the number of rows in the group
- 'sum': Sums numerical values
- 'mean': Calculates the average of numerical values
- 'median': Finds the median value
- 'min'/'max': Finds the minimum/maximum values

### 5. UI for Selecting Grouping

The user interface for enabling grouping is implemented as a small button with a grouping icon next to each column header. This is added in the `LogTable.tsx` component:

```typescript
<div className="flex items-center space-x-2">
  {/* Existing sort UI */}
  <div
    className="flex items-center space-x-1 cursor-pointer"
    onClick={header.column.getToggleSortingHandler()}
  >
    {/* Header content and sort indicators */}
  </div>
  
  {/* Grouping button - only shown for columns that can be grouped */}
  {header.column.getCanGroup() && (
    <button
      onClick={e => {
        e.stopPropagation();
        
        // Toggle grouping for this column
        const groupingSet = new Set(table.getState().grouping);
        if (groupingSet.has(header.column.id)) {
          groupingSet.delete(header.column.id);
          table.setGrouping(Array.from(groupingSet));
        } else {
          table.setGrouping([header.column.id]);
        }
      }}
      className={`ml-1 p-1 text-xs rounded hover:bg-gray-200 ${
        table.getState().grouping.includes(header.column.id)
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-500'
      }`}
      title="Group by this column"
    >
      {/* SVG Icon for grouping */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    </button>
  )}
</div>
```

### 6. Rendering Grouped Rows

The table body needs to be updated to handle different types of cells based on whether they're grouped, aggregated, or regular:

```typescript
<tbody className="bg-white divide-y divide-gray-200">
  {table.getRowModel().rows.map(row => (
    <tr key={row.id} className={`hover:bg-gray-50 ${row.getIsGrouped() ? 'bg-gray-100 font-medium' : ''}`}>
      {row.getVisibleCells().map(cell => {
        if (cell.getIsGrouped()) {
          // Group cell - has expand/collapse functionality
          return (
            <td
              key={cell.id}
              className="px-3 py-2 text-sm text-gray-900 border-b whitespace-nowrap bg-gray-100 cursor-pointer"
              onClick={() => row.toggleExpanded()}
              colSpan={row.getVisibleCells().length}
            >
              <div className="flex items-center">
                <span className="mr-2">{row.getIsExpanded() ? '▼' : '▶'}</span>
                <span className="font-medium">
                  {cell.column.columnDef.header?.toString()}: {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </span>
                <span className="ml-2 text-gray-500">
                  ({row.subRows.length} item{row.subRows.length !== 1 ? 's' : ''})
                </span>
              </div>
            </td>
          );
        } else if (cell.getIsAggregated()) {
          // Aggregated cell - shows aggregated value (e.g., counts, sums)
          return (
            <td
              key={cell.id}
              className="px-3 py-2 text-sm text-gray-900 border-b whitespace-nowrap"
            >
              {flexRender(
                cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                cell.getContext()
              )}
            </td>
          );
        } else if (cell.getIsPlaceholder()) {
          // Placeholder cell (for grouped rows)
          return <td key={cell.id} className="px-3 py-2 text-sm text-gray-400 border-b"></td>;
        } else {
          // Regular cell
          return (
            <td
              key={cell.id}
              className="px-3 py-2 text-sm text-gray-900 border-b whitespace-nowrap"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          );
        }
      })}
    </tr>
  ))}
</tbody>
```

## Styling Considerations

- Grouped rows have a light gray background (`bg-gray-100`) to distinguish them
- The active grouping column button has a blue background (`bg-blue-100`) and blue text (`text-blue-700`)
- Expansion indicators (▶/▼) provide visual cues for collapsible content
- Group headers show the count of items in the group for context

## Key User Interactions

1. **Activating Grouping**: User clicks the grouping icon next to a column header
2. **Changing Grouping**: Clicking a different column's grouping icon switches to that column
3. **Removing Grouping**: Clicking the active grouping column's icon again removes grouping
4. **Expanding/Collapsing**: Clicking on a group row toggles between expanded and collapsed states

## Technical Details and Considerations

### Group Data Structure

When grouping is active, TanStack Table creates a hierarchical data structure:
- Grouped rows have a `subRows` property containing the child rows
- The grouping value is accessible through `row.getValue(row.getGroupingColumnId())`
- Aggregated values are calculated automatically based on `aggregationFn` configurations

### Handling Multiple Levels of Grouping

The current implementation focuses on single-column grouping for simplicity, but TanStack Table supports nested grouping. To implement multi-level grouping:

1. Modify the header click handler to add columns to the grouping array instead of replacing it
2. Update the UI to indicate grouping hierarchy (e.g., with indentation or breadcrumbs)
3. Handle nested rendering of grouped rows recursively

### Performance Considerations

- Grouping operations are performed client-side and can be expensive for large datasets
- TanStack Table optimizes this by memoizing results, but be cautious with very large logs
- Consider implementing virtualization for large grouped datasets

## Debugging Tips

If you encounter issues with the grouping functionality:

1. Check the console for errors related to grouping or expansion
2. Verify that `getGroupedRowModel` and `getExpandedRowModel` are properly configured
3. Ensure columns have `enableGrouping: true` set
4. Confirm the state management for `grouping` and `expanded` is working correctly
5. Test with a simple dataset to isolate complex data issues

### Common Build Issues

When implementing grouping, you may encounter TypeScript errors related to column headers:

1. **Header Function Context Errors**: When accessing a column's header function directly:
   ```typescript
   // This can cause TypeScript errors as header expects props
   column.columnDef.header() // Error: Expected 1 argument, but got 0
   ```

   **Solution**: Instead of directly calling header functions, use one of these approaches:
   
   ```typescript
   // Option 1: Use flexRender (preferred when you have the context)
   flexRender(column.columnDef.header, column.getContext())
   
   // Option 2: Use a simple string conversion (safer fallback)
   String(column.columnDef.header || column.id)
   ```

2. **Type Safety with Headers**: TypeScript may report errors with header values that could be functions.

   **Solution**: Always use defensive programming when working with column headers:
   
   ```typescript
   // Safe header access that works with function or string headers
   const headerText = String(column.columnDef.header || column.id);
   ```

## Example: How Data Transformation Works

For a dataset of access logs, grouping by `statusCode` might transform data like this:

**Original flat data:**
```
[
  { id: 1, statusCode: "200", method: "GET", url: "/api/v1/users" },
  { id: 2, statusCode: "404", method: "GET", url: "/missing" },
  { id: 3, statusCode: "200", method: "POST", url: "/api/v1/users" },
  { id: 4, statusCode: "500", method: "GET", url: "/error" }
]
```

**Grouped data structure:**
```
[
  {
    statusCode: "200",
    subRows: [
      { id: 1, statusCode: "200", method: "GET", url: "/api/v1/users" },
      { id: 3, statusCode: "200", method: "POST", url: "/api/v1/users" }
    ]
  },
  {
    statusCode: "404",
    subRows: [
      { id: 2, statusCode: "404", method: "GET", url: "/missing" }
    ]
  },
  {
    statusCode: "500", 
    subRows: [
      { id: 4, statusCode: "500", method: "GET", url: "/error" }
    ]
  }
]
```

This transformation is handled automatically by TanStack Table's grouping functionality.