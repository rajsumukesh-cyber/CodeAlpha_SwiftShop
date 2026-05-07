import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, MapPin, Plus, Trash2, Save, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileProps {
  user: UserProfile;
  onUpdate: (updated: UserProfile) => void;
}

export default function Profile({ user, onUpdate }: ProfileProps) {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const addAddress = () => {
    setFormData({
      ...formData,
      addresses: [...formData.addresses, '']
    });
  };

  const updateAddress = (index: number, value: string) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index] = value;
    setFormData({ ...formData, addresses: newAddresses });
  };

  const removeAddress = (index: number) => {
    const newAddresses = formData.addresses.filter((_, i) => i !== index);
    setFormData({ ...formData, addresses: newAddresses });
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 dark:text-white">My Account</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Manage your persona information and shipping preferences.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg"
          >
            Edit Profile
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-4 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-2xl flex items-center gap-3 border border-green-100 dark:border-green-900"
          >
            <CheckCircle2 size={20} />
            <span className="font-bold text-sm">Account updated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {/* Personal Info */}
        <section className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-50 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-neutral-400">
              <User size={14} className="text-black dark:text-white" />
              Personal Information
            </h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest pl-1">Full Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:text-white"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-lg font-medium pl-1 dark:text-white">{user.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest pl-1">Email Address</label>
                {isEditing ? (
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:text-white"
                    placeholder="your@email.com"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-lg font-medium pl-1 text-neutral-600 dark:text-neutral-400">
                    <Mail size={16} />
                    {user.email}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Shipping Addresses */}
        <section className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-50 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/50 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-neutral-400">
              <MapPin size={14} className="text-black dark:text-white" />
              Saved Addresses
            </h2>
            {isEditing && (
              <button 
                onClick={addAddress}
                className="flex items-center gap-1.5 text-xs font-bold text-black dark:text-white border border-black/10 dark:border-white/10 px-3 py-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                <Plus size={14} /> Add New
              </button>
            )}
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {isEditing ? (
                formData.addresses.map((addr, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="flex-grow">
                      <textarea 
                        value={addr}
                        onChange={(e) => updateAddress(idx, e.target.value)}
                        className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:text-white min-h-[80px]"
                        placeholder="Street address, City, State, ZIP"
                      />
                    </div>
                    <button 
                      onClick={() => removeAddress(idx)}
                      className="self-start p-3 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              ) : (
                user.addresses.length > 0 ? (
                  user.addresses.map((addr, idx) => (
                    <div key={idx} className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl flex items-start gap-4">
                      <div className="p-2 bg-white dark:bg-neutral-700 rounded-lg shadow-sm">
                        <MapPin size={16} className="text-neutral-400 dark:text-neutral-500" />
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{addr}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 italic py-4">No addresses saved yet.</p>
                )
              )}
            </div>
          </div>
        </section>

        {isEditing && (
          <div className="flex items-center justify-end gap-4 mt-8">
            <button 
              onClick={() => {
                setFormData(user);
                setIsEditing(false);
              }}
              className="px-6 py-3 text-sm font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-bold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-xl"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
