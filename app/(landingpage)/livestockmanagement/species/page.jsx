"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  Search, Filter, Plus, Eye, Edit, Trash2, ChevronDown, X, Download,
  Beef, AlertCircle, TrendingUp, Activity
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SPECIES_API = `${API_BASE_URL}/species`;

// Helper to get headers with token
const getHeaders = () => ({
  Authorization: `Bearer ${Cookies.get('accessToken')}`
});

export default function SpeciesManagement() {
  const [isDark, setIsDark] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoryOpen, setFilterCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSpeciesForm, setShowSpeciesForm] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewingSpecies, setViewingSpecies] = useState(null);
  const [species, setSpecies] = useState([]);
  const [stats, setStats] = useState({
    totalSpecies: 0,
    totalAnimals: 0,
    cattleSpecies: 0,
    avgHealthRate: 0
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6); // For grid layout
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    category: 'Cattle',
    description: '',
    averageWeight: '',
    averageLifespan: '',
    characteristics: ''
  });

  // ========== API FUNCTIONS ==========

  // Fetch all species
  const fetchSpecies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(SPECIES_API, {
        withCredentials: true,
        headers: getHeaders()
      });
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setSpecies(response.data.data);
        localStorage.setItem('livestockSpecies', JSON.stringify(response.data.data));
      } else if (response.data && Array.isArray(response.data)) {
        setSpecies(response.data);
        localStorage.setItem('livestockSpecies', JSON.stringify(response.data));
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setSpecies(response.data.data);
        localStorage.setItem('livestockSpecies', JSON.stringify(response.data.data));
      } else {
        console.warn("Unexpected API response format:", response.data);
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("Error fetching species:", error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${SPECIES_API}/stats`, {
        withCredentials: true,
        headers: getHeaders()
      });
      
      if (response.data && response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Calculate stats from local data as fallback
      calculateLocalStats();
    }
  };

  // Calculate stats from local data
  const calculateLocalStats = () => {
    const totalSpecies = species.length;
    const totalAnimals = species.reduce((sum, s) => sum + (s.totalAnimals || 0), 0);
    const cattleSpecies = species.filter(s => s.category === 'Cattle').length;
    const avgHealthRate = species.length > 0 
      ? Math.round(species.reduce((sum, s) => sum + ((s.healthyCount || 0) / (s.totalAnimals || 1) * 100), 0) / species.length)
      : 0;
    
    setStats({ totalSpecies, totalAnimals, cattleSpecies, avgHealthRate });
  };

  // Load from localStorage as fallback
  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('livestockSpecies');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSpecies(Array.isArray(parsed) ? parsed : []);
          calculateLocalStats();
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
          setSpecies([]);
        }
      } else {
        setSpecies([]);
      }
    }
  };

  // Create new species
  const createSpecies = async () => {
    if (!formData.name || !formData.scientificName) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(SPECIES_API, formData, {
        withCredentials: true,
        headers: getHeaders()
      });
      
      if (response.data && response.data.success) {
        await fetchSpecies();
        await fetchStats();
        handleCloseForm();
      }
    } catch (error) {
      console.error("API Error, saving locally:", error);
      
      // Fallback to localStorage
      const newSpecies = {
        ...formData,
        id: Date.now(),
        totalAnimals: 0,
        healthyCount: 0,
        createdDate: new Date().toISOString().split('T')[0]
      };
      
      const updatedSpecies = [newSpecies, ...species];
      setSpecies(updatedSpecies);
      localStorage.setItem('livestockSpecies', JSON.stringify(updatedSpecies));
      calculateLocalStats();
      handleCloseForm();
    } finally {
      setSubmitting(false);
    }
  };

  // Update species
  const updateSpecies = async () => {
    if (!formData.name || !formData.scientificName || !editingSpecies) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.put(`${SPECIES_API}/${editingSpecies.id}`, formData, {
        withCredentials: true,
        headers: getHeaders()
      });
      
      if (response.data && response.data.success) {
        await fetchSpecies();
        await fetchStats();
        handleCloseForm();
      }
    } catch (error) {
      console.error("API Error, updating locally:", error);
      
      // Fallback to localStorage
      const updatedSpecies = species.map(s => 
        s.id === editingSpecies.id 
          ? { ...s, ...formData }
          : s
      );
      
      setSpecies(updatedSpecies);
      localStorage.setItem('livestockSpecies', JSON.stringify(updatedSpecies));
      calculateLocalStats();
      handleCloseForm();
    } finally {
      setSubmitting(false);
    }
  };

  // Delete species
  const deleteSpecies = async (id) => {
    setSubmitting(true);

    try {
      await axios.delete(`${SPECIES_API}/${id}`, {
        withCredentials: true,
        headers: getHeaders()
      });
      
      await fetchSpecies();
      await fetchStats();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Delete failed, deleting locally:", error);
      
      // Fallback to localStorage
      const updatedSpecies = species.filter(s => s.id !== id);
      setSpecies(updatedSpecies);
      localStorage.setItem('livestockSpecies', JSON.stringify(updatedSpecies));
      calculateLocalStats();
      setDeleteConfirm(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSpecies();
    fetchStats();
  }, []);

  // Save to localStorage whenever species change (backup)
  useEffect(() => {
    if (species.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('livestockSpecies', JSON.stringify(species));
    }
  }, [species]);

  // Filter species based on search and category
  const filteredSpecies = species.filter(s => {
    const matchesSearch = (s.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (s.scientificName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = filteredSpecies.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredSpecies.length / rowsPerPage);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Handle Add/Edit Species
  const handleOpenForm = (speciesItem = null) => {
    if (speciesItem) {
      setEditingSpecies(speciesItem);
      setFormData({
        name: speciesItem.name || '',
        scientificName: speciesItem.scientificName || '',
        category: speciesItem.category || 'Cattle',
        description: speciesItem.description || '',
        averageWeight: speciesItem.averageWeight || '',
        averageLifespan: speciesItem.averageLifespan || '',
        characteristics: speciesItem.characteristics || ''
      });
    } else {
      setEditingSpecies(null);
      setFormData({
        name: '',
        scientificName: '',
        category: 'Cattle',
        description: '',
        averageWeight: '',
        averageLifespan: '',
        characteristics: ''
      });
    }
    setShowSpeciesForm(true);
  };

  const handleCloseForm = () => {
    setShowSpeciesForm(false);
    setEditingSpecies(null);
    setFormData({
      name: '',
      scientificName: '',
      category: 'Cattle',
      description: '',
      averageWeight: '',
      averageLifespan: '',
      characteristics: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingSpecies) {
      updateSpecies();
    } else {
      createSpecies();
    }
  };

  const handleAddNewWithReset = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setCurrentPage(1);
    handleOpenForm();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Scientific Name', 'Category', 'Description', 'Avg Weight', 'Avg Lifespan', 'Total Animals', 'Healthy Count'],
      ...filteredSpecies.map(s => [
        s.name || '', 
        s.scientificName || '', 
        s.category || '', 
        s.description || '', 
        s.averageWeight || '', 
        s.averageLifespan || '', 
        s.totalAnimals || 0, 
        s.healthyCount || 0
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `species-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${inter.className} ${
      isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
    }`}>
      
      {/* ENHANCED BACKGROUND TEXTURE */}
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
      {(showSpeciesForm || deleteConfirm || viewingSpecies) && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => {
            handleCloseForm();
            setDeleteConfirm(null);
            setViewingSpecies(null);
          }}
        />
      )}

      {/* NAVBAR WITH SIDEBAR */}
      <Navbar 
        isDark={isDark} 
        setIsDark={setIsDark} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="Search species..."
      />

      {/* MAIN CONTENT */}
      <div className={`${sidebarOpen ? 'lg:ml-72' : 'ml-0'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">
          
          {/* MODERNIZED TITLE */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="font-mono text-[10px] text-green-500/80 uppercase tracking-[0.3em]">
                  [SPECIES_MANAGEMENT]
                </span>
              </div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-2`}>
                Species <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Management</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Manage livestock breeds, characteristics, and biological information for your herd.
              </p>
              {loading && (
                <span className="text-xs text-green-500 font-mono mt-2">SYNCING_DATA...</span>
              )}
            </div>
          </div>

          {/* STATS OVERVIEW */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Species Card */}
            <div className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 group ${
              isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Total Species
                </span>
                <Beef className={`w-4 h-4 text-green-500 opacity-80`} />
              </div>
              <h3 className={`${spaceGrotesk.className} text-4xl font-bold`}>{stats.totalSpecies}</h3>
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
              <CornerBrackets />
            </div>

            {/* Total Animals Card */}
            <div className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 group ${
              isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Total Animals
                </span>
                <Activity className={`w-4 h-4 text-blue-500 opacity-80`} />
              </div>
              <h3 className={`${spaceGrotesk.className} text-4xl font-bold`}>{stats.totalAnimals}</h3>
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
              <CornerBrackets />
            </div>

            {/* Cattle Breeds Card */}
            <div className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 group ${
              isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Cattle Breeds
                </span>
                <Beef className={`w-4 h-4 text-amber-500 opacity-80`} />
              </div>
              <h3 className={`${spaceGrotesk.className} text-4xl font-bold`}>{stats.cattleSpecies}</h3>
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
              <CornerBrackets />
            </div>

            {/* Avg Health Rate Card */}
            <div className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 group ${
              isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Avg Health Rate
                </span>
                <TrendingUp className={`w-4 h-4 text-emerald-500 opacity-80`} />
              </div>
              <h3 className={`${spaceGrotesk.className} text-4xl font-bold`}>{stats.avgHealthRate}%</h3>
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
              <CornerBrackets />
            </div>
          </section>

          {/* HEADER SECTION */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
                <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Species Records
                </h2>
              </div>
              <button 
                className={`cursor-pointer group flex items-center gap-2 px-5 py-3 border transition-all duration-200 font-bold text-[11px] uppercase tracking-widest ${
                  isDark 
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700' 
                    : 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm'
                }`}
                onClick={handleAddNewWithReset}
                disabled={submitting}
              >
                <Plus className="w-4 h-4" />
                {submitting ? 'Adding...' : 'Add Species'}
              </button>
            </div>
          </section>

          {/* SEARCH AND FILTER BAR */}
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Card */}
              <div className={`relative p-5 border md:col-span-2 group/search ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className="flex items-center gap-3">
                  <Search className={`w-5 h-5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                  <input
                    type="text"
                    placeholder="Search by name or scientific name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm font-medium ${
                      isDark ? 'placeholder:text-neutral-600' : 'placeholder:text-neutral-400'
                    }`}
                  />
                  {searchTerm && (
                    <button
                      onClick={handleClearSearch}
                      className={`p-1 transition-all ${isDark ? 'hover:text-white text-neutral-400' : 'hover:text-neutral-900 text-neutral-500'}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover/search:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
                <CornerBrackets />
              </div>

              {/* Filter Card */}
              <div className="relative">
                <div className={`relative p-5 border cursor-pointer transition-all ${
                  isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                }`} onClick={() => setFilterCategoryOpen(!filterCategoryOpen)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${filterCategoryOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets />
                </div>

                {filterCategoryOpen && (
                  <div className={`absolute top-full mt-2 right-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${
                    isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                  }`}>
                    {['all', 'Cattle', 'Sheep', 'Goat', 'Poultry', 'Other'].map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setFilterCategoryOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`cursor-pointer w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          selectedCategory === category
                            ? isDark
                              ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400'
                              : 'bg-green-50 text-green-700 border-l-2 border-green-600'
                            : isDark
                            ? 'hover:bg-white/5'
                            : 'hover:bg-neutral-50'
                        }`}
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={handleClearSearch}
                className={`flex cursor-pointer items-center gap-2 px-5 py-3 border transition-all font-bold text-[11px] uppercase tracking-widest ${
                  isDark 
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700' 
                    : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-300 shadow-sm'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                Clear Filters
              </button>
              <button 
                onClick={handleExport}
                className={`cursor-pointer flex items-center gap-2 px-5 py-3 border transition-all font-bold text-[11px] uppercase tracking-widest ${
                  isDark 
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                    : 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm'
                }`}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </section>

          {/* SPECIES GRID */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-amber-500/50' : 'bg-amber-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                All Species
              </h2>
              {loading && <span className="text-xs text-green-500 font-mono animate-pulse">SYNCING...</span>}
            </div>
            
            {loading && species.length === 0 ? (
              <div className={`relative p-16 border text-center ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2 uppercase tracking-tight`}>
                  Loading species...
                </h3>
                <CornerBrackets />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentRecords.map((speciesItem) => (
                  <div key={speciesItem.id || speciesItem._id} className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 group ${
                    isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                  }`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight mb-1`}>
                          {speciesItem.name}
                        </h3>
                        <p className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          {speciesItem.scientificName}
                        </p>
                      </div>
                      <span className={`px-3 py-1 border text-[9px] font-bold font-mono uppercase tracking-wider ${
                        isDark
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {speciesItem.category}
                      </span>
                    </div>

                    {/* Description */}
                    {speciesItem.description && (
                      <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {speciesItem.description}
                      </p>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          Weight
                        </span>
                        <p className={`text-sm font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {speciesItem.averageWeight || '-'}
                        </p>
                      </div>
                      <div>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          Lifespan
                        </span>
                        <p className={`text-sm font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {speciesItem.averageLifespan || '-'}
                        </p>
                      </div>
                      <div>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          Total
                        </span>
                        <p className={`${spaceGrotesk.className} text-xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                          {speciesItem.totalAnimals || 0}
                        </p>
                      </div>
                      <div>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          Healthy
                        </span>
                        <p className={`${spaceGrotesk.className} text-xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                          {speciesItem.healthyCount || 0}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className={`flex items-center gap-1 pt-4 border-t ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                      <button 
                        className={`flex-1 p-2.5 border transition-all ${
                          isDark 
                            ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                            : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                        }`} 
                        title="View Details"
                        onClick={() => setViewingSpecies(speciesItem)}
                      >
                        <Eye className="w-4 h-4 mx-auto" />
                      </button>
                      <button 
                        className={`flex-1 p-2.5 border transition-all ${
                          isDark 
                            ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                            : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                        }`} 
                        title="Edit"
                        onClick={() => handleOpenForm(speciesItem)}
                        disabled={submitting}
                      >
                        <Edit className="w-4 h-4 mx-auto" />
                      </button>
                      <button 
                        className={`flex-1 p-2.5 border transition-all ${
                          isDark 
                            ? 'hover:bg-red-500/20 text-red-400 border-white/10 hover:border-red-500/20' 
                            : 'hover:bg-red-50 text-red-600 border-neutral-200 hover:border-red-200'
                        }`} 
                        title="Delete"
                        onClick={() => setDeleteConfirm(speciesItem)}
                        disabled={submitting}
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>

                    {/* Hover Effect */}
                    <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
                    <CornerBrackets />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredSpecies.length === 0 && (
              <div className={`relative p-16 border text-center ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <Beef className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-neutral-800' : 'text-neutral-200'}`} />
                <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2 uppercase tracking-tight`}>
                  No species found
                </h3>
                <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  {species.length === 0 ? 'Add your first species to get started' : 'Try adjusting your search or filter criteria'}
                </p>
                <CornerBrackets />
              </div>
            )}

            {/* Pagination */}
            {filteredSpecies.length > 0 && (
              <div className={`flex items-center justify-between p-6 border ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredSpecies.length)} of {filteredSpecies.length} results
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={goToFirstPage}
                      disabled={currentPage === 1}
                      className={`cursor-pointer p-2 border transition-all ${
                        currentPage === 1
                          ? 'opacity-50 cursor-not-allowed'
                          : isDark
                            ? 'hover:bg-white/10 border-white/10'
                            : 'hover:bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      «
                    </button>
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className={`cursor-pointer p-2 border transition-all ${
                        currentPage === 1
                          ? 'opacity-50 cursor-not-allowed'
                          : isDark
                            ? 'hover:bg-white/10 border-white/10'
                            : 'hover:bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      ‹
                    </button>
                    
                    <div className={`px-4 py-2 border font-bold text-sm ${
                      isDark 
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-green-50 border-green-200 text-green-700'
                    }`}>
                      {currentPage}
                    </div>
                    
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`cursor-pointer p-2 border transition-all ${
                        currentPage === totalPages
                          ? 'opacity-50 cursor-not-allowed'
                          : isDark
                            ? 'hover:bg-white/10 border-white/10'
                            : 'hover:bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      ›
                    </button>
                    <button
                      onClick={goToLastPage}
                      disabled={currentPage === totalPages}
                      className={`cursor-pointer p-2 border transition-all ${
                        currentPage === totalPages
                          ? 'opacity-50 cursor-not-allowed'
                          : isDark
                            ? 'hover:bg-white/10 border-white/10'
                            : 'hover:bg-neutral-50 border-neutral-200'
                      }`}
                    >
                      »
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      Rows per page:
                    </span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className={`cursor-pointer px-3 py-2 border outline-none text-sm font-medium ${
                        isDark 
                          ? 'bg-neutral-900 border-white/10 text-white'
                          : 'bg-white border-neutral-300 text-neutral-900'
                      }`}
                    >
                      <option value={3}>3</option>
                      <option value={6}>6</option>
                      <option value={9}>9</option>
                      <option value={12}>12</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </section>

        </main>
      </div>

      {/* ADD/EDIT SPECIES FORM MODAL */}
      {showSpeciesForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl border ${
            isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
          } shadow-2xl max-h-[90vh] overflow-y-auto`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-6 border-b ${
              isDark ? 'border-white/10' : 'border-neutral-200'
            }`}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-[2px] w-6 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {editingSpecies ? 'EDIT_MODE' : 'CREATE_MODE'}
                  </span>
                </div>
                <h2 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight`}>
                  {editingSpecies ? 'Edit Species' : 'Add New Species'}
                </h2>
              </div>
              <button
                onClick={handleCloseForm}
                className={`p-2.5 border transition-colors ${
                  isDark 
                    ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                    : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                }`}
                disabled={submitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Form fields same as before... */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Species Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                    }`}
                    placeholder="e.g., Holstein"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Scientific Name *
                  </label>
                  <input
                    type="text"
                    value={formData.scientificName}
                    onChange={(e) => setFormData({...formData, scientificName: e.target.value})}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                    }`}
                    placeholder="e.g., Bos taurus"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                    isDark 
                      ? 'bg-neutral-900 border-white/10 focus:border-green-500' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                  }`}
                  disabled={submitting}
                >
                  <option value="Cattle">Cattle</option>
                  <option value="Sheep">Sheep</option>
                  <option value="Goat">Goat</option>
                  <option value="Poultry">Poultry</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className={`w-full px-4 py-3.5 border outline-none transition-all font-medium resize-none ${
                    isDark 
                      ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                  }`}
                  placeholder="Brief description of the species..."
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Average Weight
                  </label>
                  <input
                    type="text"
                    value={formData.averageWeight}
                    onChange={(e) => setFormData({...formData, averageWeight: e.target.value})}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                    }`}
                    placeholder="e.g., 680 kg"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Average Lifespan
                  </label>
                  <input
                    type="text"
                    value={formData.averageLifespan}
                    onChange={(e) => setFormData({...formData, averageLifespan: e.target.value})}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                    }`}
                    placeholder="e.g., 6-8 years"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Key Characteristics
                </label>
                <textarea
                  value={formData.characteristics}
                  onChange={(e) => setFormData({...formData, characteristics: e.target.value})}
                  rows="3"
                  className={`w-full px-4 py-3.5 border outline-none transition-all font-medium resize-none ${
                    isDark 
                      ? 'bg-neutral-900 border-white/10 focus:border-green-500 placeholder:text-neutral-600' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-green-500 placeholder:text-neutral-400'
                  }`}
                  placeholder="Distinctive features and traits..."
                  disabled={submitting}
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                    isDark 
                      ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' 
                      : 'bg-white hover:bg-neutral-50 border-neutral-300'
                  }`}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest ${
                    submitting
                      ? 'bg-green-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white border-green-600 transition-all`}
                >
                  {submitting ? 'Saving...' : editingSpecies ? 'Update Species' : 'Add Species'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-md w-full p-8 border ${
            isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
          } shadow-2xl`}>
            <div className="text-center">
              <div className={`inline-flex p-5 border mb-5 ${
                isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
              }`}>
                <Trash2 className={`w-10 h-10 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <h3 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight mb-3`}>
                Delete Species?
              </h3>
              <p className={`text-sm font-medium mb-8 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                    isDark 
                      ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' 
                      : 'bg-white hover:bg-neutral-50 border-neutral-300'
                  }`}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteSpecies(deleteConfirm.id || deleteConfirm._id)}
                  className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest ${
                    submitting
                      ? 'bg-red-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white border-red-600 transition-all`}
                  disabled={submitting}
                >
                  {submitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
            <CornerBrackets />
          </div>
        </div>
      )}

      {/* VIEW SPECIES MODAL */}
      {viewingSpecies && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-3xl w-full p-8 border ${
            isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
          } shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div>
              {/* Header */}
              <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`h-[2px] w-6 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`}>
                      SPECIES_PROFILE
                    </span>
                  </div>
                  <h3 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                    {viewingSpecies.name}
                  </h3>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {viewingSpecies.scientificName}
                  </p>
                </div>
                <button
                  onClick={() => setViewingSpecies(null)}
                  className={`cursor-pointer p-2.5 border transition-all ${
                    isDark 
                      ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                      : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="md:col-span-2">
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Category
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${
                    isDark
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : 'bg-green-50 text-green-700 border-green-200'
                  }`}>
                    {viewingSpecies.category}
                  </span>
                </div>

                {viewingSpecies.description && (
                  <div className="md:col-span-2">
                    <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      Description
                    </label>
                    <p className="text-sm font-medium">{viewingSpecies.description}</p>
                  </div>
                )}

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Average Weight
                  </label>
                  <p className={`text-lg font-bold ${spaceGrotesk.className}`}>{viewingSpecies.averageWeight || '-'}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Average Lifespan
                  </label>
                  <p className={`text-lg font-bold ${spaceGrotesk.className}`}>{viewingSpecies.averageLifespan || '-'}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Total Animals
                  </label>
                  <p className={`${spaceGrotesk.className} text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {viewingSpecies.totalAnimals || 0}
                  </p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Healthy Count
                  </label>
                  <p className={`${spaceGrotesk.className} text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {viewingSpecies.healthyCount || 0}
                  </p>
                </div>

                {viewingSpecies.characteristics && (
                  <div className="md:col-span-2">
                    <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      Key Characteristics
                    </label>
                    <p className="text-sm font-medium">{viewingSpecies.characteristics}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <button
                  onClick={() => setViewingSpecies(null)}
                  className={`flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                    isDark 
                      ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' 
                      : 'bg-white hover:bg-neutral-50 border-neutral-300'
                  }`}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleOpenForm(viewingSpecies);
                    setViewingSpecies(null);
                  }}
                  className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white border-green-600 transition-all"
                >
                  Edit Species
                </button>
              </div>
            </div>
            <CornerBrackets />
          </div>
        </div>
      )}
    </div>
  );
}