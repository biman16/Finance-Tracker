export const API_BASE_URL = "https://etracker-backend-biman.onrender.com/api/v1";

export const API_PATHS = {
    AUTH: {
        REGISTER: `${API_BASE_URL}/auth/register`,
        LOGIN: `${API_BASE_URL}/auth/login`,
        GET_USER: `${API_BASE_URL}/auth/getUser`,
        UPLOAD_IMAGE: `${API_BASE_URL}/auth/upload-image`,
    },
    INCOME: {
        ADD_INCOME: `${API_BASE_URL}/income/add`,
        GET_ALL_INCOME: `${API_BASE_URL}/income/get`,
        DOWNLOAD_INCOME_PDF: `${API_BASE_URL}/income/downloadpdf`,
        DELETE_INCOME: (incomeId) => `${API_BASE_URL}/income/${incomeId}`,
    },
    EXPENSE: {
        ADD_EXPENSE: `${API_BASE_URL}/expense/add`,
        GET_ALL_EXPENSE: `${API_BASE_URL}/expense/get`,
        DOWNLOAD_EXPENSE_PDF: `${API_BASE_URL}/expense/downloadpdf`,
        DELETE_EXPENSE: (expenseId) => `${API_BASE_URL}/expense/${expenseId}`,
    },
    DASHBOARD: {
        GET_DASHBOARD_DATA: `${API_BASE_URL}/dashboard`,
    },
    AI: {
        GENERATE_RESPONSE: `${API_BASE_URL}/ai/chat`,
    },
};
