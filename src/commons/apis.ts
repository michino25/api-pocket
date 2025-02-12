export const API_ROUTES = {
  AUTH: {
    SIGNUP: "/auth/signup",
  },

  DATA_TABLE: {
    LIST: (tableId: string) => `/data/${tableId}`,
    DETAIL: (tableId: string, dataId: string) => `/data/${tableId}/${dataId}`,
    EXPORT_EXCEL: (tableId: string) => `/data/${tableId}/export-excel`,
  },

  SCHEMA: {
    LIST: "/schema",
    DETAIL: (tableId: string) => `/schema/${tableId}`,
  },
};

export default API_ROUTES;
