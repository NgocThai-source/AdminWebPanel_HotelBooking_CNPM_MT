import { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsApi } from '../services/settingsApi';
import Sidebar from '../components/Sidebar';
import './DashboardPage.css';

const EXCHANGE_RATE_KEY = 'exchange_rate_usd_to_vnd';

export default function SettingsPage({ onLogout }) {
  const [exchangeRate, setExchangeRate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsApi.getAll();
      if (res.success && res.data && res.data[EXCHANGE_RATE_KEY]) {
        setExchangeRate(res.data[EXCHANGE_RATE_KEY]);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
      toast.error('Failed to load settings. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const rate = parseFloat(exchangeRate);
    if (isNaN(rate) || rate <= 0) {
      toast.error('Please enter a valid exchange rate greater than 0');
      return;
    }

    try {
      setSaving(true);
      await settingsApi.update(EXCHANGE_RATE_KEY, String(rate));
      toast.success('Exchange rate saved successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save exchange rate');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar onLogout={onLogout} />

      {/* Main Content */}
      <main className="main-content page-enter">
        {/* Header */}
        <header className="dash-header">
          <div>
            <h1 className="dash-title">Settings</h1>
            <p className="dash-subtitle">Configure application-wide settings</p>
          </div>
          <div className="dash-header-actions">
            <button onClick={loadSettings} className="btn-icon" title="Refresh" disabled={loading}>
              <RefreshCw size={18} className={loading ? 'spin-animation' : ''} />
            </button>
          </div>
        </header>

        {/* Settings Section */}
        <div className="hotels-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="section-header">
            <h2 className="section-title">Currency Settings</h2>
          </div>

          <div className="settings-card">
            {loading ? (
              <div className="loading-grid">
                {[1, 2].map((i) => (
                  <div key={i} className="skeleton-card" style={{ height: '100px' }}>
                    <div className="skeleton-body">
                      <div className="skeleton skeleton--title" />
                      <div className="skeleton skeleton--text" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="settings-section">
                <div className="settings-row">
                  <div className="settings-label-group">
                    <div className="settings-icon-wrap">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <h3 className="settings-label">Exchange Rate (USD to VND)</h3>
                      <p className="settings-description">
                        Set the USD to VND conversion rate used for displaying prices in the mobile app.
                        Example: 26000 means 1 USD = 26,000 VND.
                      </p>
                    </div>
                  </div>
                  <div className="settings-control">
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-input settings-input"
                        value={exchangeRate}
                        onChange={(e) => setExchangeRate(e.target.value)}
                        placeholder="e.g. 26000"
                        min="1"
                        step="100"
                      />
                      <span className="input-suffix">VND</span>
                    </div>
                  </div>
                </div>

                <div className="settings-actions">
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                    disabled={saving || !exchangeRate}
                  >
                    {saving ? (
                      <RefreshCw size={18} className="spin-animation" />
                    ) : (
                      <Save size={18} />
                    )}
                    <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                  </button>
                </div>

                {exchangeRate && (
                  <div className="settings-preview">
                    <p className="settings-preview-label">Preview</p>
                    <div className="settings-preview-grid">
                      <div className="settings-preview-item">
                        <span className="settings-preview-amount">$1</span>
                        <span className="settings-preview-arrow">=</span>
                        <span className="settings-preview-amount settings-preview-amount--vnd">
                          {(1 * parseFloat(exchangeRate)).toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                      <div className="settings-preview-item">
                        <span className="settings-preview-amount">$12</span>
                        <span className="settings-preview-arrow">=</span>
                        <span className="settings-preview-amount settings-preview-amount--vnd">
                          {(12 * parseFloat(exchangeRate)).toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                      <div className="settings-preview-item">
                        <span className="settings-preview-amount">$100</span>
                        <span className="settings-preview-arrow">=</span>
                        <span className="settings-preview-amount settings-preview-amount--vnd">
                          {(100 * parseFloat(exchangeRate)).toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
