/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_ERPNEXT_API_URL?: string
  readonly VITE_ERPNEXT_API_KEY?: string
  readonly VITE_ERPNEXT_API_SECRET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}