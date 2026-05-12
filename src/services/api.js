const API_BASE = '/api';

// ── Hotel API Service ──
export const hotelApi = {
  // Get all hotels
  getAll: async () => {
    const res = await fetch(`${API_BASE}/hotels`);
    if (!res.ok) throw new Error('Failed to fetch hotels');
    const json = await res.json();
    return json.data;
  },

  // Get hotel by ID
  getById: async (id) => {
    const res = await fetch(`${API_BASE}/hotels/${id}`);
    if (!res.ok) throw new Error('Failed to fetch hotel');
    const json = await res.json();
    return json.data;
  },

  // Create a new hotel
  create: async (hotelData) => {
    const res = await fetch(`${API_BASE}/hotels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hotelData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create hotel');
    }
    const json = await res.json();
    return json.data;
  },

  // Update a hotel
  update: async (id, hotelData) => {
    const res = await fetch(`${API_BASE}/hotels/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hotelData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update hotel');
    }
    const json = await res.json();
    return json.data;
  },

  // Delete a hotel
  delete: async (id) => {
    const res = await fetch(`${API_BASE}/hotels/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete hotel');
    return true;
  },

  /**
   * Upload an image with automatic retry on transient failures.
   * Retries up to 2 times with 1-second delay between attempts.
   */
  uploadImage: async (file, onProgress) => {
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
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Upload failed' }));
          throw new Error(err.error || `Upload failed (${res.status})`);
        }
        const json = await res.json();
        return json.data.url;
      } catch (err) {
        lastError = err;
        const isLastAttempt = attempt === MAX_RETRIES;
        if (!isLastAttempt) {
          console.warn(`[uploadImage] Attempt ${attempt + 1} failed, retrying in 1s...`, err.message);
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }

    throw lastError;
  },
};
