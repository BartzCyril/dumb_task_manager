export const api = async (method, action, body, params = "", headers = {}) => {
    const payload = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    };

    if (method !== "GET" && method !== "DELETE") {
        payload.body = JSON.stringify(body);
    }

    const response = await fetch(`${action}${params}`, payload);

    const contentType = response.headers.get("Content-Type");
    let responseJson;
    if (contentType && contentType.includes("application/json")) {
        responseJson = await response.json();
    } else {
        responseJson = null;
    }

    if (response.ok) {
        return responseJson;
    } else {
        throw new Error(responseJson?.message || "Unknown error occurred");
    }
};
