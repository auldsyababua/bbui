/**
 * TypeScript Types for ERPNext DocType Viewer
 * Based on validated API responses from Step 5 prototype
 */

/**
 * DocType record from ERPNext API
 * Fields validated in Step 5 test results
 */
export interface DocType {
  /** DocType name (e.g., "Task", "Account") */
  name: string;

  /** Module name (e.g., "Projects", "Accounts") */
  module: string;

  /** 0 = DocType, 1 = Child Table */
  istable: 0 | 1;

  /** Single DocType flag (stores only one record) */
  issingle?: 0 | 1;

  /** Editable grid flag */
  editable_grid?: 0 | 1;

  /** Track changes for audit log */
  track_changes?: 0 | 1;

  /** Allow additional unknown fields */
  [key: string]: any;
}

/**
 * Generic record from any DocType
 * Used for displaying records in the show view
 */
export interface DocTypeRecord {
  /** Record ID (always present) */
  name: string;

  /** Dynamic fields based on DocType schema */
  [key: string]: any;
}

/**
 * DocType field schema definition
 * For future schema viewer feature
 */
export interface DocField {
  /** Field name (database column) */
  fieldname: string;

  /** Field type (Data, Link, Select, etc.) */
  fieldtype: string;

  /** Display label */
  label: string;

  /** Required field flag */
  reqd?: 0 | 1;

  /** Options for Select/Link fields */
  options?: string;

  /** Default value */
  default?: any;

  /** Field description */
  description?: string;

  /** Read-only flag */
  read_only?: 0 | 1;

  /** Allow additional unknown fields */
  [key: string]: any;
}

/**
 * ERPNext API List Response
 * Handles both response formats found in Step 5:
 * - GET /api/resource/DocType returns { data: [...] }
 * - POST /api/method/frappe.client.get_list returns { message: [...] }
 */
export interface ERPNextListResponse<T> {
  /** GET endpoint format */
  data?: T[];

  /** POST endpoint format */
  message?: T[];

  /** Total count (not provided by API, as confirmed in Step 5) */
  total_count?: number;
}

/**
 * ERPNext API Single Record Response
 */
export interface ERPNextOneResponse<T> {
  data: T;
}

/**
 * ERPNext Error Response
 * Format validated in Step 5 prototype (401 error)
 */
export interface ERPNextErrorResponse {
  /** Full exception class name */
  exception: string;

  /** Short error type */
  exc_type: string;

  /** Full traceback as JSON string */
  exc: string;

  /** Optional message field */
  message?: string;
}

/**
 * Refine Data Provider List Response
 * Format expected by Refine's useList hook
 */
export interface RefineListResponse<T> {
  /** Array of records */
  data: T[];

  /** Total count for pagination */
  total: number;
}

/**
 * Refine Data Provider Single Record Response
 * Format expected by Refine's useOne hook
 */
export interface RefineOneResponse<T> {
  /** Single record */
  data: T;
}

/**
 * Refine Pagination Parameters
 */
export interface RefinePagination {
  /** Current page (1-indexed) */
  current: number;

  /** Page size (records per page) */
  pageSize: number;
}

/**
 * Refine Sort Parameters
 */
export interface RefineSorter {
  /** Field to sort by */
  field: string;

  /** Sort order */
  order: "asc" | "desc";
}

/**
 * Refine Filter Parameters
 */
export interface RefineFilter {
  /** Field to filter */
  field: string;

  /** Filter operator */
  operator: "eq" | "ne" | "lt" | "gt" | "lte" | "gte" | "in" | "nin" | "contains";

  /** Filter value */
  value: any;
}

/**
 * ERPNext API Pagination Parameters
 * Format validated in Step 5 prototype
 */
export interface ERPNextPagination {
  /** Offset (0-indexed) */
  limit_start: number;

  /** Page size */
  limit_page_length: number;
}

/**
 * ERPNext API Filter Parameters
 * Format: { field: value } for equality
 * Step 5 validated: { istable: 0 }
 */
export type ERPNextFilters = Record<string, any>;

/**
 * ERPNext API Sorting Parameter
 * Format: "field desc" or "field asc"
 * Example: "creation desc"
 */
export type ERPNextSorting = string;
