"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  BarChart3, FileText, TrendingUp, Milk, DollarSign, AlertCircle
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
const API_URL = `${API_BASE_URL}/milk/sales/dashboard/stats`;

export default function SalesDashboard() {
  const [isDark, setIsDark] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    todaysSalesVolume: 0,
    todaysRevenue: 0,
    pendingPayments: 0,
    unpaidInvoices: 0,
    recentActivity: []
  });
  const pathname = usePathname();

  // Helper to get headers with token
  const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get('accessToken')}`
  });

  // Debug function to log API response
  const logResponse = (data) => {
    console.log('🔍 API Response:', data);
    if (data && data.data) {
      console.log('🔍 Data object:', data.data);
      console.log('🔍 Available fields:', Object.keys(data.data));
    }
  };

  // Normalize stats to handle different field names
  const normalizeStats = (data) => {
    console.log('🔍 Normalizing data:', data);
    
    if (!data) {
      console.log('🔍 No data provided, using defaults');
      return {
        todaysSalesVolume: 0,
        todaysRevenue: 0,
        pendingPayments: 0,
        unpaidInvoices: 0,
        recentActivity: []
      };
    }

    // Try to find the actual data - it might be nested
    const sourceData = data.data || data;
    
    // Log all possible field names
    console.log('🔍 Source data fields:', Object.keys(sourceData));
    
    // Try multiple possible field names for each value
    const todaysSalesVolume = 
      sourceData.todaysSalesVolume || 
      sourceData.todaySalesVolume || 
      sourceData.todays_volume || 
      sourceData.salesVolume || 
      sourceData.volume ||
      0;

    const todaysRevenue = 
      sourceData.todaysRevenue || 
      sourceData.todayRevenue || 
      sourceData.todays_revenue || 
      sourceData.revenue ||
      0;

    const pendingPayments = 
      sourceData.pendingPayments || 
      sourceData.pending_payments || 
      sourceData.pendingAmount ||
      0;

    const unpaidInvoices = 
      sourceData.unpaidInvoices || 
      sourceData.unpaid_invoices || 
      sourceData.pendingCount ||
      0;

    const result = {
      todaysSalesVolume: parseFloat(todaysSalesVolume) || 0,
      todaysRevenue: parseFloat(todaysRevenue) || 0,
      pendingPayments: parseFloat(pendingPayments) || 0,
      unpaidInvoices: parseInt(unpaidInvoices) || 0,
      recentActivity: sourceData.recentActivity || sourceData.recent_activity || []
    };

    console.log('🔍 Normalized result:', result);
    return result;
  };

  // Fetch Dashboard Stats from API
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching from:', API_URL);
      const response = await axios.get(API_URL, {
        withCredentials: true,
        headers: getHeaders()
      });
      
      console.log('🔍 Full response:', response);
      logResponse(response.data);
      
      if (response.data) {
        // Handle different response structures
        let stats;
        if (response.data.success && response.data.data) {
          // Standard format: { success: true, data: {...} }
          stats = normalizeStats(response.data.data);
        } else if (response.data.data) {
          // Format: { data: {...} }
          stats = normalizeStats(response.data.data);
        } else {
          // Assume the response itself is the data
          stats = normalizeStats(response.data);
        }
        
        setDashboardData(stats);
        // Save to localStorage as backup
        localStorage.setItem('salesDashboardStats', JSON.stringify(stats));
      } else {
        console.warn("Unexpected API response format:", response.data);
        setError('Invalid response format from server');
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("❌ Error fetching dashboard stats:", error);
      setError(error.message || 'Failed to fetch dashboard data');
      // Fallback to localStorage
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Load from localStorage as fallback
  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('salesDashboardStats');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          console.log('🔍 Loaded from localStorage:', parsed);
          setDashboardData(parsed);
        } catch (e) {
          console.error('Error parsing stored dashboard:', e);
        }
      }
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const isActive = (path) => pathname === path;

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

      {/* NAVBAR WITH SIDEBAR */}
      <Navbar 
        isDark={isDark} 
        setIsDark={setIsDark} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="Search sales..."
      />

      {/* MAIN CONTENT WRAPPER WITH DYNAMIC MARGIN */}
      <div className={`${sidebarOpen ? 'lg:ml-72' : 'ml-0'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">
          
          {/* MODERNIZED TITLE & TABS */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-[0.9] mb-2`}>
                Sales <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-600">Dashboard</span>
              </h1>
              <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Track total milk sold, revenue, and unpaid invoices
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
              <Link 
                href="/milk-management/sales/dashboard"
                className={`cursor-pointer flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  isActive('/milk-management/sales/dashboard')
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
                href="/milk-management/sales/records"
                className={`cursor-pointer flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  isActive('/milk-management/sales/records')
                    ? isDark
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-green-500/10 text-green-700 border border-green-500/30'
                    : isDark 
                      ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                Sales Records
              </Link>
              <Link 
                href="/milk-management/sales/usage"
                className={`cursor-pointer flex items-center gap-2 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  isActive('/milk-management/sales/usage')
                    ? isDark
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-green-500/10 text-green-700 border border-green-500/30'
                    : isDark 
                      ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5' 
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Usage
              </Link>
            </div>
          </div>

          {/* HEADER SECTION */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
                <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  Today's Overview
                </h2>
                <button
                  onClick={fetchDashboardStats}
                  disabled={loading}
                  className={`cursor-pointer ml-2 text-xs font-mono px-2 py-1 border transition-all ${
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
            </div>
          </section>

          {/* DASHBOARD CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Today's Sales Volume Card */}
            <div className={`relative p-8 border transition-all duration-300 hover:-translate-y-1 ${
              isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Sales Volume
                  </span>
                  <div className={`p-2.5 border ${
                    isDark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'
                  }`}>
                    <Milk className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                </div>
                
                <div>
                  <h2 className={`${spaceGrotesk.className} text-5xl font-bold mb-1 ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`}>
                    {loading ? '...' : dashboardData.todaysSalesVolume.toFixed(2)}
                  </h2>
                  <p className={`text-xs font-medium ${isDark ? 'text-green-400/70' : 'text-green-600/70'}`}>
                    gallons
                  </p>
                </div>

                <p className={`text-[10px] font-medium flex items-center gap-1.5 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  <Milk className="w-3 h-3" />
                  Total milk sold today
                </p>
              </div>
              <CornerBrackets />
            </div>

            {/* Today's Revenue Card */}
            <div className={`relative p-8 border transition-all duration-300 hover:-translate-y-1 ${
              isDark ? 'bg-neutral-900/50 border-white/5 hover:border-blue-500/20' : 'bg-white border-neutral-300 hover:border-blue-500/30 shadow-sm'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Revenue
                  </span>
                  <div className={`p-2.5 border ${
                    isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'
                  }`}>
                    <DollarSign className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                </div>
                
                <div>
                  <h2 className={`${spaceGrotesk.className} text-5xl font-bold mb-1 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {loading ? '...' : dashboardData.todaysRevenue.toFixed(2)}
                  </h2>
                  <p className={`text-xs font-medium ${isDark ? 'text-blue-400/70' : 'text-blue-600/70'}`}>
                    PKR
                  </p>
                </div>

                <p className={`text-[10px] font-medium flex items-center gap-1.5 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  Total revenue from today
                </p>
              </div>
              <CornerBrackets />
            </div>

            {/* Pending Payments Card */}
            <div className={`relative p-8 border transition-all duration-300 hover:-translate-y-1 ${
              isDark ? 'bg-neutral-900/50 border-white/5 hover:border-orange-500/20' : 'bg-white border-neutral-300 hover:border-orange-500/30 shadow-sm'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.25em] ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Pending
                  </span>
                  <div className={`p-2.5 border ${
                    isDark ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-200'
                  }`}>
                    <AlertCircle className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
                  </div>
                </div>
                
                <div>
                  <h2 className={`${spaceGrotesk.className} text-5xl font-bold mb-1 ${
                    isDark ? 'text-orange-400' : 'text-orange-600'
                  }`}>
                    {loading ? '...' : dashboardData.pendingPayments.toFixed(2)}
                  </h2>
                  <p className={`text-xs font-medium ${isDark ? 'text-orange-400/70' : 'text-orange-600/70'}`}>
                    PKR
                  </p>
                </div>

                <p className={`text-[10px] font-medium flex items-center gap-1.5 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  <AlertCircle className="w-3 h-3" />
                  {dashboardData.unpaidInvoices} unpaid invoices
                </p>
              </div>
              <CornerBrackets />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}