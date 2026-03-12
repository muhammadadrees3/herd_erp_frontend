"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  LayoutDashboard, Receipt, DollarSign, TrendingUp,
  Droplets, ShoppingCart, BarChart2, Activity
} from 'lucide-react';
import { Space_Grotesk, Inter } from "next/font/google";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const TABS = [
  { label: 'Dashboard',     icon: LayoutDashboard, path: '/milk-management/otcs/dashboard' },
  { label: 'Sales Records', icon: Receipt,          path: '/milk-management/otcs/records'   },
];

export const LS_KEY = 'otcSalesRecords';

export const SEED = [
  { id: 1, customerName: 'Musa', quantity: 4, pricePerLiter: 34, total: 136, date: '2025-08-04', notes: '' },
];

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
const API_URL = `${API_BASE_URL}/milk/otcs/dashboard/stats`;

export function CornerBrackets({ isDark }) {
  const c = isDark ? 'border-green-500/20' : 'border-neutral-300';
  return (
    <>
      <div className={`absolute top-0 left-0 w-3 h-3 border-l border-t ${c} transition-all duration-300`} />
      <div className={`absolute top-0 right-0 w-3 h-3 border-r border-t ${c} transition-all duration-300`} />
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-l border-b ${c} transition-all duration-300`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-r border-b ${c} transition-all duration-300`} />
    </>
  );
}

export function OTCSTabs({ isDark }) {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  return (
    <div className={`flex border backdrop-blur-md ${
      isDark ? 'bg-neutral-900/50 border-white/10' : 'bg-white border-neutral-300 shadow-sm'
    }`}>
      {TABS.map(({ label, icon: Icon, path }) => (
        <Link key={path} href={path} className="flex-1">
          <button className={`cursor-pointer w-full flex items-center justify-center gap-2 px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
            isActive(path)
              ? isDark
                ? 'bg-green-500/10 text-green-400 border-b-2 border-green-400'
                : 'bg-green-500/10 text-green-700 border-b-2 border-green-600'
              : isDark
              ? 'text-neutral-400 hover:text-green-400 hover:bg-white/5'
              : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
          }`}>
            <Icon className="w-4 h-4" />
            {label}
          </button>
        </Link>
      ))}
    </div>
  );
}

