export const API_URL = "http://127.0.0.1:8000/api";
export const BASE_URL = "http://127.0.0.1:8000";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function saveLogin(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("username", data.username);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem(CART_KEY);
}

// Use this for every API call after login: it adds the token automatically
export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Token ${token}`;
  return fetch(`${API_URL}${path}`, { ...options, headers });
}

export function formatPKR(n) {
  return "PKR " + Number(n).toLocaleString();
}

const CART_KEY = "enquiry_cart";

export function getCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-changed"));
}

export function addToCart(item, quantity) {
  const cart = getCart();
  const existing = cart.find((c) => c.id === item.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity,
    });
  }
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}