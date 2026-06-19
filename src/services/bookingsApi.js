const API_BASE = "/api";

// Helper parse JSON safely
const parseJsonSafely = async (res) => {
  const text = await res.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Invalid JSON:", text);
    throw new Error("Server returned invalid JSON");
  }
};

export const bookingsApi = {
  // Get bookings by user
  getAll: async (userId, token) => {
    const res = await fetch(`${API_BASE}/bookings?userId=${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await parseJsonSafely(res);

    if (!res.ok) {
      throw new Error(json?.message || "Failed to fetch bookings");
    }

    return json?.data || [];
  },

  // Get single booking by booking_id
  getById: async (bookingId) => {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}`);

    const json = await parseJsonSafely(res);

    if (!res.ok) {
      throw new Error(json?.message || "Failed to fetch booking");
    }

    return json?.data;
  },

  // Create booking
  create: async (bookingData) => {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    const json = await parseJsonSafely(res);

    if (!res.ok) {
      throw new Error(json?.message || "Failed to create booking");
    }

    return json?.data;
  },

  // Mark booking as paid
  markAsPaid: async (bookingId) => {
    const res = await fetch(`${API_BASE}/bookings/${bookingId}/pay`, {
      method: "PUT",
    });

    const json = await parseJsonSafely(res);

    if (!res.ok) {
      throw new Error(json?.message || "Failed to update payment");
    }

    return json?.data;
  },
};