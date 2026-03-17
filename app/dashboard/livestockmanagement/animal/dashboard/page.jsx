"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import dashboardService from '@/services/dashboardService';
import animalService from '@/services/animalService';
import breedService from '@/services/breedService';

import {
  Activity,
  HeartPulse,
  ThermometerSun,
  Skull,
  TrendingUp,
  Crown,        // instead of Cow
  Coffee,       // instead of MilkBottle
  Star
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// Normalize animal to handle different field names
const normalizeAnimal = (animal) => {
  return {
    id: animal.id,
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

export default function LivestockOverview() {
  const { isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pathname = usePathname();
  const [populationStats, setPopulationStats] = useState([]);
  const [speciesStats, setSpeciesStats] = useState([]);
  // const [breedStats, setBreedStats] = useState([]);




  // 🔹 API DATA STATES
  const [populationData, setPopulationData] = useState({
    cows: 0,
    heifers: 0,
    bulls: 0,
    weaners: 0,
    calves: 0
  });
  const [healthData, setHealthData] = useState({
    healthy: 0,
    sick: 0,
    treatment: 0,
    deceased: 0
  });
  const [salesData, setSalesData] = useState({
    milkSales: 0,
    meatSales: 0,
    otherSales: 0
  });

  // ...existing code...

  const [breedStats, setBreedStats] = useState([]);

  // Fetch Overview Data
  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [populationRes, healthRes, salesRes] = await Promise.all([
        dashboardService.getPopulationOverview(),
        dashboardService.getHealthOverview(),
        dashboardService.getSalesOverview(),
      ]);
      setPopulationData(populationRes?.data || {
        cows: 0,
        heifers: 0,
        bulls: 0,
        weaners: 0,
        calves: 0
      });
      setHealthData(healthRes?.data || {
        healthy: 0,
        sick: 0,
        treatment: 0,
        deceased: 0
      });
      setSalesData(salesRes?.data || {
        milkSales: 0,
        meatSales: 0,
        otherSales: 0
      });
    } catch (error) {
      console.error("❌ Overview API Error:", error);
      setError(error.message || 'Failed to fetch overview data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnimalsSpecies = async () => {
    try {
      setLoading(true);
      setError(null);

      const [speciesData, animalsData] = await Promise.all([
        animalService.getSpecies(),
        animalService.getAnimals()
      ].map(p => p.catch(e => {
        console.error("API Fetch Error:", e);
        return null;
      })));
      const [breedsData] = await Promise.all([
        breedService.getBreeds()
      ].map(p => p.catch(e => {
        console.error("API Fetch Error:", e);
        return null;
      })));
      console.log(breedsData, "breedsData");


      let speciesList = [];
      if (speciesData && speciesData.success) {
        speciesList = speciesData.data || [];
      } else if (Array.isArray(speciesData)) {
        speciesList = speciesData;
      }

      let breedsList = [];
      if (breedsData && breedsData.success) {
        breedsList = breedsData.data || [];
      } else if (Array.isArray(breedsData)) {
        breedsList = breedsData;
      }

      let animalList = [];
      if (animalsData && animalsData.success) {
        animalList = (animalsData.data || []).map(normalizeAnimal);
      } else if (Array.isArray(animalsData)) {
        animalList = animalsData.map(normalizeAnimal);
      }

      // Calculate real-time counts from animal list
      const typeCounts = animalList.reduce((acc, animal) => {
        const type = animal.animalType;
        if (type) acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const breedCounts = animalList.reduce((acc, animal) => {
        const breed = animal.breed;
        if (breed) acc[breed] = (acc[breed] || 0) + 1;
        return acc;
      }, {});

      const typeColorMap = {
        'Cow': 'text-emerald-500',
        'Heifer': 'text-blue-500',
        'Bull': 'text-indigo-500',
        'Weaner': 'text-amber-500',
        'Calf': 'text-pink-500'
      };

      const breedColorMap = {
        'Holstein': 'bg-blue-500',
        'Jersey': 'bg-yellow-500',
        'Ayrshire': 'bg-green-500',
        'Guernsey': 'bg-orange-500'
      };

      // Map each registered species to a stat card
      const speciesStats = speciesList.map(s => {
        const name = s.name || s;
        const pluralName = name.endsWith('y') ? name.slice(0, -1) + 'ies' : (name.endsWith('s') ? name : name + 's');
        return {
          label: pluralName,
          value: typeCounts[name] || 0,
          color: typeColorMap[name] || 'text-neutral-500',
          icon: Activity
        };
      });

      // Map each registered breed to a stat card
      const mappedBreedStats = breedsList.map(b => {
        const name = b.name || b;
        return {
          label: name,
          value: breedCounts[name] || 0,
          color: breedColorMap[name] || 'bg-neutral-500',
          icon: Crown,
          status: breedCounts[name] > 0 ? "Present" : "None"
        };
      });

      setSpeciesStats(speciesStats);
      setBreedStats(mappedBreedStats);
    } catch (error) {
      console.error("❌ Error fetching species population:", error);
      setError('Failed to fetch population data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([
      fetchOverviewData(),
      fetchAnimalsSpecies()
    ]);
  };

  useEffect(() => {
    fetchOverviewData();
    fetchAnimalsSpecies();
  }, []);

  // --- LIVESTOCK DATA ---
  // const populationStats = [
  //   { label: "Cows", value: populationData?.cows ?? 0, color: "text-emerald-500", icon: Activity },
  //   { label: "Heifers", value: populationData?.heifers ?? 0, color: "text-blue-500", icon: Activity },
  //   { label: "Bulls", value: populationData?.bulls ?? 0, color: "text-indigo-500", icon: Activity },
  //   { label: "Weaners", value: populationData?.weaners ?? 0, color: "text-amber-500", icon: Activity },
  //   { label: "Calves", value: populationData?.calves ?? 0, color: "text-pink-500", icon: Activity },
  // ];

  const healthStats = [
    { label: "Healthy", value: healthData?.healthy ?? 0, color: "bg-green-500", icon: Activity, status: "Optimal" },
    { label: "Sick", value: healthData?.sick ?? 0, color: "bg-rose-500", icon: ThermometerSun, status: "Critical" },
    { label: "Treatment", value: healthData?.treatment ?? 0, color: "bg-amber-500", icon: HeartPulse, status: "Monitoring" },
    { label: "Deceased", value: healthData?.deceased ?? 0, color: "bg-slate-500", icon: Skull, status: "Archived" },
  ];

  const totalSales = (salesData?.milkSales ?? 0) + (salesData?.meatSales ?? 0) + (salesData?.otherSales ?? 0);

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
    <div className={`min-h-screen transition-colors duration-300 ${inter.className} ${isDark ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-900'
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

      {/* NAVBAR WITH SIDEBAR */}
      <Navbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="Search ID, tag..."
      />

      {/* MAIN CONTENT - MAIN BRANCH MARGIN */}
      <div className={`${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-10">

          {/* MODERNIZED TITLE & TABS */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="font-mono text-[10px] text-green-500/70 uppercase tracking-[0.3em]">
                  LIVESTOCK_SYSTEM
                </span>
              </div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-2`}>
                Livestock <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Analytics</span>
              </h1>
              <p className={`font-light ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Real-time monitoring of herd population and health metrics.
              </p>
              {loading && (
                <span className="text-xs text-green-500 font-mono mt-2">SYNCING_DATA...</span>
              )}
              {error && (
                <span className="text-xs text-red-500 font-mono mt-2">{error}</span>
              )}
            </div>

            {/* Enhanced Tab Navigation */}
            <div className={`flex p-1.5 border backdrop-blur-md ${isDark ? 'bg-neutral-900/50 border-white/10' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
              <Link href="/dashboard/livestockmanagement/animal/dashboard">
                <button
                  className={`px-6 cursor-pointer py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${isActive('/livestockmanagement/animal/dashboard')
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
              <Link href="/dashboard/livestockmanagement/animal/sheds">
                <button
                  className={`px-6 cursor-pointer py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${isActive('/livestockmanagement/animal/sheds')
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
              <Link href="/dashboard/livestockmanagement/animal/animals">
                <button
                  className={`cursor-pointer px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${isActive('/livestockmanagement/animal/animals')
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

          {/* Refresh Button Row */}
          <div className="flex justify-end">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 border text-xs font-mono font-bold uppercase tracking-wider transition-all ${loading
                  ? 'opacity-50 cursor-not-allowed'
                  : isDark
                    ? 'hover:bg-white/5 border-white/10 hover:border-green-500/20'
                    : 'hover:bg-neutral-50 border-neutral-200 hover:border-green-300'
                }`}
            >
              {loading ? '⟳ REFRESHING...' : '⟲ REFRESH DATA'}
            </button>
          </div>

          <hr className={isDark ? 'border-white/10' : 'border-neutral-200'} />

          {/* 1. SPECIES STATS */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                Total Species
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {loading ? (
                // Loading skeletons
                Array(5).fill(0).map((_, idx) => (
                  <div key={idx} className={`relative p-6 border animate-pulse ${isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-200'
                    }`}>
                    <div className="h-8 w-8 bg-neutral-700/20 rounded mb-4"></div>
                    <div className="h-6 w-16 bg-neutral-700/20 rounded mb-2"></div>
                    <div className="h-4 w-20 bg-neutral-700/20 rounded"></div>
                  </div>
                ))
              ) : (
                speciesStats.map((stat, idx) => (
                  <div key={idx} className={`cursor-pointer relative p-6 border transition-all duration-300 hover:-translate-y-1 group ${isDark ? 'bg-neutral-900/50 border-white/10 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                    }`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                        }`}>{stat.label}</span>
                      <stat.icon className={`w-4 h-4 ${stat.color} opacity-80`} />
                    </div>
                    <h3 className={`${spaceGrotesk.className} text-4xl font-bold`}>{stat.value}</h3>
                    <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'
                      }`} />
                    <CornerBrackets />
                  </div>
                ))
              )}
            </div>
          </section>

          {/* 1. Breed STATS */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                Total BREED
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {loading ? (
                // Loading skeletons
                Array(5).fill(0).map((_, idx) => (
                  <div key={idx} className={`relative p-6 border animate-pulse ${isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-200'
                    }`}>
                    <div className="h-8 w-8 bg-neutral-700/20 rounded mb-4"></div>
                    <div className="h-6 w-16 bg-neutral-700/20 rounded mb-2"></div>
                    <div className="h-4 w-20 bg-neutral-700/20 rounded"></div>
                  </div>
                ))
              ) : (
                breedStats.map((stat, idx) => (
                  <div key={idx} className={`cursor-pointer relative p-6 border transition-all duration-300 hover:-translate-y-1 group ${isDark ? 'bg-neutral-900/50 border-white/10 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                    }`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                        }`}>{stat.label}</span>
                      <stat.icon className={`w-4 h-4 ${stat.color} opacity-80`} />
                    </div>
                    <h3 className={`${spaceGrotesk.className} text-4xl font-bold`}>{stat.value}</h3>
                    <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'
                      }`} />
                    <CornerBrackets />
                  </div>
                ))
              )}
            </div>
          </section>

          {/* 2. HEALTH STATUS */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-red-500/50' : 'bg-red-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                Health Status
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {loading ? (
                // Loading skeletons
                Array(4).fill(0).map((_, idx) => (
                  <div key={idx} className={`relative p-6 border animate-pulse ${isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-200'
                    }`}>
                    <div className="h-8 w-8 bg-neutral-700/20 rounded mb-4"></div>
                    <div className="h-6 w-16 bg-neutral-700/20 rounded mb-2"></div>
                    <div className="h-4 w-20 bg-neutral-700/20 rounded"></div>
                  </div>
                ))
              ) : (
                healthStats.map((stat, idx) => (
                  <div key={idx} className={`cursor-pointer relative p-6 border transition-all duration-300 group ${isDark ? 'bg-neutral-900/50 border-white/10 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                    }`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`p-2.5 border ${isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-50 border-neutral-200'}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-1 border ${isDark ? 'border-white/10' : 'border-neutral-300'
                        }`}>
                        {stat.status}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest font-mono block mb-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                          }`}>
                          {stat.label}
                        </span>
                        <h3 className={`${spaceGrotesk.className} text-4xl font-bold`}>{stat.value}</h3>
                      </div>
                      <div className={`h-1.5 w-12 rounded-full mb-2 ${stat.color}`}></div>
                    </div>
                    <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'
                      }`} />
                    <CornerBrackets />
                  </div>
                ))
              )}
            </div>
          </section>

          {/* 3. SALES & TRENDS */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-yellow-500/50' : 'bg-yellow-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                Sales & Trends
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`relative cursor-pointer p-6 border group ${isDark ? 'bg-neutral-900/50 border-white/10 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 border ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                    }`}>
                    <TrendingUp size={18} className="text-emerald-500" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                    Sold This Month
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <h3 className={`${spaceGrotesk.className} text-4xl font-bold`}>
                    {loading ? '...' : totalSales}
                  </h3>
                  <span className="text-xs font-bold text-emerald-500">+15% vs last mo.</span>
                </div>

                <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-green-500' : 'bg-green-600'
                  }`} />
                <CornerBrackets />
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}