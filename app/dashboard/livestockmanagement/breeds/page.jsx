"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import breedService from '@/services/breedService';
import speciesService from '@/services/speciesService';
import { 
  Search, Filter, Plus, Eye, Edit, Trash2, ChevronDown, X, Download,
  Dna, AlertCircle, TrendingUp, Activity
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function BreedManagement() {
  const [isDark, setIsDark] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpeciesOpen, setFilterSpeciesOpen] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [showBreedForm, setShowBreedForm] = useState(false);
  const [editingBreed, setEditingBreed] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewingBreed, setViewingBreed] = useState(null);
  const [breeds, setBreeds] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const [stats, setStats] = useState({
    totalBreeds: 0,
    totalAnimals: 0,
    avgHealthRate: 0
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [formData, setFormData] = useState({
    name: '',
    species: 'Cattle',
    origin: '',
    description: '',
    purpose: '',
    characteristics: ''
  });

  const fetchSpecies = async () => {
    try {
      const data = await speciesService.getSpecies();
      if (data && data.success && Array.isArray(data.data)) {
        setSpeciesList(data.data);
      } else if (Array.isArray(data)) {
        setSpeciesList(data);
      }
    } catch (error) {
      console.error("Error fetching species:", error);
    }
  };

  // ========== API FUNCTIONS ==========

  const fetchBreeds = async () => {
    try {
      setLoading(true);
      const data = await breedService.getBreeds();
      
      if (data && data.success && Array.isArray(data.data)) {
        setBreeds(data.data);
        localStorage.setItem('livestockBreeds', JSON.stringify(data.data));
      } else if (data && Array.isArray(data)) {
        setBreeds(data);
        localStorage.setItem('livestockBreeds', JSON.stringify(data));
      } else {
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("Error fetching breeds:", error);
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await breedService.getBreedStats();
      
      if (data && data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      calculateLocalStats();
    }
  };

  const calculateLocalStats = () => {
    const totalBreeds = breeds.length;
    const totalAnimals = breeds.reduce((sum, b) => sum + (b.totalAnimals || 0), 0);
    const avgHealthRate = breeds.length > 0 
      ? Math.round(breeds.reduce((sum, b) => sum + ((b.healthyCount || 0) / (b.totalAnimals || 1) * 100), 0) / breeds.length)
      : 0;
    
    setStats({ totalBreeds, totalAnimals, avgHealthRate });
  };

  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('livestockBreeds');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setBreeds(Array.isArray(parsed) ? parsed : []);
          calculateLocalStats();
        } catch (e) {
          console.error("Error parsing localStorage data:", e);
          setBreeds([]);
        }
      } else {
        setBreeds([]);
      }
    }
  };

  const createBreed = async () => {
    if (!formData.name || !formData.species) {
      return;
    }

    setSubmitting(true);

    try {
      const data = await breedService.createBreed(formData);
      
      if (data && data.success) {
        await fetchBreeds();
        await fetchStats();
        handleCloseForm();
      }
    } catch (error) {
      console.error("API Error, saving locally:", error);
      
      const newBreed = {
        ...formData,
        id: Date.now(),
        totalAnimals: 0,
        healthyCount: 0,
        createdDate: new Date().toISOString().split('T')[0]
      };
      
      const updatedBreeds = [newBreed, ...breeds];
      setBreeds(updatedBreeds);
      localStorage.setItem('livestockBreeds', JSON.stringify(updatedBreeds));
      calculateLocalStats();
      handleCloseForm();
    } finally {
      setSubmitting(false);
    }
  };

  const updateBreed = async () => {
    if (!formData.name || !formData.species || !editingBreed) {
      return;
    }

    setSubmitting(true);

    try {
      const data = await breedService.updateBreed(editingBreed.id, formData);
      
      if (data && data.success) {
        await fetchBreeds();
        await fetchStats();
        handleCloseForm();
      }
    } catch (error) {
      console.error("API Error, updating locally:", error);
      
      const updatedBreeds = breeds.map(b => 
        b.id === editingBreed.id 
          ? { ...b, ...formData }
          : b
      );
      
      setBreeds(updatedBreeds);
      localStorage.setItem('livestockBreeds', JSON.stringify(updatedBreeds));
      calculateLocalStats();
      handleCloseForm();
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBreed = async (id) => {
    setSubmitting(true);

    try {
      await breedService.deleteBreed(id);
      
      await fetchBreeds();
      await fetchStats();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Delete failed, deleting locally:", error);
      
      const updatedBreeds = breeds.filter(b => b.id !== id);
      setBreeds(updatedBreeds);
      localStorage.setItem('livestockBreeds', JSON.stringify(updatedBreeds));
      calculateLocalStats();
      setDeleteConfirm(null);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchBreeds();
    fetchStats();
    fetchSpecies();
    
    // Theme logic
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') setIsDark(true);
  }, []);

  useEffect(() => {
    if (breeds.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('livestockBreeds', JSON.stringify(breeds));
    }
  }, [breeds]);

  const filteredBreeds = breeds.filter(b => {
    const matchesSearch = (b.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesSpecies = selectedSpecies === 'all' || b.species === selectedSpecies;
    return matchesSearch && matchesSpecies;
  });

  const indexOfLastRecord = currentPage * rowsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - rowsPerPage;
  const currentRecords = filteredBreeds.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredBreeds.length / rowsPerPage);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleOpenForm = (breedItem = null) => {
    if (breedItem) {
      setEditingBreed(breedItem);
      setFormData({
        name: breedItem.name || '',
        species: breedItem.species || 'Cattle',
        origin: breedItem.origin || '',
        description: breedItem.description || '',
        purpose: breedItem.purpose || '',
        characteristics: breedItem.characteristics || ''
      });
    } else {
      setEditingBreed(null);
      setFormData({
        name: '',
        species: 'Cattle',
        origin: '',
        description: '',
        purpose: '',
        characteristics: ''
      });
    }
    setShowBreedForm(true);
  };

  const handleCloseForm = () => {
    setShowBreedForm(false);
    setEditingBreed(null);
    setFormData({
      name: '',
      species: 'Cattle',
      origin: '',
      description: '',
      purpose: '',
      characteristics: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBreed) {
      updateBreed();
    } else {
      createBreed();
    }
  };

  const handleAddNewWithReset = () => {
    setSearchTerm('');
    setSelectedSpecies('all');
    setCurrentPage(1);
    handleOpenForm();
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedSpecies('all');
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Species', 'Origin', 'Description', 'Purpose', 'Total Animals', 'Healthy Count'],
      ...filteredBreeds.map(b => [
        b.name || '', 
        b.species || '', 
        b.origin || '', 
        b.description || '', 
        b.purpose || '', 
        b.totalAnimals || 0, 
        b.healthyCount || 0
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `breeds-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const CornerBrackets = () => {
    const borderColor = isDark ? "border-amber-500/20" : "border-neutral-300";
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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.03),transparent_70%)]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-100" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.02),transparent_70%)]" />
          </>
        )}
      </div>

      {/* OVERLAY FOR MODALS */}
      {(showBreedForm || deleteConfirm || viewingBreed) && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => {
            handleCloseForm();
            setDeleteConfirm(null);
            setViewingBreed(null);
          }}
        />
      )}

      {/* NAVBAR WITH SIDEBAR */}
      <Navbar 
        isDark={isDark} 
        setIsDark={setIsDark} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="Search breeds..."
      />

      {/* MAIN CONTENT */}
      <div className={`${sidebarOpen ? 'lg:ml-72' : 'ml-0'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">
          
          {/* MODERNIZED TITLE */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </div>
                <span className="font-mono text-[10px] text-amber-500/80 uppercase tracking-[0.3em]">
                  [BREED_MANAGEMENT]
                </span>
              </div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-2`}>
                Breed <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Management</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Manage individual livestock breeds, lineages, and population data.
              </p>
              {loading && (
                <span className="text-xs text-amber-500 font-mono mt-2">SYNCING_DATA...</span>
              )}
            </div>
          </div>

          {/* STATS OVERVIEW */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Breeds Card */}
            <div className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 group ${
              isDark ? 'bg-neutral-900/50 border-white/5 hover:border-amber-500/20' : 'bg-white border-neutral-300 hover:border-amber-500/30 shadow-sm'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Total Breeds
                </span>
                <Dna className={`w-4 h-4 text-amber-500 opacity-80`} />
              </div>
              <h3 className={`${spaceGrotesk.className} text-4xl font-bold`}>{stats.totalBreeds}</h3>
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-amber-500' : 'bg-amber-600'}`} />
              <CornerBrackets />
            </div>

            {/* Total Animals Card */}
            <div className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 group ${
              isDark ? 'bg-neutral-900/50 border-white/5 hover:border-amber-500/20' : 'bg-white border-neutral-300 hover:border-amber-500/30 shadow-sm'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Total Animals
                </span>
                <Activity className={`w-4 h-4 text-blue-500 opacity-80`} />
              </div>
              <h3 className={`${spaceGrotesk.className} text-4xl font-bold`}>{stats.totalAnimals}</h3>
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-amber-500' : 'bg-amber-600'}`} />
              <CornerBrackets />
            </div>

            {/* Avg Health Rate Card */}
            <div className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 group ${
              isDark ? 'bg-neutral-900/50 border-white/5 hover:border-amber-500/20' : 'bg-white border-neutral-300 hover:border-amber-500/30 shadow-sm'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Avg Health Rate
                </span>
                <TrendingUp className={`w-4 h-4 text-emerald-500 opacity-80`} />
              </div>
              <h3 className={`${spaceGrotesk.className} text-4xl font-bold`}>{stats.avgHealthRate}%</h3>
              <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-amber-500' : 'bg-amber-600'}`} />
              <CornerBrackets />
            </div>
          </section>

          {/* HEADER SECTION */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-[2px] w-8 ${isDark ? 'bg-amber-500/50' : 'bg-amber-500'}`} />
                <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Breed Records
                </h2>
              </div>
              <button 
                className={`cursor-pointer group flex items-center gap-2 px-5 py-3 border transition-all duration-200 font-bold text-[11px] uppercase tracking-widest ${
                  isDark 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600 hover:border-amber-700' 
                    : 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-sm'
                }`}
                onClick={handleAddNewWithReset}
                disabled={submitting}
              >
                <Plus className="w-4 h-4" />
                {submitting ? 'Adding...' : 'Add Breed'}
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
                    placeholder="Search by breed name..."
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
                <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover/search:w-full transition-all duration-500 ${isDark ? 'bg-amber-500' : 'bg-amber-600'}`} />
                <CornerBrackets />
              </div>

              {/* Filter Card */}
              <div className="relative">
                <div className={`relative p-5 border cursor-pointer transition-all ${
                  isDark ? 'bg-neutral-900/50 border-white/5 hover:border-amber-500/20' : 'bg-white border-neutral-300 hover:border-amber-500/30 shadow-sm'
                }`} onClick={() => setFilterSpeciesOpen(!filterSpeciesOpen)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">
                        {selectedSpecies === 'all' ? 'All Species' : selectedSpecies}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${filterSpeciesOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets />
                </div>

                {filterSpeciesOpen && (
                  <div className={`absolute top-full mt-2 right-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${
                    isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                  }`}>
                    {['all', ...speciesList.map(s => s.name)].map((species) => (
                      <button
                        key={species}
                        onClick={() => {
                          setSelectedSpecies(species);
                          setFilterSpeciesOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`cursor-pointer w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          selectedSpecies === species
                            ? isDark
                              ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-400'
                              : 'bg-amber-50 text-amber-700 border-l-2 border-amber-600'
                            : isDark
                            ? 'hover:bg-white/5'
                            : 'hover:bg-neutral-50'
                        }`}
                      >
                        {species === 'all' ? 'All Species' : species}
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
                    ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600' 
                    : 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-sm'
                }`}
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </section>

          {/* BREEDS GRID */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-amber-500/50' : 'bg-amber-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                All Breeds
              </h2>
              {loading && <span className="text-xs text-amber-500 font-mono animate-pulse">SYNCING...</span>}
            </div>
            
            {loading && breeds.length === 0 ? (
              <div className={`relative p-16 border text-center ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2 uppercase tracking-tight`}>
                  Loading breeds...
                </h3>
                <CornerBrackets />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentRecords.map((breedItem) => (
                  <div key={breedItem.id || breedItem._id} className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 group ${
                    isDark ? 'bg-neutral-900/50 border-white/5 hover:border-amber-500/20' : 'bg-white border-neutral-300 hover:border-amber-500/30 shadow-sm'
                  }`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight mb-1`}>
                          {breedItem.name}
                        </h3>
                        <p className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          {breedItem.origin || 'Unknown Origin'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 border text-[9px] font-bold font-mono uppercase tracking-wider ${
                        isDark
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {breedItem.species}
                      </span>
                    </div>

                    {/* Description */}
                    {breedItem.description && (
                      <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {breedItem.description}
                      </p>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          Purpose
                        </span>
                        <p className={`text-sm font-bold truncate ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                          {breedItem.purpose || '-'}
                        </p>
                      </div>
                      <div>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          Total
                        </span>
                        <p className={`${spaceGrotesk.className} text-xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {breedItem.totalAnimals || 0}
                        </p>
                      </div>
                      <div>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          Healthy
                        </span>
                        <p className={`${spaceGrotesk.className} text-xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {breedItem.healthyCount || 0}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className={`flex items-center gap-1 pt-4 border-t ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                      <button 
                        className={`cursor-pointer flex-1 p-2.5 border transition-all ${
                          isDark 
                            ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                            : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                        }`} 
                        title="View Details"
                        onClick={() => setViewingBreed(breedItem)}
                      >
                        <Eye className="w-4 h-4 mx-auto" />
                      </button>
                      <button 
                        className={`cursor-pointer flex-1 p-2.5 border transition-all ${
                          isDark 
                            ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                            : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                        }`} 
                        title="Edit"
                        onClick={() => handleOpenForm(breedItem)}
                        disabled={submitting}
                      >
                        <Edit className="w-4 h-4 mx-auto" />
                      </button>
                      <button 
                        className={`cursor-pointer flex-1 p-2.5 border transition-all ${
                          isDark 
                            ? 'hover:bg-red-500/20 text-red-400 border-white/10 hover:border-red-500/20' 
                            : 'hover:bg-red-50 text-red-600 border-neutral-200 hover:border-red-200'
                        }`} 
                        title="Delete"
                        onClick={() => setDeleteConfirm(breedItem)}
                        disabled={submitting}
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>

                    {/* Hover Effect */}
                    <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-amber-500' : 'bg-amber-600'}`} />
                    <CornerBrackets />
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredBreeds.length === 0 && (
              <div className={`relative p-16 border text-center ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <Dna className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-neutral-800' : 'text-neutral-200'}`} />
                <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2 uppercase tracking-tight`}>
                  No breeds found
                </h3>
                <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  {breeds.length === 0 ? 'Add your first breed to get started' : 'Try adjusting your search or filter criteria'}
                </p>
                <CornerBrackets />
              </div>
            )}

            {/* Pagination */}
            {filteredBreeds.length > 0 && (
              <div className={`flex items-center justify-between p-6 border ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredBreeds.length)} of {filteredBreeds.length} results
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
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-amber-50 border-amber-200 text-amber-700'
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

      {/* ADD/EDIT BREED FORM MODAL */}
      {showBreedForm && (
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
                  <div className={`h-[2px] w-6 ${isDark ? 'bg-amber-500' : 'bg-amber-600'}`} />
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${
                    isDark ? 'text-amber-400' : 'text-amber-600'
                  }`}>
                    {editingBreed ? 'EDIT_MODE' : 'CREATE_MODE'}
                  </span>
                </div>
                <h2 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight`}>
                  {editingBreed ? 'Edit Breed' : 'Add New Breed'}
                </h2>
              </div>
              <button
                onClick={handleCloseForm}
                className={`cursor-pointer p-2.5 border transition-colors ${
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Breed Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-amber-500 placeholder:text-neutral-600' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-amber-500 placeholder:text-neutral-400'
                    }`}
                    placeholder="e.g., Angus"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Species *
                  </label>
                  <select
                    value={formData.species}
                    onChange={(e) => setFormData({...formData, species: e.target.value})}
                    className={`cursor-pointer w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                      isDark 
                        ? 'bg-neutral-900 border-white/10 focus:border-amber-500' 
                        : 'bg-neutral-50 border-neutral-300 focus:border-amber-500'
                    }`}
                    disabled={submitting}
                  >
                    {speciesList.map((s) => (
                      <option key={s.id || s._id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Origin
                </label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => setFormData({...formData, origin: e.target.value})}
                  className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                    isDark 
                      ? 'bg-neutral-900 border-white/10 focus:border-amber-500 placeholder:text-neutral-600' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-amber-500 placeholder:text-neutral-400'
                  }`}
                  placeholder="e.g., Scotland"
                  disabled={submitting}
                />
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
                      ? 'bg-neutral-900 border-white/10 focus:border-amber-500 placeholder:text-neutral-600' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-amber-500 placeholder:text-neutral-400'
                  }`}
                  placeholder="Brief description of the breed..."
                  disabled={submitting}
                />
              </div>
              
              <div>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Purpose
                </label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                    isDark 
                      ? 'bg-neutral-900 border-white/10 focus:border-amber-500 placeholder:text-neutral-600' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-amber-500 placeholder:text-neutral-400'
                  }`}
                  placeholder="e.g., Beef, Dairy"
                  disabled={submitting}
                />
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
                      ? 'bg-neutral-900 border-white/10 focus:border-amber-500 placeholder:text-neutral-600' 
                      : 'bg-neutral-50 border-neutral-300 focus:border-amber-500 placeholder:text-neutral-400'
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
                      ? 'bg-amber-400 cursor-not-allowed'
                      : 'bg-amber-600 hover:bg-amber-700'
                  } text-white border-amber-600 transition-all`}
                >
                  {submitting ? 'Saving...' : editingBreed ? 'Update Breed' : 'Add Breed'}
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
                Delete Breed?
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
                  onClick={() => deleteBreed(deleteConfirm.id || deleteConfirm._id)}
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

      {/* VIEW BREED MODAL */}
      {viewingBreed && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-3xl w-full p-8 border ${
            isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
          } shadow-2xl max-h-[90vh] overflow-y-auto`}>
            <div>
              {/* Header */}
              <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`h-[2px] w-6 ${isDark ? 'bg-amber-500' : 'bg-amber-600'}`} />
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${
                      isDark ? 'text-amber-400' : 'text-amber-600'
                    }`}>
                      BREED_PROFILE
                    </span>
                  </div>
                  <h3 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                    {viewingBreed.name}
                  </h3>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    {viewingBreed.origin || 'Unknown Origin'}
                  </p>
                </div>
                <button
                  onClick={() => setViewingBreed(null)}
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
                    Species
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${
                    isDark
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {viewingBreed.species}
                  </span>
                </div>

                {viewingBreed.description && (
                  <div className="md:col-span-2">
                    <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      Description
                    </label>
                    <p className="text-sm font-medium">{viewingBreed.description}</p>
                  </div>
                )}

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Purpose
                  </label>
                  <p className={`text-lg font-bold ${spaceGrotesk.className}`}>{viewingBreed.purpose || '-'}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Total Animals
                  </label>
                  <p className={`${spaceGrotesk.className} text-2xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {viewingBreed.totalAnimals || 0}
                  </p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Healthy Count
                  </label>
                  <p className={`${spaceGrotesk.className} text-2xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {viewingBreed.healthyCount || 0}
                  </p>
                </div>

                {viewingBreed.characteristics && (
                  <div className="md:col-span-2">
                    <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      Key Characteristics
                    </label>
                    <p className="text-sm font-medium">{viewingBreed.characteristics}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <button
                  onClick={() => setViewingBreed(null)}
                  className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                    isDark 
                      ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' 
                      : 'bg-white hover:bg-neutral-50 border-neutral-300'
                  }`}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleOpenForm(viewingBreed);
                    setViewingBreed(null);
                  }}
                  className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-amber-600 hover:bg-amber-700 text-white border-amber-600 transition-all"
                >
                  Edit Breed
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
