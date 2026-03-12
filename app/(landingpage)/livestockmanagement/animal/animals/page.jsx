"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import axiosInstance from '../../../../../utils/axios';
import { 
  Search, Filter, Plus, Eye, Edit, Trash2, ChevronDown, X, Download,
  Activity, AlertCircle, FileText
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const API_URL = '/animals';

export default function AnimalsManagement() {
  const [isDark, setIsDark] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTypeOpen, setFilterTypeOpen] = useState(false);
  const [filterSpeciesOpen, setFilterSpeciesOpen] = useState(false);
  const [filterHealthOpen, setFilterHealthOpen] = useState(false);
  const [filterStatusOpen, setFilterStatusOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedHealth, setSelectedHealth] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewingAnimal, setViewingAnimal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    animalType: 'Cow',
    gender: 'Female',
    status: 'Active',
    healthStatus: 'Healthy',
    breed: '',
    shedId: '',
    shedName: '',
    registrationDate: new Date().toISOString().split('T')[0]
  });

  const [breeds, setBreeds] = useState([]);
  const [species, setSpecies] = useState([]);
  const [sheds, setSheds] = useState([]);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- ANIMALS DATA ---
  const [animals, setAnimals] = useState([]);

  // ...existing code...

  // Normalize animal to handle different field names
  const normalizeAnimal = (animal) => {
    return {
      id: animal.id,
      name: animal.animalName || animal.name || '',
      dateOfBirth: animal.dob || animal.dateOfBirth || '',
      animalType: animal.animalType || 'Cow',
      gender: animal.gender || 'Female',
      status: animal.status || 'Active',
      healthStatus: animal.healthStatus || 'Healthy',
      breed: animal.breed || '',
      shedId: animal.Shed?.id || animal.shedId || '',
      shedName: animal.Shed?.shedName || animal.shedName || '',
      registrationDate: animal.registrationDate || (animal.createdAt ? new Date(animal.createdAt).toISOString().split('T')[0] : '')
    };
  };

  // Fetch Animals from API
  const fetchAnimals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(API_URL);
      if (response.data && response.data.success) {
        const fetchedAnimals = (response.data.data || []).map(normalizeAnimal);
        setAnimals(fetchedAnimals);
        localStorage.setItem('livestockAnimals', JSON.stringify(fetchedAnimals));
      } else if (Array.isArray(response.data)) {
        const fetchedAnimals = response.data.map(normalizeAnimal);
        setAnimals(fetchedAnimals);
        localStorage.setItem('livestockAnimals', JSON.stringify(fetchedAnimals));
      } else {
        console.warn("Unexpected API response format:", response.data);
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("❌ Error fetching animals:", error);
      setError('Failed to fetch animals');
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Load from localStorage as fallback
  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('livestockAnimals');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setAnimals(parsed);
        } catch (e) {
          console.error('Error parsing stored animals:', e);
          setAnimals([]);
        }
      } else {
        setAnimals([]);
      }
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAnimals();
    fetchShedsList();
    fetchTaxonomy();
  }, []);

  // Handle URL Query Params
  useEffect(() => {
    const addAnimal = searchParams.get('addAnimal');
    const shedId = searchParams.get('shedId');
    const shedName = searchParams.get('shedName');

    if (addAnimal === 'true') {
      setShowAnimalForm(true);
      if (shedId || shedName) {
        setFormData(prev => ({
          ...prev,
          shedId: shedId || prev.shedId,
          shedName: shedName ? decodeURIComponent(shedName) : prev.shedName
        }));
      }
    }
  }, [searchParams]);


  // Save to localStorage whenever animals change (backup)
  useEffect(() => {
    if (animals.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('livestockAnimals', JSON.stringify(animals));
    }
  }, [animals]);

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = (animal.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (animal.breed || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || animal.animalType === selectedType;
    const matchesSpecies = selectedSpecies === 'all' || animal.animalType === selectedSpecies;
    const matchesHealth = selectedHealth === 'all' || animal.healthStatus === selectedHealth;
    const matchesStatus = selectedStatus === 'all' || animal.status === selectedStatus;
    const matchesBreed = selectedStatus === 'all' || (animal.breed || '').toLowerCase().includes(searchTerm.toLowerCase());
    return (matchesSearch || matchesBreed) && matchesType && matchesSpecies && matchesHealth && matchesStatus;
  });

  // Fetch Sheds for dropdown
  const fetchShedsList = async () => {
    try {
      const response = await axiosInstance.get('/sheds');
      if (response.data && response.data.success) {
        setSheds(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching sheds:", err);
    }
  };

  // Fetch Taxonomy from JSON
  const fetchTaxonomy = async () => {
    try {
      const spResp = await fetch('/data/species.json');
      const brResp = await fetch('/data/breeds.json');
      if (spResp.ok) setSpecies(await spResp.json());
      if (brResp.ok) setBreeds(await brResp.json());
    } catch (err) {
      console.error("Error fetching taxonomy:", err);
    }
  };


  // Handle Add/Edit Animal
  const handleOpenForm = (animal = null) => {
    if (animal) {
      setEditingAnimal(animal);
      setFormData({
        name: animal.name || '',
        dateOfBirth: animal.dateOfBirth || '',
        animalType: animal.animalType || 'Cow',
        gender: animal.gender || 'Female',
        status: animal.status || 'Active',
        healthStatus: animal.healthStatus || 'Healthy',
        breed: animal.breed || '',
        shedId: animal.shedId || '',
        shedName: animal.shedName || '',
        registrationDate: animal.registrationDate || (animal.createdAt ? new Date(animal.createdAt).toISOString().split('T')[0] : '')
      });
    } else {
      setEditingAnimal(null);
      setFormData({
        dateOfBirth: '',
        animalType: species[0] || 'Cow',
        gender: 'Female',
        status: 'Active',
        healthStatus: 'Healthy',
        breed: breeds[0] || '',
        get shedId() { return searchParams.get('shedId') || ''; },
        get shedName() { return searchParams.get('shedName') ? decodeURIComponent(searchParams.get('shedName')) : ''; },
        registrationDate: new Date().toISOString().split('T')[0]
      });
    }
    setShowAnimalForm(true);
  };

  const handleCloseForm = () => {
    setShowAnimalForm(false);
    setEditingAnimal(null);
    setFormData({
      dateOfBirth: '',
      animalType: 'Cow',
      gender: 'Female',
      status: 'Active',
      healthStatus: 'Healthy',
      breed: '',
      shedId: '',
      shedName: '',
      registrationDate: new Date().toISOString().split('T')[0]
    });
  };

  // Submit Handler - API Integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dateOfBirth || !formData.breed || !formData.shedId) {
      return;
    }
    setSubmitting(true);
    setError(null);
    const apiData = {
      dob: formData.dateOfBirth,
      animalType: formData.animalType,
      gender: formData.gender,
      status: formData.status,
      healthStatus: formData.healthStatus,
      breed: formData.breed,
      shedId: formData.shedId,
      registrationDate: formData.registrationDate
    };

    try {
      if (editingAnimal) {
        // Update existing animal
        const response = await axiosInstance.patch(`${API_URL}/${editingAnimal.id}`, apiData);
        if (response.data && response.data.success) {
          await fetchAnimals();
          setSearchTerm('');
          setSelectedType('all');
          setSelectedSpecies('all');
          setSelectedHealth('all');
          setSelectedStatus('all');
        }
      } else {
        // Add new animal
        const response = await axiosInstance.post(API_URL, apiData);
        if (response.data && response.data.success) {
          await fetchAnimals();
          setSearchTerm('');
          setSelectedType('all');
          setSelectedSpecies('all');
          setSelectedHealth('all');
          setSelectedStatus('all');
        }
      }
      handleCloseForm();
    } catch (error) {
      console.error("❌ API Error, saving locally:", error);
      const newAnimal = {
        id: editingAnimal ? editingAnimal.id : (animals.length > 0 ? Math.max(...animals.map(a => a.id)) + 1 : 1),
        dateOfBirth: formData.dateOfBirth,
        animalType: formData.animalType,
        gender: formData.gender,
        status: formData.status,
        healthStatus: formData.healthStatus,
        breed: formData.breed,
        shedId: formData.shedId,
        shedName: sheds.find(s => s.id.toString() === formData.shedId)?.shedName || formData.shedName,
        registrationDate: formData.registrationDate
      };

      let updatedAnimals;
      if (editingAnimal) {
        updatedAnimals = animals.map(a => a.id === editingAnimal.id ? newAnimal : a);
      } else {
        updatedAnimals = [newAnimal, ...animals];
      }
      setAnimals(updatedAnimals);
      localStorage.setItem('livestockAnimals', JSON.stringify(updatedAnimals));
      setSearchTerm('');
      setSelectedType('all');
      setSelectedSpecies('all');
      setSelectedHealth('all');
      setSelectedStatus('all');
      handleCloseForm();
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler - API Integration
  const handleDelete = async (id) => {
    try {
      setSubmitting(true);
      await axiosInstance.delete(`${API_URL}/${id}`);
      await fetchAnimals();
      setDeleteConfirm(null);
    } catch (error) {
      console.error("❌ Delete failed, deleting locally:", error);
      const updatedAnimals = animals.filter(a => a.id !== id);
      setAnimals(updatedAnimals);
      localStorage.setItem('livestockAnimals', JSON.stringify(updatedAnimals));
      setDeleteConfirm(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Date of Birth', 'Animal Type', 'Gender', 'Status', 'Health Status', 'Breed'],
      ...filteredAnimals.map(a => [a.name, a.dateOfBirth, a.animalType, a.gender, a.status, a.healthStatus, a.breed])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'animals-export.csv';
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

  const isActive = (path) => pathname === path;

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
      {(showAnimalForm || deleteConfirm || viewingAnimal) && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => {
            handleCloseForm();
            setDeleteConfirm(null);
            setViewingAnimal(null);
          }}
        ></div>
      )}

      {/* NAVBAR WITH SIDEBAR */}
      <Navbar 
        isDark={isDark} 
        setIsDark={setIsDark} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="Search ID, tag..."
      />

      {/* MAIN CONTENT */}
      <div className={`${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">
          
          {/* MODERNIZED TITLE & TABS */}
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
                Animals <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Management</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Track and manage your livestock animals, their health status, and breeding information.
              </p>
              {loading && (
                <span className="text-xs text-green-500 font-mono mt-2">SYNCING_DATA...</span>
              )}
              {error && (
                <span className="text-xs text-red-500 font-mono mt-2">{error}</span>
              )}
            </div>
            
            {/* Enhanced Tab Navigation */}
            <div className={`flex p-1.5 border backdrop-blur-md ${
              isDark ? 'bg-neutral-900/50 border-white/10' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              <Link href="/livestockmanagement/animal/dashboard">
                <button 
                  className={`cursor-pointer px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive('/livestockmanagement/animal/dashboard')
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark 
                        ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  Overview
                </button>
              </Link>
              <Link href="/livestockmanagement/animal/sheds">
                <button 
                  className={`cursor-pointer px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive('/livestockmanagement/animal/sheds')
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark 
                        ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  Sheds
                </button>
              </Link>
              <Link href="/livestockmanagement/animal/animals">
                <button 
                  className={`cursor-pointer px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive('/livestockmanagement/animal/animals')
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                        : 'bg-green-500/10 text-green-700 border border-green-500/30'
                      : isDark 
                        ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  Animals
                </button>
              </Link>
            </div>
          </div>

          {/* ENHANCED HEADER SECTION */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
                <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  Animal Records
                </h2>
                <button
                  onClick={fetchAnimals}
                  disabled={loading}
                  className={`ml-2 text-xs font-mono px-2 py-1 border transition-all ${
                    loading 
                      ? 'opacity-50 cursor-not-allowed' 
                      : isDark 
                        ? 'hover:bg-white/5 border-white/10 hover:border-green-500/20' 
                        : 'hover:bg-neutral-50 border-neutral-200 hover:border-green-300'
                  }`}
                  title="Refresh Data"
                >
                  {loading ? '...' : '⟲'}
                </button>
              </div>
              <button 
                className={`cursor-pointer group flex items-center gap-2 px-5 py-3 border transition-all duration-200 font-bold text-[11px] uppercase tracking-widest ${
                  isDark 
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700' 
                    : 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-sm'
                }`}
                onClick={() => handleOpenForm()}
                disabled={submitting}
              >
                <Plus className="w-4 h-4" />
                {submitting ? 'Saving...' : 'Add Animal'}
              </button>
            </div>
          </section>

          {/* ENHANCED SEARCH AND FILTERS */}
          <section className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search Card */}
              <div className={`relative p-5 border lg:col-span-2 group/search ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className="flex items-center gap-3">
                  <Search className={`w-5 h-5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                  <input
                    type="text"
                    placeholder="Search animals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm font-medium ${
                      isDark ? 'placeholder:text-neutral-600' : 'placeholder:text-neutral-400'
                    }`}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className={`p-1 transition-all ${
                        isDark ? 'hover:text-white text-neutral-400' : 'hover:text-neutral-900 text-neutral-500'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover/search:w-full transition-all duration-500 ${
                  isDark ? 'bg-green-500' : 'bg-green-600'
                }`} />
                <CornerBrackets />
              </div>

              {/* Filter by Type */}
              <div className="relative">
                <div className={`relative p-5 border cursor-pointer transition-all ${
                  isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                }`} onClick={() => setFilterTypeOpen(!filterTypeOpen)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Type</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${filterTypeOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets />
                </div>

                {filterTypeOpen && (
                  <div className={`absolute top-full mt-2 right-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${
                    isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                  }`}>
                    {['all', 'Unknown Classification', 'Cow', 'Bull', 'Calf', 'Heifer'].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedType(type);
                          setFilterTypeOpen(false);
                        }}
                        className={`cursor-pointer w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          selectedType === type
                            ? isDark
                              ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400'
                              : 'bg-green-50 text-green-700 border-l-2 border-green-600'
                            : isDark
                            ? 'hover:bg-white/5'
                            : 'hover:bg-neutral-50'
                        }`}
                      >
                        {type === 'all' ? 'All Types' : type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Filter by Species */}
              <div className="relative">
                <div className={`relative p-5 border cursor-pointer transition-all ${
                  isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                }`} onClick={() => setFilterSpeciesOpen(!filterSpeciesOpen)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Species</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${filterSpeciesOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets />
                </div>

                {filterSpeciesOpen && (
                  <div className={`absolute top-full mt-2 right-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${
                    isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                  }`}>
                    {['all', 'Holstein', 'Jersey', 'Angus'].map((species) => (
                      <button
                        key={species}
                        onClick={() => {
                          setSelectedSpecies(species);
                          setFilterSpeciesOpen(false);
                        }}
                        className={`cursor-pointer w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          selectedSpecies === species
                            ? isDark
                              ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400'
                              : 'bg-green-50 text-green-700 border-l-2 border-green-600'
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

              {/* Filter by Health */}
              <div className="relative">
                <div className={`relative p-5 border cursor-pointer transition-all ${
                  isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                }`} onClick={() => setFilterHealthOpen(!filterHealthOpen)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Health</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${filterHealthOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets />
                </div>

                {filterHealthOpen && (
                  <div className={`absolute top-full mt-2 right-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${
                    isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                  }`}>
                    {['all', 'Healthy', 'Sick', 'Treatment'].map((health) => (
                      <button
                        key={health}
                        onClick={() => {
                          setSelectedHealth(health);
                          setFilterHealthOpen(false);
                        }}
                        className={`cursor-pointer w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          selectedHealth === health
                            ? isDark
                              ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400'
                              : 'bg-green-50 text-green-700 border-l-2 border-green-600'
                            : isDark
                            ? 'hover:bg-white/5'
                            : 'hover:bg-neutral-50'
                        }`}
                      >
                        {health === 'all' ? 'All Health' : health}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Second Row - Status Filter and Actions */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Filter by Status */}
              <div className="relative md:w-64">
                <div className={`relative p-5 border cursor-pointer transition-all ${
                  isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                }`} onClick={() => setFilterStatusOpen(!filterStatusOpen)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Status</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${filterStatusOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets />
                </div>

                {filterStatusOpen && (
                  <div className={`absolute top-full mt-2 right-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${
                    isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                  }`}>
                    {['all', 'Active', 'Sold', 'Deceased'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setFilterStatusOpen(false);
                        }}
                        className={`cursor-pointer w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          selectedStatus === status
                            ? isDark
                              ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400'
                              : 'bg-green-50 text-green-700 border-l-2 border-green-600'
                            : isDark
                            ? 'hover:bg-white/5'
                            : 'hover:bg-neutral-50'
                        }`}
                      >
                        {status === 'all' ? 'All Status' : status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex-1 flex items-center justify-end gap-3">
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                    setSelectedSpecies('all');
                    setSelectedHealth('all');
                    setSelectedStatus('all');
                  }}
                  className={`flex cursor-pointer items-center gap-2 px-5 py-3 border transition-all font-bold text-[11px] uppercase tracking-widest ${
                    isDark 
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700' 
                      : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-300 shadow-sm'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  Clear
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
                  Export
                </button>
              </div>
            </div>
          </section>

          {/* ENHANCED ANIMALS TABLE */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-amber-500/50' : 'bg-amber-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                All Animals
              </h2>
            </div>
            
            {/* Table Container */}
            <div className={`relative border overflow-hidden ${
              isDark ? 'bg-neutral-900/30 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b ${
                    isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <tr>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>Breed</th>

                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>Date of Birth</th>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>Animal Type</th>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>Gender</th>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>Status</th>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>Health Status</th>
                      <th className={`px-6 py-4 text-left text-[9px] font-black uppercase tracking-[0.25em] font-mono ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>Breed</th>
                      <th className={`px-6 py-4 text-right text-[9px] font-black uppercase tracking-[0.25em] font-mono ${
                        isDark ? 'text-neutral-500' : 'text-neutral-400'
                      }`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-neutral-200'}`}>
                    {loading && animals.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="p-16 text-center">
                          <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                          <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                            Loading animals...
                          </p>
                        </td>
                      </tr>
                    ) : filteredAnimals.length > 0 ? (
                      filteredAnimals.map((animal) => (
                        <tr key={animal.id} className={`transition-colors ${
                          isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-50'
                        }`}>
                          <td className="px-6 py-4">
                            <p className={`font-bold ${spaceGrotesk.className}`}>{animal.breed}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                              {animal.dateOfBirth}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                              {animal.animalType}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                              {animal.gender}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${
                              animal.status === 'Active' 
                                ? isDark
                                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                  : 'bg-green-50 text-green-700 border-green-200'
                                : animal.status === 'Sold'
                                ? isDark
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                                : isDark
                                  ? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                                  : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                            }`}>
                              {animal.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${
                              animal.healthStatus === 'Healthy' 
                                ? isDark
                                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                  : 'bg-green-50 text-green-700 border-green-200'
                                : animal.healthStatus === 'Sick'
                                ? isDark
                                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                  : 'bg-red-50 text-red-700 border-red-200'
                                : isDark
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {animal.healthStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                              {animal.gender}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button 
                                className={`p-2.5 border transition-all ${
                                  isDark 
                                    ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                                    : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                                }`} 
                                title="View Details"
                                onClick={() => setViewingAnimal(animal)}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button 
                                className={`p-2.5 border transition-all ${
                                  isDark 
                                    ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                                    : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                                }`} 
                                title="View Records"
                                onClick={() => alert(`Records for: ${animal.name}`)}
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              {animal.healthStatus === 'Sick' && (
                                <button 
                                  className={`p-2.5 border transition-all ${
                                    isDark 
                                      ? 'hover:bg-red-500/10 text-red-400 border-white/10 hover:border-red-500/20' 
                                      : 'hover:bg-red-50 text-red-600 border-neutral-200 hover:border-red-300'
                                  }`} 
                                  title="Add Health Record"
                                  onClick={() => {
                                    router.push(`/livestockmanagement/health/records?addRecord=true&animalId=${animal.id}&species=${encodeURIComponent(animal.animalType)}&breed=${encodeURIComponent(animal.breed)}`);
                                  }}
                                >
                                  <Plus className="w-4 h-4 text-red-500" />
                                </button>
                              )}

                              <button 
                                className={`p-2.5 border transition-all ${
                                  isDark 
                                    ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                                    : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                                }`} 
                                title="Edit"
                                onClick={() => handleOpenForm(animal)}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button 
                                className={`p-2.5 border transition-all ${
                                  isDark 
                                    ? 'hover:bg-red-500/20 text-red-400 border-white/10 hover:border-red-500/20' 
                                    : 'hover:bg-red-50 text-red-600 border-neutral-200 hover:border-red-200'
                                }`} 
                                title="Delete"
                                onClick={() => setDeleteConfirm(animal)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8">
                          <div className="p-16 text-center">
                            <Activity className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-neutral-800' : 'text-neutral-200'}`} />
                            <h3 className={`${spaceGrotesk.className} text-2xl font-bold mb-2 uppercase tracking-tight`}>
                              No animals found
                            </h3>
                            <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                              Try adjusting your search or filter criteria
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <CornerBrackets />
            </div>
          </section>

        </main>
      </div>

      {/* ENHANCED ADD/EDIT ANIMAL FORM SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[500px] z-50 transform transition-transform duration-300 border-l ${
        showAnimalForm ? 'translate-x-0' : 'translate-x-full'
      } ${
        isDark ? 'bg-neutral-950 border-white/10' : 'bg-white border-neutral-200'
      } shadow-2xl overflow-y-auto`}>
        <div className="p-8">
          {/* Header */}
          <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-[2px] w-6 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
                <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>
                  {editingAnimal ? 'EDIT_MODE' : 'CREATE_MODE'}
                </span>
              </div>
              <h2 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                {editingAnimal ? 'Edit Animal' : 'Add Animal'}
              </h2>
              <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                {editingAnimal ? 'Update animal information' : 'Register a new animal'}
              </p>
            </div>
            <button
              onClick={handleCloseForm}
              className={`p-2.5 border transition-all ${
                isDark 
                  ? 'hover:bg-white/10 border-white/10 hover:border-white/20' 
                  : 'hover:bg-neutral-50 border-neutral-200 hover:border-neutral-300'
              }`}
              disabled={submitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shed Name */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Shed Name *
              </label>
              <select
                required
                value={formData.shedId}
                onChange={(e) => setFormData({...formData, shedId: e.target.value})}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                }`}
                disabled={submitting}
              >
                <option value="">Select a Shed</option>
                {sheds.map(shed => (
                  <option key={shed.id} value={shed.id}>
                    {shed.shedName || shed.name}
                  </option>
                ))}
              </select>
            </div>


            {/* Date of Birth */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                }`}
                disabled={submitting}
              />
            </div>

            {/* Animal Type */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Animal Type *
              </label>
              <select
                value={formData.animalType}
                onChange={(e) => setFormData({...formData, animalType: e.target.value})}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                }`}
                disabled={submitting}
              >
                {species.map(sp => (
                  <option key={sp} value={sp}>{sp}</option>
                ))}
              </select>
            </div>


            {/* Gender */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                }`}
                disabled={submitting}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            {/* Breed */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Breed *
              </label>
              <select
                required
                value={formData.breed}
                onChange={(e) => setFormData({...formData, breed: e.target.value})}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                }`}
                disabled={submitting}
              >
                <option value="">Select a Breed</option>
                {breeds.map(br => (
                  <option key={br} value={br}>{br}</option>
                ))}
              </select>
            </div>

            {/* Registration Date */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Registration Date
              </label>
              <input
                type="date"
                readOnly
                value={formData.registrationDate}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium cursor-not-allowed opacity-70 ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10' 
                    : 'bg-neutral-50 border-neutral-300'
                }`}
              />
            </div>


            {/* Status */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                }`}
                disabled={submitting}
              >
                <option value="Active">Active</option>
                <option value="Sold">Sold</option>
                <option value="Deceased">Deceased</option>
              </select>
            </div>

            {/* Health Status */}
            <div>
              <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                isDark ? 'text-neutral-500' : 'text-neutral-400'
              }`}>
                Health Status *
              </label>
              <select
                value={formData.healthStatus}
                onChange={(e) => setFormData({...formData, healthStatus: e.target.value})}
                className={`w-full px-4 py-3.5 border outline-none transition-all font-medium ${
                  isDark 
                    ? 'bg-neutral-900 border-white/10 focus:border-green-500' 
                    : 'bg-neutral-50 border-neutral-300 focus:border-green-500'
                }`}
                disabled={submitting}
              >
                <option value="Healthy">Healthy</option>
                <option value="Sick">Sick</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
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
                className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                  submitting
                    ? 'bg-green-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white border-green-600`}
              >
                {submitting ? 'Saving...' : (editingAnimal ? 'Update' : 'Add')}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ENHANCED DELETE CONFIRMATION MODAL */}
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
                Delete Animal?
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
                  onClick={() => handleDelete(deleteConfirm.id)}
                  disabled={submitting}
                  className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                    submitting
                      ? 'bg-red-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white border-red-600`}
                >
                  {submitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
            <CornerBrackets />
          </div>
        </div>
      )}

      {/* ENHANCED VIEW ANIMAL MODAL */}
      {viewingAnimal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-3xl w-full p-8 border ${
            isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
          } shadow-2xl`}>
            <div>
              {/* Header */}
              <div className={`flex items-center justify-between mb-8 pb-6 border-b ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`h-[2px] w-6 ${isDark ? 'bg-green-500' : 'bg-green-600'}`} />
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`}>
                      ANIMAL_PROFILE
                    </span>
                  </div>
                  <h3 className={`${spaceGrotesk.className} text-3xl font-bold uppercase tracking-tight mb-1`}>
                    Animal Details
                  </h3>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Complete information about this animal
                  </p>
                </div>
                <button
                  onClick={() => setViewingAnimal(null)}
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
                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Breed
                  </label>
                  <p className={`text-lg font-bold ${spaceGrotesk.className}`}>{viewingAnimal.breed}</p>
                </div>


                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Date of Birth
                  </label>
                  <p className="text-sm font-medium">{viewingAnimal.dateOfBirth}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Animal Type
                  </label>
                  <p className="text-sm font-medium">{viewingAnimal.animalType}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Gender
                  </label>
                  <p className="text-sm font-medium">{viewingAnimal.gender}</p>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Shed Name
                  </label>
                  <p className="text-sm font-medium">{viewingAnimal.shedName || 'N/A'}</p>
                </div>


                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${
                    viewingAnimal.status === 'Active' 
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-green-50 text-green-700 border-green-200'
                      : viewingAnimal.status === 'Sold'
                      ? isDark
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                      : isDark
                        ? 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                        : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                  }`}>
                    {viewingAnimal.status}
                  </span>
                </div>

                <div>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-2 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Health Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 border text-[10px] font-bold font-mono uppercase tracking-wider ${
                    viewingAnimal.healthStatus === 'Healthy' 
                      ? isDark
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-green-50 text-green-700 border-green-200'
                      : viewingAnimal.healthStatus === 'Sick'
                      ? isDark
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : 'bg-red-50 text-red-700 border-red-200'
                      : isDark
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {viewingAnimal.healthStatus}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-neutral-200'}`}>
                <button
                  onClick={() => setViewingAnimal(null)}
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
                    handleOpenForm(viewingAnimal);
                    setViewingAnimal(null);
                  }}
                  className="cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white border-green-600 transition-all"
                >
                  Edit Animal
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