// components/Settings.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  HelpCircle,
  LogOut,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Trash2,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";
import { logout, updateUserProfile } from "../../features/auth/authSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, profileLoading } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  const userData = user?.profile || user;

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "privacy", name: "Privacy & Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "appearance", name: "Appearance", icon: Palette },
    { id: "language", name: "Language & Region", icon: Globe },
    { id: "help", name: "Help & Support", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="md:w-64 bg-gray-50 border-r border-gray-200">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.name}
                    </button>
                  );
                })}

                {/* Logout Button */}
                <button
                  onClick={() => {
                    dispatch(logout());
                    navigate("/login");
                    toast.success("Logged out successfully");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-8"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {/* Profile Settings */}
              {activeTab === "profile" && (
                <ProfileSettings userData={userData} loading={profileLoading} />
              )}

              {/* Privacy & Security */}
              {activeTab === "privacy" && (
                <PrivacySecurity userData={userData} />
              )}

              {/* Notifications */}
              {activeTab === "notifications" && <NotificationSettings />}

              {/* Appearance */}
              {activeTab === "appearance" && <AppearanceSettings />}

              {/* Language & Region */}
              {activeTab === "language" && <LanguageRegion />}

              {/* Help & Support */}
              {activeTab === "help" && <HelpSupport />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Settings Component
const ProfileSettings = ({ userData, loading }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    bio: userData?.bio || "",
    website: userData?.website || "",
    location: userData?.location || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(form)).unwrap();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Profile Settings
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your city or country"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() =>
              setForm({
                username: userData?.username || "",
                email: userData?.email || "",
                bio: userData?.bio || "",
                website: userData?.website || "",
                location: userData?.location || "",
              })
            }
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

// Privacy & Security Component
const PrivacySecurity = ({ userData }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public", // public, private, followers
    emailVisibility: false,
    showOnlineStatus: true,
    allowMessages: "everyone", // everyone, followers, none
    searchEngineIndexing: true,
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // Implement password change logic
    toast.success("Password updated successfully");
    setShowPasswordForm(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Privacy & Security
      </h2>
      <div className="space-y-8 max-w-2xl">
        {/* Password Change */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Password</h3>
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Privacy Settings */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Privacy Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Profile Visibility
                </label>
                <p className="text-sm text-gray-500">
                  Who can see your profile
                </p>
              </div>
              <select
                value={privacySettings.profileVisibility}
                onChange={(e) =>
                  setPrivacySettings({
                    ...privacySettings,
                    profileVisibility: e.target.value,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="followers">Followers Only</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Show Email
                </label>
                <p className="text-sm text-gray-500">
                  Display your email on profile
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.emailVisibility}
                onChange={(e) =>
                  setPrivacySettings({
                    ...privacySettings,
                    emailVisibility: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Online Status
                </label>
                <p className="text-sm text-gray-500">Show when you're online</p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.showOnlineStatus}
                onChange={(e) =>
                  setPrivacySettings({
                    ...privacySettings,
                    showOnlineStatus: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Account Deletion */}
        <div>
          <h3 className="text-lg font-semibold text-red-900 mb-4">
            Danger Zone
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-800">Delete Account</h4>
                <p className="text-sm text-red-600">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Settings Component
const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    email: {
      newFollower: true,
      newComment: true,
      blogLikes: true,
      blogBookmarks: false,
      announcements: true,
    },
    push: {
      newFollower: true,
      newComment: false,
      blogLikes: true,
      directMessages: true,
    },
    inApp: {
      newFollower: true,
      newComment: true,
      blogLikes: true,
      blogBookmarks: true,
    },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Notification Settings
      </h2>
      <div className="space-y-8 max-w-2xl">
        {/* Email Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Notifications
          </h3>
          <div className="space-y-3">
            {Object.entries(notifications.email).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                </label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      email: {
                        ...notifications.email,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Push Notifications
          </h3>
          <div className="space-y-3">
            {Object.entries(notifications.push).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                </label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      push: { ...notifications.push, [key]: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Appearance Settings Component
const AppearanceSettings = () => {
  const [appearance, setAppearance] = useState({
    theme: "light", // light, dark, system
    fontSize: "medium", // small, medium, large
    density: "comfortable", // compact, comfortable
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Appearance</h2>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">Theme</label>
            <p className="text-sm text-gray-500">Choose your preferred theme</p>
          </div>
          <select
            value={appearance.theme}
            onChange={(e) =>
              setAppearance({ ...appearance, theme: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Font Size
            </label>
            <p className="text-sm text-gray-500">Adjust the text size</p>
          </div>
          <select
            value={appearance.fontSize}
            onChange={(e) =>
              setAppearance({ ...appearance, fontSize: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Layout Density
            </label>
            <p className="text-sm text-gray-500">
              Control the spacing of elements
            </p>
          </div>
          <select
            value={appearance.density}
            onChange={(e) =>
              setAppearance({ ...appearance, density: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Language & Region Component
const LanguageRegion = () => {
  const [settings, setSettings] = useState({
    language: "en",
    region: "US",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Language & Region
      </h2>
      <div className="space-y-6 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Language
            </label>
            <p className="text-sm text-gray-500">
              Choose your preferred language
            </p>
          </div>
          <select
            value={settings.language}
            onChange={(e) =>
              setSettings({ ...settings, language: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Timezone
            </label>
            <p className="text-sm text-gray-500">Set your local timezone</p>
          </div>
          <select
            value={settings.timezone}
            onChange={(e) =>
              setSettings({ ...settings, timezone: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Date Format
            </label>
            <p className="text-sm text-gray-500">How dates are displayed</p>
          </div>
          <select
            value={settings.dateFormat}
            onChange={(e) =>
              setSettings({ ...settings, dateFormat: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Help & Support Component
const HelpSupport = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Help & Support</h2>
      <div className="space-y-6 max-w-2xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <HelpCircle className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Help Center</h3>
            <p className="text-sm text-gray-600 mb-4">
              Find answers to frequently asked questions
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Visit Help Center
            </button>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <Mail className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Contact Support
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Get help from our support team
            </p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Contact Us
            </button>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Data Management</h3>
          <div className="space-y-3">
            <button className="flex items-center gap-3 w-full p-3 text-left hover:bg-white rounded-lg transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">Export Data</div>
                <div className="text-sm text-gray-600">
                  Download a copy of your data
                </div>
              </div>
            </button>

            <button className="flex items-center gap-3 w-full p-3 text-left hover:bg-white rounded-lg transition-colors">
              <Trash2 className="w-5 h-5 text-red-600" />
              <div>
                <div className="font-medium text-red-900">Delete Account</div>
                <div className="text-sm text-red-600">
                  Permanently delete your account
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>App Version: 1.0.0</p>
          <p className="mt-1">© 2024 CAMPOST. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
