const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleResponse = async (res) => {
    if (!res.ok) throw new Error(await res.text());
    return res.json();
};

// ========== AUTH ==========

export const login = (data) =>
    fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    }).then(handleResponse);

export const register = (data) =>
    fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    }).then(handleResponse);

export const logout = () =>
    fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    }).then(handleResponse);

// ========== POSTS ==========

export const getAllPosts = () =>
    fetch(`${BASE_URL}/api/post`, {
        credentials: 'include',
    }).then(handleResponse);

export const createPost = (data) =>
    fetch(`${BASE_URL}/api/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    }).then(handleResponse);

export const updatePost = (postId, data) =>
    fetch(`${BASE_URL}/api/post/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    }).then(handleResponse);

export const deletePost = (postId) =>
    fetch(`${BASE_URL}/api/post/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
    }).then(handleResponse);

// ========== MESSAGES ==========

export const sendMessage = (data) =>
    fetch(`${BASE_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    }).then(handleResponse);

export const getMessages = (userId) =>
    fetch(`${BASE_URL}/api/messages/${userId}`, {
        credentials: 'include',
    }).then(handleResponse);

// ========== PAYMENTS ==========

export const createPaymentIntent = (data) =>
    fetch(`${BASE_URL}/api/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
    }).then(handleResponse);

export const confirmPayment = (paymentId) =>
    fetch(`${BASE_URL}/api/confirm-payment/${paymentId}`, {
        method: 'POST',
        credentials: 'include',
    }).then(handleResponse);