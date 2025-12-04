/**
 * ERPNext Adapter
 * Transforms ERPNext API responses to Refine-compatible format
 * and converts Refine parameters to ERPNext API format
 */

import type {
  ERPNextListResponse,
  ERPNextOneResponse,
  ERPNextPagination,
  ERPNextFilters,
  ERPNextSorting,
  RefineListResponse,
  RefineOneResponse,
  RefinePagination,
  RefineSorter,
  RefineFilter,
} from '../features/erpnext-viewer/types';

export interface ERPNextAdapterConfig {
  // Future: add config options like field mappings, default page size
}

export class ERPNextAdapter {
  constructor(_config?: ERPNextAdapterConfig) {
    // Config reserved for future use
  }

  /**
   * Transform ERPNext list response to Refine format
   * Handles both 'data' and 'message' response fields
   */
  transformList<T>(response: ERPNextListResponse<T>): RefineListResponse<T> {
    // Step 5 validated: GET returns { data: [...] }, POST returns { message: [...] }
    const data = response.data || response.message || [];

    // Step 5 confirmed: API doesn't provide total_count
    // Use data.length as fallback (will detect end by empty results)
    const total = response.total_count || data.length;

    return {
      data,
      total,
    };
  }

  /**
   * Transform ERPNext single record response to Refine format
   */
  transformOne<T>(response: ERPNextOneResponse<T>): RefineOneResponse<T> {
    return {
      data: response.data,
    };
  }

  /**
   * Transform Refine pagination to ERPNext format
   * Refine uses 1-indexed pages, ERPNext uses 0-indexed offset
   */
  transformPagination(pagination?: RefinePagination): ERPNextPagination {
    if (!pagination) {
      return {
        limit_start: 0,
        limit_page_length: 25, // Default page size
      };
    }

    const { current = 1, pageSize = 25 } = pagination;

    // Validate current page (must be >= 1)
    const safeCurrent = Math.max(1, current);

    return {
      limit_start: (safeCurrent - 1) * pageSize, // Convert 1-indexed to 0-indexed offset
      limit_page_length: pageSize,
    };
  }

  /**
   * Transform Refine filters to ERPNext format
   * Step 5 validated: { field: value } for equality
   */
  transformFilters(filters?: RefineFilter[]): ERPNextFilters {
    if (!filters || filters.length === 0) {
      return {};
    }

    const erpnextFilters: ERPNextFilters = {};

    for (const filter of filters) {
      // Only support 'eq' operator for MVP (as validated in Step 5)
      if (filter.operator === 'eq') {
        erpnextFilters[filter.field] = filter.value;
      } else {
        // Log warning for unsupported operators
        console.warn(
          `ERPNext Adapter: Unsupported filter operator "${filter.operator}" for field "${filter.field}". ` +
          'Only "eq" (equality) is supported. Filter skipped.'
        );
      }
    }

    return erpnextFilters;
  }

  /**
   * Transform Refine sorters to ERPNext format
   * ERPNext expects: "field desc" or "field asc"
   */
  transformSorters(sorters?: RefineSorter[]): ERPNextSorting {
    if (!sorters || sorters.length === 0) {
      return '';
    }

    // Join multiple sorters with comma
    // Example: "creation desc, modified asc"
    return sorters
      .map((sorter) => `${sorter.field} ${sorter.order}`)
      .join(', ');
  }
}

/**
 * Factory function to create ERPNext adapter
 */
export const createERPNextAdapter = (config?: ERPNextAdapterConfig): ERPNextAdapter => {
  return new ERPNextAdapter(config);
};
