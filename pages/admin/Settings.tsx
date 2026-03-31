import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/Modal';
import { Alert } from '../../components/Alert';
import { storeApi } from '../../services/storeApi';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '' });
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [passwords, setPasswords] = useState({ current: '', next: '' });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [storeDefaults, setStoreDefaults] = useState({ storefrontName: 'AfriGlam', defaultMarket: 'Poland', supportEmail: 'support@afriglam.com' });
  const [saving, setSaving] = useState(false);
  const [alertState, setAlertState] = useState<{ isVisible: boolean; type: 'success' | 'error' | 'info'; message: string }>({
    isVisible: false, type: 'success', message: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id || !supabase) {
        setProfileLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, email, two_factor_enabled')
          .eq('id', user.id)
          .maybeSingle();
        const fullName = (data?.full_name ?? user.user_metadata?.full_name ?? user.email ?? '').trim();
        const parts = fullName ? fullName.split(/\s+/) : [];
        const firstName = parts[0] ?? '';
        const lastName = parts.slice(1).join(' ') ?? '';
        setProfile({
          firstName,
          lastName,
          email: (data?.email ?? user.email ?? '') as string,
        });
        setTwoFactorEnabled(Boolean((data as { two_factor_enabled?: boolean } | null)?.two_factor_enabled));
        setProfileImageUrl(user.user_metadata?.avatar_url ?? '');
      } finally {
        setProfileLoading(false);
      }
    };

    void loadProfile();
  }, [user?.id, user?.email, user?.user_metadata]);

  const handleSave = async () => {
    setIsConfirmModalOpen(false);
    setSaving(true);

    if (passwords.next && passwords.next.length < 8) {
      setAlertState({ isVisible: true, type: 'error', message: 'New password must be at least 8 characters.' });
      setSaving(false);
      return;
    }

    if (passwords.next && supabase) {
      const { error: pwdError } = await supabase.auth.updateUser({ password: passwords.next });
      if (pwdError) {
        setAlertState({ isVisible: true, type: 'error', message: pwdError.message ?? 'Password update failed.' });
        setSaving(false);
        return;
      }
      setPasswords({ current: '', next: '' });
    }

    const result = await storeApi.updateAdminSettings({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      twoFactorEnabled,
    });
    if (!result.ok) {
      setAlertState({ isVisible: true, type: 'error', message: result.error ?? 'Failed to update settings.' });
      setSaving(false);
      return;
    }
    setAlertState({ isVisible: true, type: 'success', message: 'Settings updated successfully.' });
    setSaving(false);
  };

  const uploadProfileImage = async (file: File) => {
    const response = await storeApi.uploadProductImage(file);
    if (!response.ok || !response.url) {
      setAlertState({ isVisible: true, type: 'error', message: response.error ?? 'Image upload failed.' });
      return;
    }
    setProfileImageUrl(response.url);
    setAlertState({ isVisible: true, type: 'success', message: 'Profile image updated.' });
  };

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-[1000px] mx-auto animate-fadeIn relative">
      <Alert
        isVisible={alertState.isVisible}
        type={alertState.type}
        message={alertState.message}
        onClose={() => setAlertState((prev) => ({ ...prev, isVisible: false }))}
      />

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your account preferences and store configurations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex-shrink-0 space-y-1">
          {[
            { id: 'profile', label: 'My Profile', icon: 'person' },
            { id: 'security', label: 'Security', icon: 'lock' },
            { id: 'notifications', label: 'Notifications', icon: 'notifications' },
            { id: 'store', label: 'Store Settings', icon: 'storefront' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-admin-primary/10 text-admin-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 p-6 lg:p-8 shadow-sm">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <img src={profileImageUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(([profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Admin'))} className="size-24 rounded-full object-cover border-4 border-slate-50 dark:border-slate-800" alt="Profile" />
                  <label className="absolute bottom-0 right-0 p-2 bg-admin-primary text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void uploadProfileImage(file);
                      }}
                    />
                  </label>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {profileLoading ? 'Loading...' : [profile.firstName, profile.lastName].filter(Boolean).join(' ') || user?.email || 'Admin'}
                  </h3>
                  <p className="text-slate-500 text-sm">Admin</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase text-slate-500">First Name</label>
                  <input type="text" value={profile.firstName} onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))} className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-admin-primary outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase text-slate-500">Last Name</label>
                  <input type="text" value={profile.lastName} onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))} className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-admin-primary outline-none" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-500">Email Address</label>
                  <input type="email" value={profile.email} onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))} className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-admin-primary outline-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Email and in-app notification preferences for order alerts, low stock, and booking updates.</p>
              <div className="space-y-3">
                {['Order alerts', 'Booking reminders', 'Inventory notices'].map((label) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-white/10 px-4 py-3">
                    <span className="text-sm text-slate-700 dark:text-slate-200">{label}</span>
                    <span className="text-xs text-slate-400">Coming soon</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'store' && (
            <div className="space-y-6">
              <h3 className="font-bold text-slate-900 dark:text-white">Store Settings</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Store defaults used by your team while managing the catalog and customer experience.</p>
              <div className="grid grid-cols-1 gap-4">
                <input value={storeDefaults.storefrontName} onChange={(e) => setStoreDefaults((prev) => ({ ...prev, storefrontName: e.target.value }))} className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5" placeholder="Storefront name" />
                <select value={storeDefaults.defaultMarket} onChange={(e) => setStoreDefaults((prev) => ({ ...prev, defaultMarket: e.target.value }))} className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5">
                  <option>Poland</option>
                  <option>Nigeria</option>
                </select>
                <input value={storeDefaults.supportEmail} onChange={(e) => setStoreDefaults((prev) => ({ ...prev, supportEmail: e.target.value }))} className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5" placeholder="Support email" />
              </div>
              <p className="text-xs text-slate-400">These fields are currently stored locally in fallback mode and can be connected to a dedicated settings table later.</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg flex gap-3">
                <span className="material-symbols-outlined text-amber-600 dark:text-amber-500">security</span>
                <div>
                  <h4 className="font-bold text-amber-900 dark:text-amber-100 text-sm">Two-Factor Authentication</h4>
                  <p className="text-xs text-amber-700 dark:text-amber-200/80 mt-1">Add an extra layer of security to your account by enabling 2FA.</p>
                </div>
                <button onClick={() => { setTwoFactorEnabled((prev) => !prev); setAlertState({ isVisible: true, type: 'info', message: !twoFactorEnabled ? '2FA will be enabled after save.' : '2FA will be disabled after save.' }); }} className="ml-auto text-xs font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-100 px-3 py-1 rounded hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors">
                  {twoFactorEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white">Change Password</h3>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase text-slate-500">Current Password</label>
                  <input type="password" value={passwords.current} onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))} className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-admin-primary outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase text-slate-500">New Password</label>
                  <input type="password" value={passwords.next} onChange={(e) => setPasswords((prev) => ({ ...prev, next: e.target.value }))} className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-admin-primary outline-none" />
                </div>
              </div>
            </div>
          )}

          <div className="pt-8 mt-8 border-t border-slate-100 dark:border-white/5 flex justify-end">
            <button disabled={saving} onClick={() => setIsConfirmModalOpen(true)} className="px-6 py-3 bg-admin-primary hover:bg-emerald-600 disabled:opacity-60 text-white font-bold rounded-lg shadow-lg shadow-admin-primary/20 transition-all active:scale-95">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Changes"
        actions={
          <>
            <button onClick={() => setIsConfirmModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm font-medium">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-admin-primary hover:bg-emerald-600 text-white transition-colors text-sm font-bold">Confirm Update</button>
          </>
        }
      >
        <p>Are you sure you want to save these changes to your profile? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default Settings;
