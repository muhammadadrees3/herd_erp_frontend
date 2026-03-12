"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard/Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import { 
  DollarSign, Droplet, AlertCircle, TrendingUp, Calendar,
  ChevronDown, Download, FileText
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["300", "500", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// ✅ FIXED: Correct API endpoints according to backend routes
const OVERVIEW_API_URL = `${API_BASE_URL}/sales/overview`;
const CUSTOMERS_API_URL = `${API_BASE_URL}/sales/overview/customers`;
const PAYMENTS_API_URL = `${API_BASE_URL}/sales/overview/payments`;

export default function SalesOverview() {
  const [isDark, setIsDark] = useState(false); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customerFilterOpen, setCustomerFilterOpen] = useState(false);
  const [paymentFilterOpen, setPaymentFilterOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data states - NO DUMMY DATA
  const [overviewData, setOverviewData] = useState({
    totalMilkSold: 0,
    totalRevenue: 0,
    unpaidInvoices: 0,
    unpaidAmount: 0,
    dailySales: [],
    monthlySales: []
  });
  
  const [customers, setCustomers] = useState(['all']);
  const [payments, setPayments] = useState(['all']);

  // Helper to get headers with token
  const getHeaders = () => ({
    Authorization: `Bearer ${Cookies.get('accessToken')}`
  });

  // Normalize overview data to handle different field names
  const normalizeOverviewData = (data) => {
    if (!data) return {
      totalMilkSold: 0,
      totalRevenue: 0,
      unpaidInvoices: 0,
      unpaidAmount: 0,
      dailySales: [],
      monthlySales: []
    };

    return {
      totalMilkSold: data.totalMilkSold || data.total_volume || 0,
      totalRevenue: data.totalRevenue || data.total_revenue || 0,
      unpaidInvoices: data.unpaidInvoices || data.unpaid_count || 0,
      unpaidAmount: data.unpaidAmount || data.unpaid_amount || 0,
      dailySales: data.dailySales || data.daily_sales || [],
      monthlySales: data.monthlySales || data.monthly_sales || []
    };
  };

  // Fetch Overview Data from API
  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query params
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (selectedCustomer !== 'all') params.customer = selectedCustomer;
      if (selectedPayment !== 'all') params.payment = selectedPayment;
      
      console.log('Fetching from:', OVERVIEW_API_URL, 'with params:', params);
      
      const response = await axios.get(OVERVIEW_API_URL, {
        params,
        withCredentials: true,
        headers: getHeaders()
      });
      
      console.log('Overview API Response:', response.data);
      
      if (response.data && response.data.success) {
        const normalized = normalizeOverviewData(response.data.data);
        setOverviewData(normalized);
        // Save to localStorage as backup
        localStorage.setItem('salesOverview', JSON.stringify(normalized));
      } else {
        console.warn("Unexpected API response format:", response.data);
        setError('Invalid response format from server');
        // Fallback to localStorage
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error("❌ Error fetching overview data:", error);
      setError('Failed to fetch data');
      // Keep using empty data
    } finally {
      setLoading(false);
    }
  };

  // Fetch Customers from API
  const fetchCustomers = async () => {
    try {
      console.log('Fetching customers from:', CUSTOMERS_API_URL);
      
      const response = await axios.get(CUSTOMERS_API_URL, {
        withCredentials: true,
        headers: getHeaders()
      });
      
      console.log('Customers API Response:', response.data);
      
      if (response.data && response.data.success) {
        const customerList = response.data.data || [];
        setCustomers(['all', ...customerList]);
      }
    } catch (error) {
      console.error("❌ Error fetching customers:", error);
      setCustomers(['all']); // Only 'all' option
    }
  };

  // Fetch Payment Options from API
  const fetchPayments = async () => {
    try {
      console.log('Fetching payments from:', PAYMENTS_API_URL);
      
      const response = await axios.get(PAYMENTS_API_URL, {
        withCredentials: true,
        headers: getHeaders()
      });
      
      console.log('Payments API Response:', response.data);
      
      if (response.data && response.data.success) {
        const paymentList = response.data.data || [];
        setPayments(['all', ...paymentList]);
      }
    } catch (error) {
      console.error("❌ Error fetching payments:", error);
      setPayments(['all']); // Only 'all' option
    }
  };

  // Load from localStorage as fallback
  const loadFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('salesOverview');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setOverviewData(parsed);
        } catch (e) {
          console.error('Error parsing stored overview:', e);
        }
      }
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCustomers();
    fetchPayments();
    fetchOverviewData();
  }, []);

  // Debounced fetch on filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOverviewData();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [startDate, endDate, selectedCustomer, selectedPayment]);

  // Prepare chart data - use API data if available, otherwise empty array
  const dailySalesData = overviewData.dailySales.length > 0 
    ? overviewData.dailySales 
    : [];  // ✅ Empty array instead of fallback

  const monthlySalesData = overviewData.monthlySales.length > 0 
    ? overviewData.monthlySales 
    : [];  // ✅ Empty array instead of fallback

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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`px-4 py-3 border backdrop-blur-md ${
          isDark 
            ? 'bg-neutral-900/95 border-white/10' 
            : 'bg-white/95 border-neutral-200 shadow-lg'
        }`}>
          <p className={`text-[10px] font-mono uppercase tracking-widest mb-2 ${
            isDark ? 'text-neutral-400' : 'text-neutral-500'
          }`}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className={`text-sm font-bold ${spaceGrotesk.className}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
          
          {/* MODERNIZED HERO HEADER */}
          <div className={`relative overflow-hidden border group ${
            isDark 
              ? 'border-white/10 bg-neutral-900/30' 
              : 'border-neutral-300 bg-white'
          }`}>
            <div className={`absolute inset-0 ${
              isDark 
                ? 'bg-gradient-to-br from-green-900/20 via-transparent to-transparent' 
                : 'bg-gradient-to-br from-green-50/50 via-transparent to-transparent'
            }`} />
            
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-[10px] text-green-500/80 uppercase tracking-[0.3em]">
                  // SALES_ANALYTICS
                </span>
                {loading && (
                  <span className="text-xs text-green-500 font-mono">SYNCING...</span>
                )}
                {error && (
                  <span className="text-xs text-amber-500 font-mono">{error}</span>
                )}
              </div>
              
              <h1 className={`${spaceGrotesk.className} text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.9] mb-4`}>
                Sales Management <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Overview</span>
              </h1>
              
              <p className={`text-sm max-w-xl font-light leading-relaxed ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Track milk sales performance, revenue trends, and customer transactions
              </p>
            </div>
            <CornerBrackets />
          </div>

          {/* FILTERS SECTION */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-green-500/50' : 'bg-green-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Filter Options
              </h2>
              <button
                onClick={fetchOverviewData}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Start Date */}
              <div className={`relative p-5 border group/date ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  Start Date
                </label>
                <div className="flex items-center gap-3">
                  <Calendar className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm font-medium ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                  />
                </div>
                <CornerBrackets />
              </div>

              {/* End Date */}
              <div className={`relative p-5 border group/date ${
                isDark ? 'bg-neutral-900/50 border-white/5' : 'bg-white border-neutral-300 shadow-sm'
              }`}>
                <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-400'
                }`}>
                  End Date
                </label>
                <div className="flex items-center gap-3">
                  <Calendar className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`flex-1 bg-transparent outline-none text-sm font-medium ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                  />
                </div>
                <CornerBrackets />
              </div>

              {/* Customer Filter */}
              <div className="relative">
                <div className={`relative p-5 border cursor-pointer transition-all ${
                  isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                }`} onClick={() => setCustomerFilterOpen(!customerFilterOpen)}>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Customer
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedCustomer === 'all' ? 'All Customers' : selectedCustomer}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${customerFilterOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets />
                </div>

                {customerFilterOpen && (
                  <div className={`absolute top-full mt-2 right-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${
                    isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                  }`}>
                    {customers.map((customer) => (
                      <button
                        key={customer}
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setCustomerFilterOpen(false);
                        }}
                        className={`cursor-pointer w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          selectedCustomer === customer
                            ? isDark
                              ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400'
                              : 'bg-green-50 text-green-700 border-l-2 border-green-600'
                            : isDark
                            ? 'hover:bg-white/5'
                            : 'hover:bg-neutral-50'
                        }`}
                      >
                        {customer === 'all' ? 'All Customers' : customer}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Payment Filter */}
              <div className="relative">
                <div className={`relative p-5 border cursor-pointer transition-all ${
                  isDark ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
                }`} onClick={() => setPaymentFilterOpen(!paymentFilterOpen)}>
                  <label className={`block text-[9px] font-mono font-bold uppercase tracking-[0.25em] mb-3 ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}>
                    Payment
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {selectedPayment === 'all' ? 'All Payments' : selectedPayment}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${paymentFilterOpen ? 'rotate-180' : ''}`} />
                  </div>
                  <CornerBrackets />
                </div>

                {paymentFilterOpen && (
                  <div className={`absolute top-full mt-2 right-0 w-full border shadow-xl overflow-hidden z-20 backdrop-blur-md ${
                    isDark ? 'bg-neutral-900/95 border-white/10' : 'bg-white/95 border-neutral-200'
                  }`}>
                    {payments.map((payment) => (
                      <button
                        key={payment}
                        onClick={() => {
                          setSelectedPayment(payment);
                          setPaymentFilterOpen(false);
                        }}
                        className={`cursor-pointer w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          selectedPayment === payment
                            ? isDark
                              ? 'bg-green-500/10 text-green-400 border-l-2 border-green-400'
                              : 'bg-green-50 text-green-700 border-l-2 border-green-600'
                            : isDark
                            ? 'hover:bg-white/5'
                            : 'hover:bg-neutral-50'
                        }`}
                      >
                        {payment === 'all' ? 'All Payments' : payment}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* SALES PERFORMANCE SECTION */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className={`h-[2px] w-8 ${isDark ? 'bg-blue-500/50' : 'bg-blue-500'}`} />
              <h2 className={`text-[10px] font-black uppercase tracking-[0.25em] font-mono ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                Sales Performance
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Milk Sold */}
              <div className={`relative p-6 border transition-all hover:-translate-y-1 overflow-hidden group/card ${
                isDark 
                  ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' 
                  : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
              }`}>
                <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ${
                  isDark 
                    ? 'bg-gradient-to-br from-green-500/5 via-transparent to-transparent' 
                    : 'bg-gradient-to-br from-green-50 via-transparent to-transparent'
                }`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-5">
                    <div className={`p-2.5 border ${
                      isDark 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-neutral-50 border-neutral-200'
                    }`}>
                      <Droplet className={`w-4 h-4 ${
                        isDark ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className={`${spaceGrotesk.className} text-4xl font-bold tracking-tight`}>
                      {loading ? '...' : overviewData.totalMilkSold.toFixed(2)} L
                    </h3>
                    <p className={`text-[10px] uppercase tracking-[0.2em] font-bold font-mono ${
                      isDark ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>Total Milk Sold</p>
                  </div>
                </div>
                
                <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover/card:w-full transition-all duration-500 ease-out ${
                  isDark ? 'bg-blue-500' : 'bg-blue-600'
                }`} />
                
                <div className={`absolute top-0 left-0 w-2 h-2 border-l border-t border-blue-500/0 group-hover/card:border-blue-500/50 transition-all duration-300`} />
                <div className={`absolute bottom-0 right-0 w-2 h-2 border-r border-b border-blue-500/0 group-hover/card:border-blue-500/50 transition-all duration-300`} />
              </div>

              {/* Total Revenue */}
              <div className={`relative p-6 border transition-all hover:-translate-y-1 overflow-hidden group/card ${
                isDark 
                  ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' 
                  : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
              }`}>
                <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ${
                  isDark 
                    ? 'bg-gradient-to-br from-green-500/5 via-transparent to-transparent' 
                    : 'bg-gradient-to-br from-green-50 via-transparent to-transparent'
                }`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-5">
                    <div className={`p-2.5 border ${
                      isDark 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-neutral-50 border-neutral-200'
                    }`}>
                      <DollarSign className={`w-4 h-4 ${
                        isDark ? 'text-green-400' : 'text-green-600'
                      }`} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className={`${spaceGrotesk.className} text-4xl font-bold tracking-tight`}>
                      {loading ? '...' : `$${overviewData.totalRevenue.toFixed(2)}`}
                    </h3>
                    <p className={`text-[10px] uppercase tracking-[0.2em] font-bold font-mono ${
                      isDark ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>Total Revenue</p>
                  </div>
                </div>
                
                <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover/card:w-full transition-all duration-500 ease-out ${
                  isDark ? 'bg-green-500' : 'bg-green-600'
                }`} />
                
                <div className={`absolute top-0 left-0 w-2 h-2 border-l border-t border-green-500/0 group-hover/card:border-green-500/50 transition-all duration-300`} />
                <div className={`absolute bottom-0 right-0 w-2 h-2 border-r border-b border-green-500/0 group-hover/card:border-green-500/50 transition-all duration-300`} />
              </div>

              {/* Unpaid Invoices */}
              <div className={`relative p-6 border transition-all hover:-translate-y-1 overflow-hidden group/card ${
                isDark 
                  ? 'bg-neutral-900/50 border-white/5 hover:border-green-500/20' 
                  : 'bg-white border-neutral-300 hover:border-green-500/30 shadow-sm'
              }`}>
                <div className={`absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 ${
                  isDark 
                    ? 'bg-gradient-to-br from-red-500/5 via-transparent to-transparent' 
                    : 'bg-gradient-to-br from-red-50 via-transparent to-transparent'
                }`} />
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-5">
                    <div className={`p-2.5 border ${
                      isDark 
                        ? 'bg-white/5 border-white/10' 
                        : 'bg-neutral-50 border-neutral-200'
                    }`}>
                      <AlertCircle className={`w-4 h-4 ${
                        isDark ? 'text-red-400' : 'text-red-600'
                      }`} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className={`${spaceGrotesk.className} text-4xl font-bold tracking-tight`}>
                      {loading ? '...' : overviewData.unpaidInvoices}
                    </h3>
                    <p className={`text-[10px] uppercase tracking-[0.2em] font-bold font-mono ${
                      isDark ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>Unpaid Invoices</p>
                    <p className={`text-xs ${isDark ? 'text-neutral-600' : 'text-neutral-500'}`}>
                      Total unpaid: ${overviewData.unpaidAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover/card:w-full transition-all duration-500 ease-out ${
                  isDark ? 'bg-red-500' : 'bg-red-600'
                }`} />
                
                <div className={`absolute top-0 left-0 w-2 h-2 border-l border-t border-red-500/0 group-hover/card:border-red-500/50 transition-all duration-300`} />
                <div className={`absolute bottom-0 right-0 w-2 h-2 border-r border-b border-red-500/0 group-hover/card:border-red-500/50 transition-all duration-300`} />
              </div>
            </div>
          </section>

          {/* CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Daily Sales Trend */}
            <div className={`border p-8 relative overflow-hidden group/chart ${
              isDark 
                ? 'bg-neutral-900/30 border-white/5' 
                : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    <span className="font-mono text-[9px] text-green-500/70 uppercase tracking-[0.3em]">
                      DAILY_ANALYTICS
                    </span>
                  </div>
                  <h3 className={`${spaceGrotesk.className} text-xl font-bold uppercase tracking-tight`}>
                    Daily Sales Trend
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Milk volume and revenue over the past week
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
                </div>
              ) : dailySalesData.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailySalesData}>
                      <defs>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={isDark ? 0.3 : 0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={isDark ? 0.3 : 0.2}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke={isDark ? "#262626" : "#e5e7eb"} 
                        vertical={false} 
                      />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ 
                          fill: isDark ? '#737373' : '#64748b', 
                          fontSize: 11, 
                          fontWeight: 600,
                          fontFamily: 'monospace'
                        }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ 
                          fill: isDark ? '#737373' : '#64748b', 
                          fontSize: 11, 
                          fontWeight: 600,
                          fontFamily: 'monospace'
                        }} 
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="volume" 
                        stroke="#3b82f6" 
                        strokeWidth={2.5} 
                        fill="url(#colorVolume)" 
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        name="Volume (L)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                  <p className={`text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    No daily sales data available
                  </p>
                </div>
              )}
              <CornerBrackets />
            </div>

            {/* Monthly Sales Trend */}
            <div className={`border p-8 relative overflow-hidden group/chart ${
              isDark 
                ? 'bg-neutral-900/30 border-white/5' 
                : 'bg-white border-neutral-300 shadow-sm'
            }`}>
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                    <span className="font-mono text-[9px] text-green-500/70 uppercase tracking-[0.3em]">
                      MONTHLY_ANALYTICS
                    </span>
                  </div>
                  <h3 className={`${spaceGrotesk.className} text-xl font-bold uppercase tracking-tight`}>
                    Monthly Sales Trend
                  </h3>
                  <p className={`text-xs mt-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Sales performance over the past 6 months
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
                </div>
              ) : monthlySalesData.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData}>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke={isDark ? "#262626" : "#e5e7eb"} 
                        vertical={false} 
                      />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ 
                          fill: isDark ? '#737373' : '#64748b', 
                          fontSize: 11, 
                          fontWeight: 600,
                          fontFamily: 'monospace'
                        }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ 
                          fill: isDark ? '#737373' : '#64748b', 
                          fontSize: 11, 
                          fontWeight: 600,
                          fontFamily: 'monospace'
                        }} 
                      />
                      <Tooltip 
                        content={<CustomTooltip />} 
                        cursor={{ fill: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)' }}
                      />
                      <Bar 
                        dataKey="revenue" 
                        fill="#22c55e" 
                        radius={[4, 4, 0, 0]}
                        name="Revenue ($)"
                        animationDuration={800}
                        animationBegin={0}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                  <p className={`text-sm ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    No monthly sales data available
                  </p>
                </div>
              )}
              <CornerBrackets />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}