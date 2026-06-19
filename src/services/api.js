const API_BASE = '/api';

// Helper parse JSON safely
const parseJsonSafely = async (res) => {
  const text = await res.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error('Invalid JSON:', text);
    throw new Error('Server returned invalid JSON');
  }
};

// ── Hotel API Service ──
export const hotelApi = {
  // Get all hotels
  getAll: async () => {
    const res = await fetch(`${API_BASE}/hotels`);

    if (!res.ok) throw new Error('Failed to fetch hotels');

    const json = await parseJsonSafely(res);

    return json?.data || [];
  },

  // Get hotel by ID
  getById: async (id) => {
    const res = await fetch(`${API_BASE}/hotels/${id}`);

    if (!res.ok) throw new Error('Failed to fetch hotel');

    const json = await parseJsonSafely(res);

    return json?.data;
  },

  // Create hotel
  create: async (hotelData) => {
    const res = await fetch(`${API_BASE}/hotels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hotelData),
    });

    const json = await parseJsonSafely(res);

    if (!res.ok) {
      throw new Error(json?.error || 'Failed to create hotel');
    }

    return json?.data;
  },

  // Update hotel
  update: async (id, hotelData) => {
    const res = await fetch(`${API_BASE}/hotels/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hotelData),
    });

    const json = await parseJsonSafely(res);

    if (!res.ok) {
      throw new Error(json?.error || 'Failed to update hotel');
    }

    return json?.data;
  },
  // Create rooms
  createRooms: async (roomsData) => {
    const res = await fetch(`${API_BASE}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roomsData),
    });

    const json = await parseJsonSafely(res);

    if (!res.ok) {
      throw new Error(json?.error || 'Failed to create rooms');
    }

    return json?.data;
  },

  // Delete hotel
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/hotels/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Failed to delete hotel');
    }

    return true;
  },

  // Upload image
  uploadImage: async (file) => {
    const MAX_RETRIES = 2;

    let lastError;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const formData = new FormData();

        formData.append('image', file);

        const res = await fetch(`${API_BASE}/upload`, {
          method: 'POST',
          body: formData,
        });

        const json = await parseJsonSafely(res);

        if (!res.ok) {
          throw new Error(
            json?.error || `Upload failed (${res.status})`
          );
        }

        return json?.data?.url;
      } catch (err) {
        lastError = err;

        const isLastAttempt = attempt === MAX_RETRIES;

        if (!isLastAttempt) {
          console.warn(
            `[uploadImage] Attempt ${
              attempt + 1
            } failed, retrying...`
          );

          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }

    throw lastError;
  },
};