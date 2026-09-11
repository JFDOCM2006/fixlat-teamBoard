const API_URL = "http://localhost:3000/api";

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  const data = await response.json();

  // Usuario desactivado o sesión no autorizada
  if (response.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";

    throw new Error(
      data.message || "Tu usuario no tiene acceso al sistema"
    );
  }

  // Token inválido o expirado
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";

    throw new Error(
      data.message || "Tu sesión ha expirado"
    );
  }

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición");
  }

  return data;
};