import React from 'react';
import {
  Settings as SettingsIcon,
  Close as CloseIcon,
  Brightness4 as DarkModeIcon,
  Translate as TranslateIcon,
  VolumeUp as VolumeIcon,
  Speed as SpeedIcon,
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

function Settings({ isOpen, onClose, settings, onSettingChange }) {
  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'ja-JP', name: 'Japanese' },
  ];

  const voiceOptions = [
    { value: 0.8, label: 'Slow' },
    { value: 1, label: 'Normal' },
    { value: 1.2, label: 'Fast' },
  ];

  return (
    <div className={`settings-panel ${isOpen ? 'open' : ''}`}>
      <div className="settings-header">
        <div className="settings-title">
          <SettingsIcon />
          <h2>Settings</h2>
        </div>
        <button className="close-button" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      <div className="settings-content">
        <section className="settings-section">
          <h3>Appearance</h3>
          <div className="setting-item">
            <div className="setting-label">
              <DarkModeIcon />
              <span>Dark Mode</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => onSettingChange('darkMode', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h3>Language & Voice</h3>
          <div className="setting-item">
            <div className="setting-label">
              <TranslateIcon />
              <span>Interface Language</span>
            </div>
            <select
              value={settings.language}
              onChange={(e) => onSettingChange('language', e.target.value)}
              className="select-input"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <VolumeIcon />
              <span>Auto-Speak Responses</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.autoSpeak}
                onChange={(e) => onSettingChange('autoSpeak', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-label">
              <SpeedIcon />
              <span>Voice Speed</span>
            </div>
            <select
              value={settings.voiceSpeed}
              onChange={(e) => onSettingChange('voiceSpeed', parseFloat(e.target.value))}
              className="select-input"
            >
              {voiceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="settings-section">
          <h3>Notifications</h3>
          <div className="setting-item">
            <div className="setting-label">
              <NotificationsIcon />
              <span>Desktop Notifications</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => onSettingChange('notifications', e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h3>Data & Privacy</h3>
          <button 
            className="danger-button"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
                onSettingChange('clearHistory', true);
              }
            }}
          >
            <DeleteIcon />
            Clear Chat History
          </button>
        </section>
      </div>
    </div>
  );
}

export default Settings; 