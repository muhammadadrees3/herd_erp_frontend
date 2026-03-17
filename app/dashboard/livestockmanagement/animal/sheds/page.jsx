"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import axiosInstance from '../../../../../utils/axios';
import {
  Home, Search, Filter, Plus, Eye, Edit, Trash2, ChevronDown, X
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const API_URL = '/sheds';

export default function ShedsManagement() {
  const { isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showShedForm, setShowShedForm] = useState(false);
  const [editingShed, setEditingShed] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewingShed, setViewingShed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    status: 'active',
    farmLocation: ''
  });
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const [sheds, setSheds] = useState([]);

  // Normalize shed data
  const normalizeShed = (shed) => {
    return {
      id: shed.id,
      shedName: shed.shedName || shed.name || '',
      name: shed.shedName || shed.name || '',
      capacity: shed.capacity || 0,
      status: shed.status || 'active',
      farmLocation: shed.farmLocation || '',
      createdAt: shed.createdAt || new Date().toISOString(),
      createdDate: shed.createdAt ? new Date(shed.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
    };
  };

  // Fetch sheds
  const fetchSheds = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(API_URL);
      if (response.data && response.data.success) {
        const fetchedSheds = (response.data.data || []).map(normalizeShed);
        setSheds(fetchedSheds);
        localStorage.setItem('livestockSheds', JSON.stringify(fetchedSheds));
      } else if (Array.isArray(response.data)) {
        const fetchedSheds = response.data.map(normalizeShed);
        setSheds(fetchedSheds);
        localStorage.setItem('livestockSheds', JSON.stringify(fetchedSheds));
      } else {
        console.warn("Unexpected API response format:", response.data);
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("❌ Fetch sheds error:", error);
      setError('Failed to fetch sheds');
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Load from localStorage as fallback
  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('livestockSheds');
      if (stored) {
        try {
          setSheds(JSON.parse(stored));
        } catch (e) {
          setSheds([]);
        }
      }
    }
  };

  useEffect(() => {
    fetchSheds();
  }, []);

  useEffect(() => {
    if (sheds.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('livestockSheds', JSON.stringify(sheds));
    }
  }, [sheds]);

  // Filters
  const filteredSheds = sheds.filter(shed => {
    const matchesSearch = (shed.shedName || shed.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || shed.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Form Logic
  const handleOpenForm = (shed = null) => {
    if (shed) {
      setEditingShed(shed);
      setFormData({
        name: shed.shedName || shed.name || '',
        capacity: shed.capacity?.toString() || '',
        status: shed.status || 'active',
        farmLocation: shed.farmLocation || ''
      });
    } else {
      setEditingShed(null);
      setFormData({ name: '', capacity: '', status: 'active', farmLocation: '' });
    }
    setShowShedForm(true);
  };

  const handleCloseForm = () => {
    setShowShedForm(false);
    setEditingShed(null);
    setFormData({ name: '', capacity: '', status: 'active', farmLocation: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.capacity) return;
    setSubmitting(true);
    setError(null);
    const payload = {
      shedName: formData.name,
      capacity: parseInt(formData.capacity),
      status: formData.status,
      farmLocation: formData.farmLocation
    };
    try {
      if (editingShed) {
        const response = await axiosInstance.patch(`${API_URL}/${editingShed.id}`, payload);
        if (response.data && response.data.success) {
          await fetchSheds();
          setSearchTerm('');
          setSelectedStatus('all');
        }
      } else {
        const response = await axiosInstance.post(API_URL, payload);
        if (response.data && response.data.success) {
          await fetchSheds();
          setSearchTerm('');
          setSelectedStatus('all');
        }
      }
      handleCloseForm();
    } catch (error) {
      console.error("❌ API Error, saving locally:", error);
      const newShed = {
        id: editingShed ? editingShed.id : (sheds.length > 0 ? Math.max(...sheds.map(s => s.id)) + 1 : 1),
        shedName: formData.name,
        name: formData.name,
        capacity: parseInt(formData.capacity),
        status: formData.status,
        farmLocation: formData.farmLocation,
        createdDate: new Date().toLocaleDateString(),
        createdAt: new Date().toISOString()
      };
      const updatedSheds = editingShed
        ? sheds.map(s => s.id === editingShed.id ? newShed : s)
        : [newShed, ...sheds];
      setSheds(updatedSheds);
      localStorage.setItem('livestockSheds', JSON.stringify(updatedSheds));
      setSearchTerm('');
      setSelectedStatus('all');
      handleCloseForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setSubmitting(true);
      await axiosInstance.delete(`${API_URL}/${id}`);
      await fetchSheds();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("❌ Delete failed, deleting locally:", error);
      const updatedSheds = sheds.filter(s => s.id !== id);
      setSheds(updatedSheds);
      localStorage.setItem('livestockSheds', JSON.stringify(updatedSheds));
      setDeleteConfirm(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch location suggestions
  useEffect(() => {
    const fetchLocations = async () => {
      if (!formData.farmLocation || formData.farmLocation.length < 3 || !showLocationSuggestions) {
        setLocationSuggestions([]);
        return;
      }
      setIsFetchingLocation(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.farmLocation)}&limit=5`);
        if (res.ok) setLocationSuggestions(await res.json());
      } catch (err) {
        console.error("Error fetching location suggestions:", err);
      } finally {
        setIsFetchingLocation(false);
      }
    };
    const timer = setTimeout(fetchLocations, 500);
    return () => clearTimeout(timer);
  }, [formData.farmLocation, showLocationSuggestions]);

  const handleLocationSelect = (location) => {
    setFormData({ ...formData, farmLocation: location.display_name });
    setShowLocationSuggestions(false);
  };

  const CornerBrackets = () => {
    const borderColor = isDark ? "border-green-500/20" : "border-neutral-300";
    return (
      <>
        <div className={`absolute top-0 left-0 w-3 h-3 border-l border-t ${borderColor} transition-all duration-300`} />
        <div className={`absolute top-0 right-0 w-3 h-3 border-r border-t ${borderColor} transition-all duration-300`} />
        <div className={`absolute bottom-0 left-0 w-3 h-3 border-l border-b ${borderColor} transition-all duration-300`} />
        <div className={`absolute bottom-0 right-0 w-3 h-3 border-r border-b ${borderColor} transition-all duration-300`} />
      </>
    );
  };

  const isActive = (path) => pathname === path;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${inter.className} ${
      isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
    }`}>

      {/* BACKGROUND TEXTURE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.03),transparent_70%)]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-100" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.02),transparent_70%)]" />
          </>
        )}
      </div>

      {/* OVERLAY FOR MODALS */}
      {(showShedForm || deleteConfirm || viewingShed) && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => {
            handleCloseForm();
            setDeleteConfirm(null);
            setViewingShed(null);
          }}
        ></div>
      )}

      {/* NAVBAR */}
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT */}
      <div className={`${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">

          {/* TITLE & TABS */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="font-mono text-[10px] text-green-500/80 uppercase tracking-[0.3em]">
                  [LIVESTOCK_SYSTEM]
                </span>
              </div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-2`}>
                Shed <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Management</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Manage farm buildings, sheds, and field locations for housing your livestock.
              </p>
              {loading && <span className="text-xs text-green-500 font-mono mt-2 block">SYNCING_DATA...</span>}
              {error && <span className="text-xs text-red-500 font-mono mt-2 block">{error}</span>}
            </div>

            {/* Tab Navigation */}
            <div className={`flex p-1.5 border backdrop-blur-md ${
              isDark ? 'bg-neutral-900/50 border-white/10' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              {[
                { label: 'Overview', href: '/dashboard/livestockmanagement/animal/dashboard' },
                { label: 'Sheds', href: '/dashboard/livestockmanagement/animal/sheds' },
                { label: 'Animals', href: '/dashboard/livestockmanagement/animal/animals' },
              ].map((tab) => (
                <Link key={tab.href} href={tab.href}>
                  <button className={`cursor-pointer px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive(tab.href)
                      ? isDark ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}>
                    {tab.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* HEADER SECTION */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
                <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Shed Locations
                </h2>
                <button
                  onClick={fetchSheds}
                  disabled={loading}
                  className={`ml-2 text-xs font-mono px-2 py-1 border transition-all ${
                    loading ? 'opacity-50 cursor-not-allowed' : isDark ? 'hover:bg-white/5 border-white/10 hover:border-green-500/20' : 'hover:bg-neutral-50 border-neutral-200 hover:border-green-300'
                  }`}
                  title="Refresh Data"
                >
                  {loading ? '...' : '⟲'}
                </button>
              </div>
              <button
                className={`group flex items-center gap-2 px-5 py-3 border transition-all duration-200 font-bold text-[11px] uppercase tracking-widest ${
                  isDark ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700' : 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm'
                }`}
                onClick={() => handleOpenForm()}
                disabled={submitting}
              >
                <Plus className="w-4 h-4" />
                {submitting ? 'Saving...' : 'Add Shed'}
              </button>
            </div>
          </section>

          {/* SEARCH AND FILTER BAR */}
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className={`relative p-5 border group/search ${isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'}`}>
                <div className="flex items-center gap-3">
                  <Search className={`w-5 h-5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                  <input
                    type="text"
                    placeholder="Search sheds..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm font-medium ${isDark ? 'placeholder:text-neutral-600' : 'placeholder:text-neutral-400'}`}
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className={`p-1 transition-all ${isDark ? 'hover:text-white text-neutral-400' : 'hover:text-neutral-900 text-neutral-500'}`}>
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover/search:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
                <CornerBrackets />
              </div>

              {/* Filter */}
              <div className="relative">
                <div
                  className={`relative p-5 border cursor-pointer transition-all ${isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'}`}
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {selectedStatus === 'all' ? 'Filter by status' : selectedStatus}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets />
                </div>
                {filterOpen && (
                  <div className={`absolute top-full mt-2 right-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'}`}>
                    {['all', 'active', 'inactive', 'maintenance'].map((status) => (
                      <button
                        key={status}
                        onClick={() => { setSelectedStatus(status); setFilterOpen(false); }}
                        className={`cursor-pointer w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          selectedStatus === status
                            ? isDark ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400' : 'bg-green-50 text-green-700 border-l-2 border-green-600'
                            : isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-50'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SHEDS TABLE */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-amber-500/50' : 'bg-amber-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                All Sheds
              </h2>
            </div>

            {loading && sheds.length === 0 ? (
              <div className={`relative p-16 border text-center ${isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'}`}>
                <div className="animate-spin w-12 h-12 border-3 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2 uppercase tracking-tight`}>Loading sheds...</h3>
                <CornerBrackets />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredSheds.map((shed) => (
                  <div key={shed.id} className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 ${isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-4">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Shed Name</span>
                        <h3 className={`text-lg font-bold ${spaceGrotesk.className}`}>{shed.shedName || shed.name}</h3>
                      </div>
                      <div className="md:col-span-2">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Capacity</span>
                        <p className={`${spaceGrotesk.className} text-2xl font-bold tracking-tight ${isDark ? 'text-green-400' : 'text-green-600'}`}>{shed.capacity}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Status</span>
                        <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${
                          shed.status === 'active'
                            ? isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-700 border-green-200'
                            : shed.status === 'inactive'
                            ? isDark ? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20' : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                            : isDark ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          {shed.status}
                        </span>
                      </div>
                      <div className="md:col-span-3">
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>Created Date</span>
                        <p className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {shed.createdDate || (shed.createdAt ? new Date(shed.createdAt).toLocaleDateString() : 'N/A')}
                        </p>
                      </div>
                      <div className="md:col-span-1 flex items-center justify-end gap-1">
                        <button
                          className={`cursor-pointer p-2.5 border transition-all ${isDark ? 'hover:bg-green-500/10 text-green-400 border-white/10 hover:border-green-500/20' : 'hover:bg-green-50 text-green-600 border-neutral-200 hover:border-green-300'}`}
                          title="Add Animal"
                          onClick={() => router.push(`/livestockmanagement/animal/animals?addAnimal=true&shedId=${shed.id}&shedName=${encodeURIComponent(shed.shedName || shed.name)}`)}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          className={`cursor-pointer p-2.5 border transition-all ${isDark ? 'hover:bg-white/10 border-white/10 hover:border-white/20' : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'}`}
                          title="View"
                          onClick={() => setViewingShed(shed)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className={`cursor-pointer p-2.5 border transition-all ${isDark ? 'hover:bg-white/10 border-white/10 hover:border-white/20' : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'}`}
                          title="Edit"
                          onClick={() => handleOpenForm(shed)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className={`cursor-pointer p-2.5 border transition-all ${isDark ? 'hover:bg-red-500/20 text-red-400 border-white/10 hover:border-red-500/20' : 'hover:bg-red-50 text-red-600 border-neutral-200 hover:border-red-200'}`}
                          title="Delete"
                          onClick={() => setDeleteConfirm(shed)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <CornerBrackets />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredSheds.length === 0 && (
              <div className={`relative p-16 border text-center ${isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'}`}>
                <Home className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-neutral-800' : 'text-neutral-200'}`} />
                <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2 uppercase tracking-tight`}>No sheds found</h3>
                <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  {searchTerm || selectedStatus !== 'all' ? 'Try adjusting your search or filter criteria' : 'Click "Add Shed" to create your first shed'}
                </p>
                {(searchTerm || selectedStatus !== 'all') && (
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedStatus('all'); }}
                    className={`mt-4 px-4 py-2 border text-xs font-bold uppercase tracking-wider transition-all ${
                      isDark ? 'bg-neutral-800 hover:bg-neutral-700 border-white/10 hover:border-white/20' : 'bg-white hover:bg-neutral-50 border-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    Clear Filters
                  </button>
                )}
                <CornerBrackets />
              </div>
            )}
          </section>
        </main>
      </div>

      {/* ADD/EDIT SHED FORM SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[500px] z-50 transform transition-transform duration-300 border-l ${
        showShedForm ? 'translate-x-0' : 'translate-x-full'
      } ${isDark ? 'bg-neutral-950 border-white/10' : 'bg-white border-neutral-200'} shadow-2xl overflow-y-auto`}>
        <div className="p-8">
          <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-[2px] w-6 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
                <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  {editingShed ? 'EDIT_MODE' : 'CREATE_MODE'}
                </span>
              </div>
              <h2 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                {editingShed ? 'Edit Shed' : 'Add New Shed'}
              </h2>
              <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {editingShed ? 'Update shed information' : 'Create a new shed location'}
              </p>
            </div>
            <button
              onClick={handleCloseForm}
              className={`cursor-pointer p-2.5 border transition-all ${isDark ? 'hover:bg-white/10 border-white/10 hover:border-white/20' : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'}`}
              disabled={submitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Shed Name *
              </label>
              <input
                type="text" required value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter shed name"
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'}`}
                disabled={submitting}
              />
            </div>
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Capacity *
              </label>
              <input
                type="number" required min="1" value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                placeholder="Enter capacity"
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'}`}
                disabled={submitting}
              />
            </div>
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark ? 'bg-neutral-900 border-white/10 focus:border-green-500' : 'bg-neutral-50 border-neutral-300 focus:border-green-500'}`}
                disabled={submitting}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="relative">
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Farm Location
              </label>
              <input
                type="text" value={formData.farmLocation}
                onChange={(e) => { setFormData({...formData, farmLocation: e.target.value}); setShowLocationSuggestions(true); }}
                onFocus={() => setShowLocationSuggestions(true)}
                placeholder="Enter or search location"
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${isDark ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'}`}
                disabled={submitting}
              />
              {isFetchingLocation && <div className="absolute right-4 top-12 text-xs text-green-500 font-mono">Searching...</div>}
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className={`absolute top-full mt-1 w-full border shadow-xl overflow-hidden z-30 max-h-48 overflow-y-auto ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-200'}`}>
                  {locationSuggestions.map((loc, i) => (
                    <button key={i} type="button" onClick={() => handleLocationSelect(loc)}
                      className={`w-full px-4 py-2.5 text-left text-xs transition-colors ${isDark ? 'hover:bg-white/5 text-neutral-300' : 'hover:bg-neutral-50 text-neutral-700'}`}>
                      {loc.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-6">
              <button type="button" onClick={handleCloseForm} disabled={submitting}
                className={`flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${isDark ? 'hover:bg-white/5 border-white/10' : 'hover:bg-neutral-50 border-neutral-300'}`}>
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="flex-1 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold text-[11px] uppercase tracking-widest transition-all">
                {submitting ? 'Saving...' : (editingShed ? 'Update Shed' : 'Add Shed')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-md w-full p-8 border ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'} shadow-2xl`}>
            <div className="text-center">
              <Trash2 className="w-10 h-10 mx-auto mb-4 text-red-600" />
              <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2 uppercase tracking-tight`}>Delete Shed?</h3>
              <p className={`text-sm font-medium mb-8 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Are you sure you want to delete "{deleteConfirm.shedName}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} disabled={submitting}
                  className={`flex-1 px-4 py-2.5 border font-bold text-[11px] uppercase tracking-widest ${isDark ? 'hover:bg-white/5 border-white/10' : 'hover:bg-neutral-50 border-neutral-300'}`}>
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteConfirm.id)} disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] uppercase tracking-widest">
                  {submitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
            <CornerBrackets />
          </div>
        </div>
      )}

      {/* VIEW SHED MODAL */}
      {viewingShed && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-2xl w-full p-8 border ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'} shadow-2xl`}>
            <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
              <h3 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight`}>Shed Details</h3>
              <button onClick={() => setViewingShed(null)}
                className={`cursor-pointer p-2.5 border transition-all ${isDark ? 'hover:bg-white/10 border-white/10' : 'hover:bg-neutral-50 border-neutral-200'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { label: 'Shed Name', value: viewingShed.shedName },
                { label: 'Capacity', value: viewingShed.capacity },
                { label: 'Status', value: viewingShed.status },
                { label: 'Farm Location', value: viewingShed.farmLocation || 'N/A' },
                { label: 'Created Date', value: viewingShed.createdDate || 'N/A' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] block mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>{label}</span>
                  <p className="font-medium">{value}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setViewingShed(null)}
              className={`w-full py-3 border font-bold text-[11px] uppercase tracking-widest transition-all ${isDark ? 'hover:bg-white/5 border-white/10' : 'hover:bg-neutral-50 border-neutral-300'}`}>
              Close
            </button>
            <CornerBrackets />
          </div>
        </div>
      )}
    </div>
  );
}