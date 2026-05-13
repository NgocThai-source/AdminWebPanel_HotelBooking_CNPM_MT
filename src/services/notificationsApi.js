const API_BASE = '/api';

export const notificationsApi = {
  sendByEmail: async ({ email, title, body }) => {
    const res = await fetch(`${API_BASE}/notifications/send-by-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, title, body }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to send notification');
    }
    return json.data;
  },

  sendByUserId: async ({ userId, title, body }) => {
    const res = await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        type: 'ADMIN_MESSAGE',
        title,
        body,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to send notification');
    }
    return json.data;
  },

  getAllUsers: async () => {
    const res = await fetch(`${API_BASE}/notifications/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    const json = await res.json();
    return json.data || [];
  },

  getAll: async (userId) => {
    const res = await fetch(`${API_BASE}/notifications?user_id=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    const json = await res.json();
    return json.data || [];
  },

  getUnreadCount: async (userId) => {
    const res = await fetch(`${API_BASE}/notifications/unread-count?user_id=${encodeURIComponent(userId)}`);
    if (!res.ok) throw new Error('Failed to fetch unread count');
    const json = await res.json();
    return json.count || 0;
  },

  markAsRead: async (notificationId) => {
    const res = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to mark as read');
    return true;
  },

  markAllAsRead: async (userId) => {
    const res = await fetch(`${API_BASE}/notifications/read-all?user_id=${encodeURIComponent(userId)}`, {
      method: 'PUT',
    });
    if (!res.ok) throw new Error('Failed to mark all as read');
    return true;
  },
};
