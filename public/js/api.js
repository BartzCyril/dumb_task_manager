export const api = async (method, action, body, params = "", headers = {}) => {
    const payload = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    };

    if (method !== "GET") {
        payload.body = JSON.stringify(body);
    }

    const response = await fetch(`${action}${params}`, payload);
    const responseJson = await response.json();
    if (response.ok) {
        return responseJson;
    } else {
        throw new Error(responseJson.message);
    }
};
