import axios from "axios";

// creating an instance of axios
export const http = axios.create({
    baseURL: "https://braincache-vdfm.onrender.com/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})

// request interceptor for logging purpose only.
http.interceptors.request.use(
    (config) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data
        });

        return config;
    },

    (error) => {
        console.log(`[API] Request error: ${error}`);

        return Promise.reject(error);
    }
)

// response interceptor for logging purpose only.
http.interceptors.response.use(
    (response) => {
        console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} ${response.status}`, {
            data: response.data
        });

        return response;
    },

    (error) => {
        // for detecting network errors
        if(!error.response) {
            console.log("[API] Network error: Server unreachable")
        }

        // for detecting connection timeout error
        if(error.code === "ECONNABORTED") {
            console.log("[API] Timeout error: ", error.message)
        }

        const errorDetails = {
            message: error.message,
            config: {
                method: error.config?.method,
                url: error.config?.url,
                data: error.config?.data
            },
            response: error.response ? {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            } : null
        }

        console.log("[API] Response error:", errorDetails);

        return Promise.reject(error);
    }
)