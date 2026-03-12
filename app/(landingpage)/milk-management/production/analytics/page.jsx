"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  BarChart3, Calendar, TrendingUp, Search, Filter, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, ChevronDown, Edit, Trash2, X
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
const ANALYTICS_URL = `${API_BASE_URL}/milk/production/daily-records/analytics`;
const RECORDS_URL = `${API_BASE_URL}/milk/production/daily-records`;

export default function ProductionAnalytics() {
  const [isDark, setIsDark] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({ dailyAnalytics: [], summary: {} });
  const pathname = usePathname();

  // Helper to get headers with token
  const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get('accessToken')}`
  });

  // Fetch Analytics from API - WITHOUT date filters by default
  const fetchAnalytics = async (withDateFilter = false) => {
    try {
      setLoading(true);
      
      // Only include date params if they are explicitly set and withDateFilter is true
      const params = {};
      if (withDateFilter && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }
      
      const response = await axios.get(ANALYTICS_URL, {
        params,
        withCredentials: true,
        headers: getHeaders()
      });
      
      if (response.data && response.data.success) {
        setAnalyticsData(response.data.data);
        // Save to localStorage as backup
        localStorage.setItem('milkProductionAnalytics', JSON.stringify(response.data.data));
      } else {
        console.warn("Unexpected API response format:", response.data);
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("❌ Error fetching analytics:", error);
      // Fallback to localStorage
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Load from localStorage as fallback
  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('milkProductionAnalytics');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setAnalyticsData(parsed);
        } catch (e) {
          console.error('Error parsing stored analytics:', e);
          setAnalyticsData({ dailyAnalytics: [], summary: {} });
        }
      } else {
        setAnalyticsData({ dailyAnalytics: [], summary: {} });
      }
    }
  };

  // Initial data fetch - NO date filters
  useEffect(() => {
    fetchAnalytics(false); // false = no date filters
  }, []);

  // Filter analytics data based on search term (client-side filtering)
  const filteredAnalytics = (analyticsData.dailyAnalytics || []).filter(item => {
    return (item.date || '').includes(searchTerm) || 
           (item.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredAnalytics.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredAnalytics.slice(startIndex, startIndex + rowsPerPage);

  const isActive = (path) => pathname === path;

  // Apply filter - now with date parameters
  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    fetchAnalytics(true); // true = use date filters
    setCurrentPage(1);
  };

  // Reset filters - show all records
  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
    fetchAnalytics(false); // false = no date filters
    setCurrentPage(1);
  };

  // Delete all records for a specific date
  const handleDelete = async (date) => {
    setSubmitting(true);
    
    try {
      // First, get all records for this date
      const response = await axios.get(RECORDS_URL, {
        params: { 
          startDate: date,
          endDate: date 
        },
        withCredentials: true,
        headers: getHeaders()
      });
      
      if (response.data && response.data.success && response.data.data) {
        const recordsToDelete = response.data.data;
        
        // Delete each record
        const deletePromises = recordsToDelete.map(record => 
          axios.delete(`${RECORDS_URL}/${record.id || record._id}`, {
            withCredentials: true,
            headers: getHeaders()
          })
        );
        
        await Promise.all(deletePromises);
        
        // Refresh analytics
        await fetchAnalytics(false);
        
        // Close modal
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("❌ Error deleting records:", error);
      alert("Failed to delete records. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
      {deleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => !submitting && setDeleteConfirm(null)}
        />
      )}

      {/* NAVBAR WITH SIDEBAR */}
      <Navbar 
        isDark={isDark} 
        setIsDark={setIsDark} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="Search records..."
      />

      {/* MAIN CONTENT WRAPPER WITH DYNAMIC MARGIN */}
      <div className={`${sidebarOpen ? 'lg:ml-72' : 'ml-0'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">
          
          {/* MODERNIZED TITLE & TABS */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-2`}>
                Production <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">Analytics</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Comprehensive view of milk production performance and trends
              </p>
              {loading && (
                <span className="text-xs text-purple-500 font-mono mt-2">SYNCING_DATA...</span>
              )}
            </div>
            
            {/* Enhanced Tab Navigation */}
            <div className={`flex p-1.5 border backdrop-blur-md ${
              isDark ? 'bg-neutral-900/50 border-white/10' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              <Link 
                href="/milk-management/production/dashboard"
                className={`cursor-pointer flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  isActive('/milk-management/production/dashboard')
                    ? isDark
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-green-500/10 text-green-700 border border-green-500/30'
                    : isDark 
                      ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </Link>
              <Link 
                href="/milk-management/production/daily-records"
                className={`cursor-pointer flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  isActive('/milk-management/production/daily-records')
                    ? isDark
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-green-500/10 text-green-700 border border-green-500/30'
                    : isDark 
                      ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Daily Records
              </Link>
              <Link 
                href="/milk-management/production/analytics"
                className={`cursor-pointer flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  isActive('/milk-management/production/analytics')
                    ? isDark
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-green-500/10 text-green-700 border border-green-500/30'
                    : isDark 
                      ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </Link>
            </div>
          </div>

          {/* HEADER BANNER */}
          <section className={`relative p-6 border ${
            isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-start gap-4">
              <TrendingUp className={`w-6 h-6 mt-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <div>
                <h2 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight mb-1 ${
                  isDark ? 'text-purple-400' : 'text-purple-900'
                }`}>
                  Overall Production Analytics
                </h2>
                <p className={`text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                  {analyticsData.summary?.totalRecords || 0} total records • {analyticsData.summary?.totalMilk || 0} gallons total milk • {analyticsData.summary?.uniqueAnimals || 0} unique animals
                </p>
              </div>
            </div>
            <CornerBrackets />
          </section>

          {/* SEARCH AND FILTER BAR */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Box */}
              <div className={`flex-1 relative p-5 border ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className="flex items-center gap-3">
                  <Search className={`w-5 h-5 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                  <input
                    type="text"
                    placeholder="Search by date or notes..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className={`flex-1 bg-transparent outline-none text-sm font-medium ${
                      isDark ? 'placeholder:text-neutral-600' : 'placeholder:text-neutral-400'
                    }`}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className={`cursor-pointer p-1 transition-all ${
                        isDark ? 'hover:text-white text-neutral-400' : 'hover:text-neutral-900 text-neutral-500'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <CornerBrackets />
              </div>

              {/* Date Filters */}
              <div className={`relative p-5 border flex items-center gap-3 ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <Calendar className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                <span className={`text-xs font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>From</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`bg-transparent outline-none text-sm font-medium ${
                    isDark ? 'text-white' : 'text-neutral-900'
                  }`}
                />
                <CornerBrackets />
              </div>

              <div className={`relative p-5 border flex items-center gap-3 ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <Calendar className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                <span className={`text-xs font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>To</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`bg-transparent outline-none text-sm font-medium ${
                    isDark ? 'text-white' : 'text-neutral-900'
                  }`}
                />
                <CornerBrackets />
              </div>

              {/* Filter Button */}
              <button 
                onClick={handleFilter}
                className={`cursor-pointer px-6 py-5 border font-bold text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                  isDark 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600 shadow-sm'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>

              {/* Reset Button */}
              <button 
                onClick={handleReset}
                className={`cursor-pointer px-6 py-5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                  isDark 
                    ? 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700' 
                    : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-300'
                }`}
              >
                Reset
              </button>
            </div>
          </section>

          {/* DATA TABLE */}
          <section className="space-y-6">
            <div className={`relative border overflow-hidden ${
              isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              {/* Table Header */}
              <div className={`grid grid-cols-6 gap-4 p-4 border-b ${
                isDark ? 'bg-neutral-800/50 border-white/5' : 'bg-neutral-100 border-neutral-200'
              }`}>
                <div className="text-[11px] font-bold uppercase tracking-wider">Date</div>
                <div className="text-[11px] font-bold uppercase tracking-wider">Total Milk (gallons)</div>
                <div className="text-[11px] font-bold uppercase tracking-wider">Milking Cows</div>
                <div className="text-[11px] font-bold uppercase tracking-wider">Average/Cow (gallons)</div>
                <div className="text-[11px] font-bold uppercase tracking-wider">Notes</div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-right">Actions</div>
              </div>

              {/* Table Body */}
              {loading ? (
                <div className="p-16 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Loading analytics...
                  </p>
                </div>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <div key={index} className={`grid grid-cols-6 gap-4 p-4 border-b transition-colors ${
                    isDark 
                      ? 'border-white/5 hover:bg-white/5' 
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}>
                    <div className="text-sm font-medium">{row.date}</div>
                    <div className="text-sm font-medium">{row.totalMilk}</div>
                    <div className="text-sm font-medium">{row.milkingCows}</div>
                    <div className="text-sm font-medium">{row.averagePerCow}</div>
                    <div className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {row.notes}
                    </div>
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/milk-management/production/daily-records?date=${row.date}`}>
                        <button 
                          className={`cursor-pointer p-2 border transition-all ${
                            isDark 
                              ? 'hover:bg-white/10 border-white/10' 
                              : 'hover:bg-neutral-50 border-neutral-200'
                          }`}
                          title="View Daily Records"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button 
                        onClick={() => setDeleteConfirm(row.date)}
                        className={`cursor-pointer p-2 border transition-all ${
                          isDark 
                            ? 'hover:bg-red-500/20 text-red-400 border-white/10' 
                            : 'hover:bg-red-50 text-red-600 border-neutral-200'
                        }`}
                        title="Delete Records for this Date"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-16 text-center">
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    No records found
                  </p>
                </div>
              )}

              <CornerBrackets />
            </div>

            {/* Pagination */}
            {!loading && paginatedData.length > 0 && (
              <div className={`flex items-center justify-between p-6 border ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <div className={`text-sm font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredAnalytics.length)} of {filteredAnalytics.length} results
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={`cursor-pointer p-2 border transition-all ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark
                          ? 'hover:bg-white/10 border-white/10'
                          : 'hover:bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`cursor-pointer p-2 border transition-all ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark
                          ? 'hover:bg-white/10 border-white/10'
                          : 'hover:bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className={`px-4 py-2 border font-bold text-sm ${
                    isDark 
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                      : 'bg-purple-50 border-purple-200 text-purple-700'
                  }`}>
                    {currentPage}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`cursor-pointer p-2 border transition-all ${
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark
                          ? 'hover:bg-white/10 border-white/10'
                          : 'hover:bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`cursor-pointer p-2 border transition-all ${
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed'
                        : isDark
                          ? 'hover:bg-white/10 border-white/10'
                          : 'hover:bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>

                  <div className="ml-4 flex items-center gap-2">
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
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </section>

        </main>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className={`relative max-w-md w-full p-8 border shadow-2xl ${
            isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-neutral-300'
          }`}>
            <div className="text-center">
              <div className={`inline-flex p-5 border mb-5 ${
                isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
              }`}>
                <Trash2 className={`w-10 h-10 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              </div>
              <h3 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight mb-3`}>
                Delete All Records?
              </h3>
              <p className={`text-sm font-medium mb-8 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Are you sure you want to delete all production records for{' '}
                <span className="font-bold">{deleteConfirm}</span>?<br />
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={submitting}
                  className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                    isDark 
                      ? 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700' 
                      : 'bg-white hover:bg-neutral-50 border-neutral-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={submitting}
                  className={`cursor-pointer flex-1 px-6 py-3.5 border font-bold text-[11px] uppercase tracking-widest transition-all ${
                    submitting
                      ? 'bg-red-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white border-red-600`}
                >
                  {submitting ? 'Deleting...' : 'Delete All'}
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