"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Edit, Trash2, Settings as SettingsIcon } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings || []);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: number) => {
    try {
      const setting = settings.find((s) => s.id === id);
      if (!setting) return;

      const response = await fetch(`/api/admin/settings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          setting_value: editValue,
        }),
      });

      if (response.ok) {
        setEditing(null);
        fetchSettings();
      }
    } catch (error) {
      console.error("Error updating setting:", error);
      alert("Failed to update setting");
    }
  };

  const handleAdd = async () => {
    if (!newKey.trim()) {
      alert("Setting key is required");
      return;
    }

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          setting_key: newKey,
          setting_value: newValue,
          setting_type: "text",
        }),
      });

      if (response.ok) {
        setNewKey("");
        setNewValue("");
        setShowAddForm(false);
        fetchSettings();
      }
    } catch (error) {
      console.error("Error adding setting:", error);
      alert("Failed to add setting");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;

    try {
      const response = await fetch(`/api/admin/settings/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSettings();
      }
    } catch (error) {
      console.error("Error deleting setting:", error);
      alert("Failed to delete setting");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Setting
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Setting</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key
              </label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="setting_key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Value
              </label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Setting value"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAdd}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Key
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {settings.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No settings found
                </td>
              </tr>
            ) : (
              settings.map((setting) => (
                <tr key={setting.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {setting.setting_key}
                    </div>
                    {setting.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {setting.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editing === setting.id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        autoFocus
                      />
                    ) : (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {setting.setting_value || <span className="text-gray-400">(empty)</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {setting.setting_type}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {editing === setting.id ? (
                      <button
                        onClick={() => handleSave(setting.id)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-2"
                      >
                        <Save className="w-5 h-5 inline" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditing(setting.id);
                          setEditValue(setting.setting_value || "");
                        }}
                        className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 mr-2"
                      >
                        <Edit className="w-5 h-5 inline" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(setting.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



