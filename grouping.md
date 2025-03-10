# Multi-Column Grouping in Log Viewer

This document explains the implementation of multi-column grouping in the log viewer application.

## How it Works

The log viewer application now supports grouping by multiple columns simultaneously. The grouping order is preserved and indicated by numbers, allowing users to create hierarchical groupings.

## Components Modified

### 1. GroupingSelector.tsx

- Changed from a dropdown selector to a set of clickable tags for each groupable column
- Each selected column shows its position in the grouping order 
- Added a "Clear All" button to remove all groupings
- Tags use blue highlighting to indicate selection status

### 2. LogTable.tsx

- Modified the column header group icon to toggle the column in/out of grouping without replacing other groupings
- Added a group index indicator to show the position of each column in the grouping order
- Enhanced grouped cell rendering to show the grouping order for each level in the hierarchy

### 3. LogViewerContainer.tsx

- Added the GroupingSelector component to the UI
- Maintained the existing grouping state management (`useState<string[]>([])`)

## User Experience

Users can now:

1. Group by multiple columns by clicking on columns in the GroupingSelector
2. See the grouping order with numerical indicators (1, 2, 3, etc.)
3. Toggle columns in/out of grouping by clicking on the group icon in column headers
4. Remove all groupings at once with the "Clear All" button

## Grouping Order Significance

The order of columns in the grouping array is significant:

- The first column creates the top-level groups
- The second column creates sub-groups within each top-level group
- And so on, creating a hierarchical structure

## Example

If a user groups by:
1. `method` (GET, POST, etc.)
2. `statusCode` (200, 404, etc.)

The table will first group all entries by HTTP method, then within each method, further group by status code, creating a hierarchy like:

- GET (100 items)
  - 200 (80 items)
  - 404 (15 items)
  - 500 (5 items)
- POST (50 items)
  - 200 (40 items)
  - 400 (10 items)

## Technical Implementation

The implementation leverages TanStack Table's built-in grouping capabilities:
- Uses `getGroupedRowModel()` and `getExpandedRowModel()` for row grouping
- Maintains grouping state as an array of column IDs
- The order of column IDs in the array determines the grouping hierarchy