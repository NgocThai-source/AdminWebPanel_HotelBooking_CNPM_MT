const API_BASE = '/api';

// ── Settings API Service ──
export const settingsApi = {
  // Get all settings
  getAll: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    const json = await res.json();
    return json;
  },

  // Update a setting
  update: async (key, value) => {
    const res = await fetch(`${API_BASE}/settings/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update setting');
    }
    const json = await res.json();
    return json;
  },
};