export default function OTCSDashboard() {
  const [isDark, setIsDark]           = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalQuantity: 0,
    averagePrice: 0,
    recentActivity: []
  });

  // Helper to get headers with token
  const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get('accessToken')}`
  });

  // Normalize stats to handle different field names
  const normalizeStats = (data) => {
    if (!data) return {
      totalSales: 0,
      totalRevenue: 0,
      totalQuantity: 0,
      averagePrice: 0,
      recentActivity: []
    };

    // Handle average price - could be avgPrice, averagePrice, avg_price, etc.
    let avgPrice = 0;
    if (data.averagePrice !== undefined) avgPrice = data.averagePrice;
    else if (data.avgPrice !== undefined) avgPrice = data.avgPrice;
    else if (data.avg_price !== undefined) avgPrice = data.avg_price;
    else if (data.average_price !== undefined) avgPrice = data.average_price;
    
    // Ensure it's a number
    avgPrice = parseFloat(avgPrice) || 0;

    return {
      totalSales: data.totalSales || data.total_sales || 0,
      totalRevenue: data.totalRevenue || data.total_revenue || 0,
      totalQuantity: data.totalQuantity || data.total_quantity || 0,
      averagePrice: avgPrice,
      recentActivity: data.recentActivity || data.recent_activity || []
    };
  };

  // Fetch Dashboard Stats from API
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching OTCS dashboard stats from:', API_URL);
      
      const response = await axios.get(API_URL, {
        withCredentials: true,
        headers: getHeaders()
      });
      
      console.log('OTCS Dashboard API Response:', response.data);
      
      if (response.data && response.data.success) {
        const stats = normalizeStats(response.data.data);
        setDashboardStats(stats);
        // Save to localStorage as backup
        localStorage.setItem('otcsDashboardStats', JSON.stringify(stats));
      } else if (response.data && response.data.data) {
        const stats = normalizeStats(response.data.data);
        setDashboardStats(stats);
        localStorage.setItem('otcsDashboardStats', JSON.stringify(stats));
      } else {
        console.warn("Unexpected API response format:", response.data);
        setError('Invalid response format from server');
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("❌ Error fetching OTCS dashboard stats:", error);
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
      const stored = localStorage.getItem('otcsDashboardStats');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setDashboardStats(parsed);
        } catch (e) {
          console.error('Error parsing stored dashboard:', e);
        }
      } else {
        // If no stored stats, try to calculate from records
        const recordsStored = localStorage.getItem(LS_KEY);
        if (recordsStored) {
          try {
            const records = JSON.parse(recordsStored);
            const totalSales = records.length;
            const totalRevenue = records.reduce((s, r) => s + (r.total || 0), 0);
            const totalQuantity = records.reduce((s, r) => s + (r.quantity || 0), 0);
            const avgPrice = records.length > 0
              ? records.reduce((s, r) => s + (r.pricePerLiter || 0), 0) / records.length
              : 0;
            const recentActivity = [...records]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5);
            
            setDashboardStats({
              totalSales,
              totalRevenue,
              totalQuantity,
              averagePrice: avgPrice,
              recentActivity
            });
          } catch (e) {
            console.error('Error parsing records:', e);
          }
        }
      }
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  // Ensure averagePrice is a valid number
  const getAveragePrice = () => {
    if (loading) return '...';
    const price = dashboardStats.averagePrice;
    if (price === undefined || price === null || isNaN(price)) return 'PKR 0.00';
    return `PKR ${parseFloat(price).toFixed(2)}`;
  };

  const statCards = [
    {
      label:   'Total Sales',
      value:   loading ? '...' : (dashboardStats.totalSales || 0).toString(),
      sub:     'Total cash transactions',
      SubIcon: Receipt,
      BgIcon:  DollarSign,
      iconBg:  isDark ? 'bg-purple-500/20 border-purple-500/30' : 'bg-purple-100 border-purple-200',
      iconCol: isDark ? 'text-purple-400' : 'text-purple-600',
      valCol:  isDark ? 'text-purple-400' : 'text-purple-600',
    },
    {
      label:   'Total Revenue',
      value:   loading ? '...' : `PKR ${(dashboardStats.totalRevenue || 0).toFixed(2)}`,
      sub:     'Revenue from cash sales',
      SubIcon: TrendingUp,
      BgIcon:  DollarSign,
      iconBg:  isDark ? 'bg-green-500/20 border-green-500/30' : 'bg-green-100 border-green-200',
      iconCol: isDark ? 'text-green-400' : 'text-green-600',
      valCol:  isDark ? 'text-green-400' : 'text-green-600',
    },
    {
      label:   'Total Quantity',
      value:   loading ? '...' : `${(dashboardStats.totalQuantity || 0).toFixed(2)} gallons`,
      sub:     'Total milk sold',
      SubIcon: Droplets,
      BgIcon:  ShoppingCart,
      iconBg:  isDark ? 'bg-cyan-500/20 border-cyan-500/30' : 'bg-cyan-100 border-cyan-200',
      iconCol: isDark ? 'text-cyan-400' : 'text-cyan-600',
      valCol:  isDark ? 'text-cyan-400' : 'text-cyan-600',
    },
    {
      label:   'Average Price',
      value:   getAveragePrice(),
      sub:     'Average price per liter',
      SubIcon: BarChart2,
      BgIcon:  TrendingUp,
      iconBg:  isDark ? 'bg-amber-500/20 border-amber-500/30' : 'bg-amber-100 border-amber-200',
      iconCol: isDark ? 'text-amber-400' : 'text-amber-600',
      valCol:  isDark ? 'text-amber-400' : 'text-amber-600',
    },
  ];

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

      <Navbar
        isDark={isDark}
        setIsDark={setIsDark}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchPlaceholder="Search cash sales..."
      />

      <div className={`${sidebarOpen ? 'lg:ml-72' : 'ml-0'} transition-all duration-300 relative z-10`}>
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8">

          {/* TABS */}
          <OTCSTabs isDark={isDark} />

          {/* HEADER BANNER */}
          <section className={`relative p-6 border ${
            isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 border ${isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-100 border-purple-200'}`}>
                  <DollarSign className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h2 className={`${spaceGrotesk.className} text-2xl font-bold uppercase tracking-tight mb-1 ${
                    isDark ? 'text-white' : 'text-neutral-900'
                  }`}>
                    OTCS Dashboard
                  </h2>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    One Time Cash Sales overview and analytics
                  </p>
                  {error && (
                    <p className="text-xs text-red-500 font-mono mt-1">{error}</p>
                  )}
                  {loading && (
                    <p className="text-xs text-purple-500 font-mono mt-1">SYNCING_DATA...</p>
                  )}
                </div>
              </div>
              <button
                onClick={fetchDashboardStats}
                disabled={loading}
                className={`cursor-pointer px-4 py-2 border font-bold text-[10px] uppercase tracking-widest transition-all ${
                  loading
                    ? 'opacity-50 cursor-not-allowed'
                    : isDark
                      ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                      : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600 shadow-sm'
                }`}
              >
                {loading ? '⟳' : '⟲ Refresh'}
              </button>
            </div>
            <CornerBrackets isDark={isDark} />
          </section>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {statCards.map(({ label, value, sub, SubIcon, BgIcon, iconBg, iconCol, valCol }) => (
              <div key={label} className={`relative p-6 border transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20'
                  : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] font-mono ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    {label}
                  </p>
                  <div className={`p-2.5 border ${iconBg}`}>
                    <BgIcon className={`w-4 h-4 ${iconCol}`} />
                  </div>
                </div>
                <p className={`${spaceGrotesk.className} text-3xl font-bold mb-3 leading-none ${valCol}`}>
                  {value}
                </p>
                <div className={`flex items-center gap-1.5 text-[11px] font-medium ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  <SubIcon className={`w-3.5 h-3.5 ${isDark ? 'text-neutral-600' : 'text-neutral-300'}`} />
                  {sub}
                </div>
                <CornerBrackets isDark={isDark} />
              </div>
            ))}
          </div>

          {/* RECENT SALES ACTIVITY */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Recent Sales Activity
              </h2>
            </div>

            <div className={`relative border overflow-hidden ${
              isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              <div className={`px-6 py-5 border-b ${isDark ? 'border-white/5' : 'border-neutral-100'}`}>
                <div className="flex items-center gap-3">
                  <Activity className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <div>
                    <h3 className={`${spaceGrotesk.className} text-lg font-bold uppercase tracking-tight`}>
                      Recent Sales Activity
                    </h3>
                    <p className={`text-[11px] font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                      Latest cash sale transactions
                    </p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Loading recent activity...
                  </p>
                </div>
              ) : dashboardStats.recentActivity.length > 0 ? (
                <div>
                  {dashboardStats.recentActivity.map((record, idx) => (
                    <div
                      key={record.id || idx}
                      className={`flex items-center justify-between px-6 py-4 transition-colors ${
                        idx !== dashboardStats.recentActivity.length - 1
                          ? isDark ? 'border-b border-white/5' : 'border-b border-neutral-100'
                          : ''
                      } ${isDark ? 'hover:bg-white/5' : 'hover:bg-neutral-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isDark ? 'bg-green-400' : 'bg-green-500'}`} />
                        <span className="text-sm font-bold">{record.customerName}</span>
                        <span className={`text-[11px] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                          ({formatDate(record.date)})
                        </span>
                      </div>
                      <span className={`px-3 py-1.5 text-[11px] font-bold font-mono border ${
                        isDark
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-green-100 text-green-700 border-green-300'
                      }`}>
                        PKR {(record.total || 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Activity className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-neutral-800' : 'text-neutral-200'}`} />
                  <p className={`text-sm font-medium ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    No sales recorded yet
                  </p>
                </div>
              )}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}