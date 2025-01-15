import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Bell, Moon, Globe, Shield, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import Button from './ui/Button';

const CustomerSettings = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    orderUpdates: true,
    promotions: false
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    language: 'English',
    currency: 'USD'
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showOrderHistory: true
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your account preferences and settings</p>
      </div>

      {/* Notifications Settings */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <Button
                variant={value ? 'default' : 'outline'}
                onClick={() => toggleNotification(key)}
                className={value ? 'bg-blue-500 hover:bg-blue-600' : ''}
              >
                {value ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-500" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-gray-500" />
              <span>Dark Mode</span>
            </div>
            <Button
              variant={preferences.darkMode ? 'default' : 'outline'}
              onClick={() => setPreferences(prev => ({ ...prev, darkMode: !prev.darkMode }))}
              className={preferences.darkMode ? 'bg-purple-500 hover:bg-purple-600' : ''}
            >
              {preferences.darkMode ? 'On' : 'Off'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Language</span>
            <select 
              value={preferences.language}
              onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
              className="px-3 py-1.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span>Currency</span>
            <select 
              value={preferences.currency}
              onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
              className="px-3 py-1.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-gray-500" />
              <span>Profile Visibility</span>
            </div>
            <select 
              value={privacy.profileVisibility}
              onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
              className="px-3 py-1.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-gray-500" />
              <span>Show Order History</span>
            </div>
            <Button
              variant={privacy.showOrderHistory ? 'default' : 'outline'}
              onClick={() => setPrivacy(prev => ({ ...prev, showOrderHistory: !prev.showOrderHistory }))}
              className={privacy.showOrderHistory ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              {privacy.showOrderHistory ? 'Visible' : 'Hidden'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerSettings; 