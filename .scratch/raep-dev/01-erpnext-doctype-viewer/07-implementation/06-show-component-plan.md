# Component 6: DocType Show Component - PLAN Phase

## Component Purpose
Display records for selected DocType with dynamic columns, pagination, and search.

## Implementation Structure

### Component Design
```typescript
export const DocTypeShow: React.FC = () => {
  const { doctype } = useParams<{ doctype: string }>();

  const { tableProps } = useTable<DocTypeRecord>({
    resource: doctype || "",
    pagination: { pageSize: 25 },
    meta: { dataProviderName: "erpnext" }
  });

  // Dynamic column generation based on first record
  const columns = generateColumns(tableProps.dataSource);

  return (
    <Show title={`${doctype} Records`}>
      <Table {...tableProps}>
        {columns.map(col => <Table.Column key={col.key} {...col} />)}
      </Table>
    </Show>
  );
};
```

### UI Features
1. **Dynamic Columns**: Generate columns based on first record's keys
2. **Pagination**: Server-side pagination (25 per page)
3. **Record Display**: Show all fields from DocType records
4. **Back Navigation**: Breadcrumb to DocType list
5. **Loading State**: Skeleton during data fetch
6. **Error State**: Error alert if API fails or DocType not found

### Column Generation Strategy
```typescript
function generateColumns(data: DocTypeRecord[] | undefined) {
  if (!data || data.length === 0) return [defaultColumn];

  const firstRecord = data[0];
  return Object.keys(firstRecord).map(key => ({
    key,
    dataIndex: key,
    title: formatTitle(key), // Convert "field_name" to "Field Name"
    ellipsis: true, // Truncate long values
  }));
}
```

### Field Formatting
- Convert snake_case to Title Case
- Truncate long text with ellipsis
- Display "name" field prominently (bold)

## Test Cases
1. ✅ Component renders without errors
2. ✅ DocType name extracted from URL params
3. ✅ Table displays records
4. ✅ Dynamic columns generated correctly
5. ✅ Pagination works
6. ✅ Back button navigates to list
7. ✅ Loading state shown during fetch
8. ✅ Error state shown if DocType invalid

## Edge Cases
- Invalid DocType name → show error message
- DocType with no records → show empty state
- DocType with many fields (50+) → columns scrollable
- Long field values → truncate with ellipsis and tooltip
- Missing doctype param → show error

## Dependencies
- @refinedev/core (useTable)
- @refinedev/antd (Show, Table components)
- react-router-dom (useParams, useNavigate)
- types.ts (DocTypeRecord interface)

## Implementation Plan
1. Create file: `src/features/erpnext-viewer/show.tsx`
2. Import dependencies
3. Define DocTypeShow component
4. Extract doctype from URL params
5. Use useTable hook
6. Implement column generation logic
7. Implement field formatting helper
8. Render Show component with Table
9. Add error handling for missing doctype
10. Export component

## Validation Checklist
- [ ] TypeScript compiles without errors
- [ ] Component renders table correctly
- [ ] Dynamic columns work
- [ ] Pagination works
- [ ] Error/loading states handled
- [ ] Back navigation works
