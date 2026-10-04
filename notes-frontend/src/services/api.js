/**
 * API Service for Notes Application
 * Centralizes all HTTP requests to the backend server.
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Helper function to retrieve the stored JWT authentication token.
 * @returns {string|null} JWT token or null
 */
const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Core HTTP request handler that manages headers, token injection,
 * JSON parsing, and consistent user-friendly error formatting.
 *
 * @param {string} endpoint - API path (e.g., '/notes')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} Parsed JSON response
 */
async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Automatically attach JWT token for authenticated requests if available
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized globally
    if (response.status === 401) {
      // Clear expired credentials
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Notify application of unauthorized state
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));

      // For login attempts, return specific failure; for protected routes, session expired
      let errorMsg = "Session expired. Please login again.";
      try {
        const errorData = await response.json();
        if (errorData?.error) {
          errorMsg = errorData.error;
        }
      } catch {
        // Fallback to default 401 message
      }

      const err = new Error(errorMsg);
      err.status = 401;
      throw err;
    }

    // Try parsing response as JSON
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // If HTTP status is not ok (200-299), throw customized user-friendly error
    if (!response.ok) {
      const status = response.status;
      let userFriendlyMessage = "An unexpected error occurred. Please try again.";

      // Extract backend error message if available
      const backendMessage = typeof data === "object" && data !== null ? data.error || data.message : null;

      if (status === 400) {
        userFriendlyMessage = backendMessage || "Invalid request. Please check your input.";
      } else if (status === 404) {
        userFriendlyMessage = backendMessage || "Requested resource not found.";
      } else if (status === 409) {
        userFriendlyMessage = "Email already registered.";
      } else if (status === 500) {
        userFriendlyMessage = "Server error. Please try again later.";
      } else if (backendMessage) {
        userFriendlyMessage = backendMessage;
      }

      const error = new Error(userFriendlyMessage);
      error.status = status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If it's already an error created above with a status, rethrow it
    if (error.status) {
      throw error;
    }

    // Handle network / CORS failures gracefully
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      const networkError = new Error(
        `Unable to connect to the backend server at ${API_URL}. Please ensure the backend is running and CORS is enabled.`
      );
      networkError.status = 0;
      throw networkError;
    }

    throw error;
  }
}

/**
 * Sign up a new user account.
 * POST /user/signup
 * Request: { name, email, password }
 */
export async function signupUser(name, email, password) {
  return request("/user/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

/**
 * Log in an existing user.
 * POST /user/login
 * Request: { email, password }
 */
export async function loginUser(email, password) {
  return request("/user/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Fetch authenticated user dashboard info.
 * GET /user/dashboard
 */
export async function getDashboard() {
  return request("/user/dashboard", {
    method: "GET",
  });
}

/**
 * Fetch all notes created by the authenticated user.
 * GET /notes
 */
export async function getNotes() {
  return request("/notes", {
    method: "GET",
  });
}

/**
 * Search notes by title or content.
 * GET /notes?search=${encodeURIComponent(searchTerm)}
 *
 * @param {string} searchTerm - User query to search for
 */
export async function searchNotes(searchTerm) {
  const query = encodeURIComponent(searchTerm.trim());
  return request(`/notes?search=${query}`, {
    method: "GET",
  });
}

/**
 * Fetch a single note by ID.
 * GET /notes/:id
 *
 * @param {string} id - Note ID
 */
export async function getSingleNote(id) {
  return request(`/notes/${id}`, {
    method: "GET",
  });
}

/**
 * Create a new note.
 * POST /notes
 * Request: { title, content }
 *
 * @param {object} noteData - { title, content }
 */
export async function createNote(noteData) {
  return request("/notes", {
    method: "POST",
    body: JSON.stringify(noteData),
  });
}

/**
 * Update an existing note by ID.
 * PUT /notes/:id
 * Request: { title, content }
 *
 * @param {string} id - Note ID
 * @param {object} noteData - { title, content }
 */
export async function updateNote(id, noteData) {
  return request(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(noteData),
  });
}

/**
 * Delete a note by ID.
 * DELETE /notes/:id
 *
 * @param {string} id - Note ID
 */
export async function deleteNote(id) {
  return request(`/notes/${id}`, {
    method: "DELETE",
  });
}

export default {
  signupUser,
  loginUser,
  getDashboard,
  getNotes,
  searchNotes,
  getSingleNote,
  createNote,
  updateNote,
  deleteNote,
};
