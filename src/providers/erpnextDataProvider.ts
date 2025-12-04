/**
 * ERPNext Data Provider for Refine
 * Integrates ERPNext API with Refine's data provider interface
 */

import type { DataProvider } from '@refinedev/core';
import { createERPNextClient } from '../utils/erpnextClient';
import { createERPNextAdapter } from './erpnextAdapter';
import type {
  ERPNextListResponse,
  ERPNextOneResponse,
  RefineFilter,
  RefineSorter,
} from '../features/erpnext-viewer/types';

export interface ERPNextDataProviderConfig {
  apiUrl: string;
  apiKey: string;
  apiSecret: string;
}

/**
 * Create ERPNext data provider for Refine
 */
export const createERPNextDataProvider = (
  config: ERPNextDataProviderConfig
): DataProvider => {
  const client = createERPNextClient(config);
  const adapter = createERPNextAdapter();

  return {
    /**
     * Get list of records
     * Uses POST /api/method/frappe.client.get_list
     */
    getList: async ({ resource, pagination, filters, sorters }) => {
      try {
        // Transform Refine parameters to ERPNext format
        const erpnextPagination = adapter.transformPagination(pagination as any);
        const erpnextFilters = adapter.transformFilters(filters as RefineFilter[]);
        const erpnextSorting = adapter.transformSorters(sorters as RefineSorter[]);

        // Build request payload
        const payload: Record<string, any> = {
          doctype: resource,
          fields: ['*'], // Get all fields
          ...erpnextPagination,
        };

        // Add filters if present
        if (Object.keys(erpnextFilters).length > 0) {
          payload.filters = erpnextFilters;
        }

        // Add sorting if present
        if (erpnextSorting) {
          payload.order_by = erpnextSorting;
        }

        // Call API
        const response = await client.post<ERPNextListResponse<any>>(
          '/api/method/frappe.client.get_list',
          payload
        );

        // Transform response to Refine format
        return adapter.transformList(response);
      } catch (error: any) {
        // Re-throw with additional context
        throw new Error(`Failed to fetch ${resource} list: ${error.message}`);
      }
    },

    /**
     * Get single record
     * Uses GET /api/resource/{resource}/{id}
     */
    getOne: async ({ resource, id }) => {
      if (!id) {
        throw new Error('ID is required for getOne');
      }

      try {
        const response = await client.get<ERPNextOneResponse<any>>(
          `/api/resource/${resource}/${id}`
        );

        return adapter.transformOne(response);
      } catch (error: any) {
        throw new Error(`Failed to fetch ${resource} with ID ${id}: ${error.message}`);
      }
    },

    /**
     * Get many records by IDs
     * Not directly supported by ERPNext, use filters instead
     */
    getMany: async ({ resource, ids }) => {
      try {
        // Fetch records with name filter (id field in ERPNext)
        const payload = {
          doctype: resource,
          fields: ['*'],
          filters: {
            name: ['in', ids], // ERPNext filter syntax for "IN" operator
          },
        };

        const response = await client.post<ERPNextListResponse<any>>(
          '/api/method/frappe.client.get_list',
          payload
        );

        return adapter.transformList(response);
      } catch (error: any) {
        throw new Error(`Failed to fetch multiple ${resource}: ${error.message}`);
      }
    },

    /**
     * Create record
     * Not supported for read-only viewer
     */
    create: async () => {
      throw new Error('Create operation not supported in read-only ERPNext viewer');
    },

    /**
     * Update record
     * Not supported for read-only viewer
     */
    update: async () => {
      throw new Error('Update operation not supported in read-only ERPNext viewer');
    },

    /**
     * Delete record
     * Not supported for read-only viewer
     */
    deleteOne: async () => {
      throw new Error('Delete operation not supported in read-only ERPNext viewer');
    },

    /**
     * Get API URL
     */
    getApiUrl: () => {
      return config.apiUrl;
    },

    /**
     * Custom method for ERPNext-specific queries
     */
    custom: async ({ url, method, payload, query }) => {
      try {
        if (method === 'get' || method.toLowerCase() === 'get') {
          return await client.get(url, query as any);
        } else if (method === 'post' || method.toLowerCase() === 'post') {
          return await client.post(url, payload as any);
        } else {
          throw new Error(`Unsupported method: ${method}`);
        }
      } catch (error: any) {
        throw new Error(`Custom request failed: ${error.message}`);
      }
    },
  };
};
