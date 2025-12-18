import { Refine } from "@refinedev/core";
import { ThemedLayoutV2 } from "@refinedev/antd";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";
import "@refinedev/antd/dist/reset.css";

import { authProvider } from "./providers/authProvider";
import { accessControlProvider } from "./providers/accessControlProvider";
import { createERPNextDataProvider } from "./providers/erpnextDataProvider";
import { Homepage } from "./features/homepage";
import { DocTypeList, DocTypeShow } from "./features/erpnext-viewer";
import { CustomHeader } from "./components/header";

function App() {
  // Create ERPNext data provider (only if credentials are available)
  const hasERPNextCredentials = !!(
    import.meta.env.VITE_ERPNEXT_API_KEY &&
    import.meta.env.VITE_ERPNEXT_API_SECRET
  );

  const erpnextProvider = hasERPNextCredentials
    ? createERPNextDataProvider({
        apiUrl: import.meta.env.VITE_ERPNEXT_API_URL || 'https://ops.10nz.tools',
        apiKey: import.meta.env.VITE_ERPNEXT_API_KEY!,
        apiSecret: import.meta.env.VITE_ERPNEXT_API_SECRET!,
      })
    : null;

  // Create a no-op data provider for when ERPNext is not available
  const noopDataProvider = {
    getList: async () => ({ data: [], total: 0 }),
    getOne: async () => ({ data: {} as any }),
    getMany: async () => ({ data: [] }),
    create: async () => ({ data: {} as any }),
    update: async () => ({ data: {} as any }),
    deleteOne: async () => ({ data: {} as any }),
    getApiUrl: () => '',
    custom: async () => ({ data: {} as any }),
  };

  // Use ERPNext provider if available, otherwise use no-op
  const dataProvider = erpnextProvider || noopDataProvider;

  return (
    <BrowserRouter>
      <ConfigProvider>
        <Refine
          dataProvider={dataProvider}
          authProvider={authProvider}
          accessControlProvider={accessControlProvider}
          routerProvider={routerBindings}
          resources={[
            {
              name: "DocType",
              list: "/tools/erpnext/doctypes",
              show: "/tools/erpnext/doctypes/:doctype",
              meta: {
                label: "ERPNext DocTypes",
                hide: true, // Hide from sidebar (accessed via tools grid)
              },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
          }}
        >
          <Routes>
            <Route
              element={
                <ThemedLayoutV2 Header={CustomHeader}>
                  <Outlet />
                </ThemedLayoutV2>
              }
            >
              {/* Routes */}
              <Route index element={<Homepage />} />
              <Route path="/tools/erpnext/doctypes">
                <Route index element={<DocTypeList />} />
                <Route path=":doctype" element={<DocTypeShow />} />
              </Route>
            </Route>
          </Routes>

          <DocumentTitleHandler />
          <UnsavedChangesNotifier />
        </Refine>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
