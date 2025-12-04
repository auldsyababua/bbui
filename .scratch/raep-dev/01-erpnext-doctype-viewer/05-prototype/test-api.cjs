#!/usr/bin/env node
/**
 * ERPNext API Prototype Test
 *
 * Tests critical assumptions about ops.10nz.tools API:
 * 1. Authentication with API key/secret
 * 2. Endpoint structure
 * 3. Response format
 * 4. Pagination parameters
 * 5. Filter syntax
 * 6. Accessible DocTypes
 */

const https = require('https');

// Load credentials from environment (from /srv/projects/bigsirflrts/.env)
const API_URL = process.env.ERPNEXT_API_URL || 'https://ops.10nz.tools';
const API_KEY = process.env.FRAPPE_CLOUD_API_KEY;
const API_SECRET = process.env.FRAPPE_CLOUD_API_SECRET;

if (!API_KEY || !API_SECRET) {
  console.error('❌ ERROR: Missing API credentials');
  console.error('Please set FRAPPE_CLOUD_API_KEY and FRAPPE_CLOUD_API_SECRET environment variables');
  process.exit(1);
}

/**
 * Make authenticated request to Frappe API
 */
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `token ${API_KEY}:${API_SECRET}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data && (method === 'POST' || method === 'PUT')) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Test 1: List Available DocTypes
 */
async function testListDocTypes() {
  console.log('\n📋 TEST 1: List Available DocTypes');
  console.log('=' .repeat(60));

  try {
    const response = await makeRequest('GET', '/api/resource/DocType?fields=["name","module"]&limit_page_length=10');

    console.log('✅ Status:', response.status);
    console.log('📦 Response structure:', Object.keys(response.data));
    console.log('📊 DocTypes found:', response.data.data?.length || 0);

    if (response.data.data) {
      console.log('\n🔍 Sample DocTypes:');
      response.data.data.slice(0, 5).forEach(dt => {
        console.log(`  - ${dt.name} (${dt.module})`);
      });
    }

    return { success: true, response };
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 2: Test frappe.client.get_list Method
 */
async function testGetListMethod() {
  console.log('\n📋 TEST 2: Test frappe.client.get_list Method');
  console.log('=' .repeat(60));

  try {
    // Try POST method with parameters in body
    const response = await makeRequest('POST', '/api/method/frappe.client.get_list', {
      doctype: 'DocType',
      fields: ['name', 'module', 'istable'],
      filters: {},
      limit_start: 0,
      limit_page_length: 5,
      order_by: 'modified desc'
    });

    console.log('✅ Status:', response.status);
    console.log('📦 Response structure:', Object.keys(response.data));
    console.log('📊 Records returned:', response.data.message?.length || 0);

    if (response.data.message) {
      console.log('\n🔍 Sample records:');
      response.data.message.slice(0, 3).forEach(record => {
        console.log(`  - ${record.name} (module: ${record.module}, table: ${record.istable})`);
      });
    }

    return { success: true, response };
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 3: Test Pagination
 */
async function testPagination() {
  console.log('\n📋 TEST 3: Test Pagination Parameters');
  console.log('=' .repeat(60));

  try {
    const page1 = await makeRequest('POST', '/api/method/frappe.client.get_list', {
      doctype: 'DocType',
      fields: ['name'],
      limit_start: 0,
      limit_page_length: 3
    });

    const page2 = await makeRequest('POST', '/api/method/frappe.client.get_list', {
      doctype: 'DocType',
      fields: ['name'],
      limit_start: 3,
      limit_page_length: 3
    });

    console.log('✅ Page 1 Status:', page1.status);
    console.log('📊 Page 1 Records:', page1.data.message?.length || 0);
    console.log('📋 Page 1 First Record:', page1.data.message?.[0]?.name);

    console.log('\n✅ Page 2 Status:', page2.status);
    console.log('📊 Page 2 Records:', page2.data.message?.length || 0);
    console.log('📋 Page 2 First Record:', page2.data.message?.[0]?.name);

    return { success: true, page1, page2 };
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 4: Test Filters
 */
async function testFilters() {
  console.log('\n📋 TEST 4: Test Filter Syntax');
  console.log('=' .repeat(60));

  try {
    const response = await makeRequest('POST', '/api/method/frappe.client.get_list', {
      doctype: 'DocType',
      fields: ['name', 'module', 'istable'],
      filters: {
        istable: 0  // Filter for non-table DocTypes
      },
      limit_page_length: 5
    });

    console.log('✅ Status:', response.status);
    console.log('📊 Records (istable=0):', response.data.message?.length || 0);

    if (response.data.message) {
      console.log('\n🔍 Filtered records (istable=0):');
      response.data.message.forEach(record => {
        console.log(`  - ${record.name} (istable: ${record.istable})`);
      });
    }

    return { success: true, response };
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 5: Check for Total Count
 */
async function testTotalCount() {
  console.log('\n📋 TEST 5: Check for Total Count in Response');
  console.log('=' .repeat(60));

  try {
    const response = await makeRequest('POST', '/api/method/frappe.client.get_list', {
      doctype: 'DocType',
      fields: ['name'],
      limit_page_length: 5
    });

    console.log('✅ Status:', response.status);
    console.log('📦 Full response structure:', JSON.stringify(response.data, null, 2));

    // Check for various possible total count fields
    const possibleCountFields = ['total_count', 'count', 'total', 'num_rows'];
    let foundCount = null;

    for (const field of possibleCountFields) {
      if (response.data[field] !== undefined) {
        foundCount = { field, value: response.data[field] };
        break;
      }
    }

    if (foundCount) {
      console.log(`✅ Total count found: ${foundCount.field} = ${foundCount.value}`);
    } else {
      console.log('⚠️  Total count field not found in response');
    }

    return { success: true, response, foundCount };
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error };
  }
}

/**
 * Test 6: Test Permission Errors
 */
async function testPermissions() {
  console.log('\n📋 TEST 6: Test Permissions on Various DocTypes');
  console.log('=' .repeat(60));

  const testDocTypes = ['Task', 'Project', 'User', 'ToDo', 'Comment'];
  const results = {};

  for (const doctype of testDocTypes) {
    try {
      const response = await makeRequest('POST', '/api/method/frappe.client.get_list', {
        doctype: doctype,
        fields: ['name'],
        limit_page_length: 1
      });

      if (response.status === 200) {
        results[doctype] = '✅ Accessible';
        console.log(`  ${doctype}: ✅ Accessible (${response.data.message?.length || 0} records)`);
      } else {
        results[doctype] = `❌ Status ${response.status}`;
        console.log(`  ${doctype}: ❌ Status ${response.status}`);
      }
    } catch (error) {
      results[doctype] = `❌ ${error.message}`;
      console.log(`  ${doctype}: ❌ ${error.message}`);
    }
  }

  return { success: true, results };
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('\n🚀 ERPNext API Prototype Tests');
  console.log('=' .repeat(60));
  console.log(`🌐 API URL: ${API_URL}`);
  console.log(`🔑 Using API Key: ${API_KEY.substring(0, 8)}...`);

  const results = {};

  results.test1 = await testListDocTypes();
  results.test2 = await testGetListMethod();
  results.test3 = await testPagination();
  results.test4 = await testFilters();
  results.test5 = await testTotalCount();
  results.test6 = await testPermissions();

  console.log('\n📊 TEST SUMMARY');
  console.log('=' .repeat(60));

  Object.entries(results).forEach(([test, result]) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${test}: ${status}`);
  });

  console.log('\n✨ Tests complete!');

  return results;
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests };
