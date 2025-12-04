# Component 5: DocType List Component - PLAN Phase

## Component Purpose
Display paginated list of available DocTypes with filtering and navigation to record viewer.

## Implementation Structure

### Component Design
```typescript
export const DocTypeList: React.FC = () => {
  const { tableProps } = useList<DocType>({
    resource: "DocType",
    pagination: { pageSize: 25 },
    filters: { permanent: [{ field: "istable", operator: "eq", value: 0 }] },
    meta: { dataProviderName: "erpnext" }
  });

  return (
    <List>
      <Table {...tableProps}>
        <Table.Column dataIndex="name" title="DocType" />
        <Table.Column dataIndex="module" title="Module" />
        <Table.Column dataIndex="istable" title="Type" render={...} />
        <Table.Column title="Actions" render={...} />
      </Table>
    </List>
  );
};
```

### UI Features
1. **Table Layout**: Ant Design Table with columns: Name, Module, Type, Actions
2. **Pagination**: Built-in pagination from Refine (25 per page)
3. **Filter**: Permanent filter for istable=0 (non-table DocTypes)
4. **Actions**: "View Records" button navigates to show page
5. **Loading State**: Skeleton loading from Refine
6. **Error State**: Error alert if API fails

### Column Definitions
- **Name**: DocType name (string, sortable)
- **Module**: Module name (string, sortable)
- **Type**: "DocType" or "Child Table" badge based on istable value
- **Actions**: Button to navigate to record viewer

### Navigation
- "View Records" button → `/tools/erpnext/doctypes/{name}`
- Uses react-router-dom's `useNavigate`

## Test Cases
1. ✅ Component renders without errors
2. ✅ Table displays DocType data
3. ✅ Pagination works
4. ✅ Filter istable=0 applied
5. ✅ "View Records" button navigates correctly
6. ✅ Loading state shown during fetch
7. ✅ Error state shown on API failure

## Edge Cases
- No DocTypes accessible → show empty state
- Permission errors → show error alert
- Slow API → show loading skeleton
- Very long DocType names → truncate with ellipsis

## Dependencies
- @refinedev/core (useList hook)
- @refinedev/antd (List, Table, Tag, Button, Space components)
- react-router-dom (useNavigate)
- types.ts (DocType interface)

## Implementation Plan
1. Create file: `src/features/erpnext-viewer/list.tsx`
2. Import dependencies
3. Define DocTypeList component
4. Use useList hook with filters
5. Set up table columns
6. Add Type column with Tag renderer
7. Add Actions column with navigate button
8. Add error handling
9. Export component

## Validation Checklist
- [ ] TypeScript compiles without errors
- [ ] Component renders table correctly
- [ ] Pagination works
- [ ] Filter applied correctly
- [ ] Navigation works
- [ ] Error/loading states handled
