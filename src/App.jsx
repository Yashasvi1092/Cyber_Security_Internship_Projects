import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  User, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Terminal, 
  CheckCircle, 
  XCircle, 
  Database,
  Users,
  ChevronRight,
  Activity
} from 'lucide-react';

// --- Configuration & Mock Data ---

const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

const USERS = {
  admin: { id: 1, name: 'Alice (Admin)', role: ROLES.ADMIN, avatar: 'bg-rose-500' },
  user: { id: 2, name: 'Bob (User)', role: ROLES.USER, avatar: 'bg-blue-500' },
  guest: { id: 3, name: 'Charlie (Guest)', role: ROLES.GUEST, avatar: 'bg-slate-500' }
};

// --- Reusable Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 shadow-md shadow-indigo-200 dark:shadow-none",
    danger: "bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-400 shadow-md shadow-rose-200 dark:shadow-none",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
  };
  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default function App() {
  // Application State
  const [currentUser, setCurrentUser] = useState(USERS.guest);
  const [currentView, setCurrentView] = useState('home');
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [logs, setLogs] = useState([]);
  const [requestFeedback, setRequestFeedback] = useState(null);

  // Hacker Console State
  const [exploitMethod, setExploitMethod] = useState('DELETE');
  const [exploitUrl, setExploitUrl] = useState('/api/admin/users');

  const addLog = (type, message, status) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{ id: Date.now(), timestamp, type, message, status }, ...prev].slice(0, 50));
  };

  const handleLogin = (userKey) => {
    setCurrentUser(USERS[userKey]);
    setCurrentView('home');
    addLog('AUTH', `Switched to user: ${USERS[userKey].name}`, 'info');
    setRequestFeedback(null);
  };

  // --- Core Logic: The Mock Backend ---
  const mockApiCall = async (endpoint, method, payload = {}) => {
    setRequestFeedback({ loading: true, message: `Sending ${method} request to ${endpoint}...` });
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    let authorized = false;
    let responseData = null;
    let errorMsg = null;

    // SCENARIO 1: VULNERABLE BACKEND
    if (!isSecureMode) {
      // Vulnerability: The backend trusts the request just because it arrived.
      // It assumes that if the UI button was hidden, the user can't trigger this.
      
      if (endpoint.includes('admin') && method === 'DELETE') {
        // IDOR / Broken Access Control Vulnerability
        authorized = true; 
        responseData = { success: true, message: "⚠️ CRITICAL: Database deleted! (Vulnerable Mode allowed this)" };
      } else if (endpoint.includes('admin')) {
         // Weak check: allows 'user' role to access admin settings by mistake
         authorized = currentUser.role === ROLES.ADMIN || currentUser.role === ROLES.USER; 
         if (authorized) responseData = { success: true, settings: { debug: true } };
         else errorMsg = "Unauthorized";
      } else {
        authorized = true;
        responseData = { data: "Public content loaded" };
      }
    } 
    // SCENARIO 2: SECURE BACKEND
    else {
      // Strict Server-Side Validation
      const requiredRole = endpoint.includes('admin') ? ROLES.ADMIN : 
                           endpoint.includes('dashboard') ? ROLES.USER : ROLES.GUEST;
      
      // Role Hierarchy: Guest (1) < User (2) < Admin (3)
      const roleValue = { [ROLES.GUEST]: 1, [ROLES.USER]: 2, [ROLES.ADMIN]: 3 };
      
      if (roleValue[currentUser.role] >= roleValue[requiredRole]) {
        authorized = true;
        responseData = { success: true, message: "Request authorized and processed securelly." };
      } else {
        authorized = false;
        errorMsg = `403 Forbidden: ${currentUser.role} cannot access ${requiredRole} resources`;
      }
    }

    if (authorized) {
      addLog('API', `${method} ${endpoint} - 200 OK`, 'success');
      setRequestFeedback({ loading: false, type: 'success', message: responseData.message || "Success" });
    } else {
      addLog('API', `${method} ${endpoint} - 403 FORBIDDEN`, 'error');
      setRequestFeedback({ loading: false, type: 'error', message: errorMsg || "Access Denied" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col md:flex-row">
      
      {/* --- LEFT SIDEBAR: Control Panel --- */}
      <div className="w-full md:w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col h-screen sticky top-0 z-20 shadow-2xl">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <h1 className="text-xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Shield className="w-6 h-6" /> RBAC Sim
          </h1>
          <p className="text-xs text-slate-500 mt-1">Role-Based Access Control</p>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Identity Switcher */}
          <div>
            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">1. Select Identity</h2>
            <div className="flex flex-col gap-2">
              {Object.keys(USERS).map(key => (
                <button
                  key={key}
                  onClick={() => handleLogin(key)}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all border text-left group ${
                    currentUser.id === USERS[key].id 
                      ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900/20 dark:border-indigo-400 shadow-sm' 
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${USERS[key].avatar}`}>
                    {USERS[key].role[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{USERS[key].name}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wide">{USERS[key].role}</div>
                  </div>
                  {currentUser.id === USERS[key].id && <CheckCircle className="w-4 h-4 text-indigo-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Security Toggle */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">2. Backend Security</h2>
            <div 
              onClick={() => setIsSecureMode(!isSecureMode)}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                isSecureMode 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
                  : 'border-rose-500 bg-rose-50 dark:bg-rose-900/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${isSecureMode ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                  {isSecureMode ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                </div>
                <div>
                  <div className={`font-bold text-sm ${isSecureMode ? 'text-green-700 dark:text-green-400' : 'text-rose-700 dark:text-rose-400'}`}>
                    {isSecureMode ? 'SECURE' : 'VULNERABLE'}
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight mt-1">
                    {isSecureMode ? 'Server validates roles' : 'No server checks'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Network Log Mini-Console */}
        <div className="h-48 bg-slate-950 text-slate-200 p-4 font-mono text-[10px] flex flex-col border-t border-slate-700">
          <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-2">
            <span className="flex items-center gap-2 text-indigo-400 font-bold"><Activity className="w-3 h-3" /> NETWORK TRAFFIC</span>
            <button onClick={() => setLogs([])} className="hover:text-white transition-colors">CLEAR</button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {logs.length === 0 && <div className="text-slate-600 italic pt-2 text-center">Waiting for requests...</div>}
            {logs.map(log => (
              <div key={log.id} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-slate-600 shrink-0">{log.timestamp}</span>
                <span className={`font-bold shrink-0 w-12 text-center rounded px-1 ${
                  log.status === 'success' ? 'bg-green-900/50 text-green-400' : 
                  log.status === 'error' ? 'bg-rose-900/50 text-rose-400' : 'bg-blue-900/50 text-blue-400'
                }`}>
                  {log.type}
                </span>
                <span className="truncate opacity-80">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- RIGHT AREA: Main Application View --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
        
        {/* Top Navbar */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            {['home', 'dashboard', 'admin'].map((view) => {
              // Logic to hide buttons in UI based on role (Simulation of frontend protection)
              const isHidden = (view === 'dashboard' && currentUser.role === ROLES.GUEST) || 
                               (view === 'admin' && currentUser.role !== ROLES.ADMIN);
              
              if (isHidden) return null;

              return (
                <button 
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                    currentView === view 
                      ? 'bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-300 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  {view}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
            <div className={`w-2 h-2 rounded-full ${isSecureMode ? 'bg-green-500' : 'bg-rose-500 animate-pulse'}`}></div>
            API: {isSecureMode ? 'PROTECTED' : 'EXPOSED'}
          </div>
        </div>

        {/* Content Canvas */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Feedback Toast */}
            {requestFeedback && (
              <div className={`p-4 rounded-xl flex items-center gap-4 shadow-lg border animate-in slide-in-from-top-4 duration-300 ${
                requestFeedback.loading ? 'bg-blue-50 border-blue-200 text-blue-800' :
                requestFeedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-900' :
                'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                {requestFeedback.loading ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> :
                 requestFeedback.type === 'success' ? <CheckCircle className="w-6 h-6 shrink-0 text-green-600" /> : <XCircle className="w-6 h-6 shrink-0 text-rose-600" />}
                <div>
                  <div className="font-bold text-sm">{requestFeedback.loading ? 'Processing Request...' : requestFeedback.type === 'success' ? 'Request Succeeded' : 'Request Failed'}</div>
                  <div className="text-sm opacity-90">{requestFeedback.message}</div>
                </div>
              </div>
            )}

            {/* Views */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[300px]">
              {currentView === 'home' && (
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                      <Database className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Public Area</h2>
                      <p className="text-slate-500 dark:text-slate-400">Accessible to everyone.</p>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                    <p className="mb-4 text-slate-600 dark:text-slate-300">This data requires no special privileges.</p>
                    <Button onClick={() => mockApiCall('/api/public/data', 'GET')} variant="outline" className="mx-auto bg-white dark:bg-slate-800">
                      Fetch Public Data
                    </Button>
                  </div>
                </div>
              )}

              {currentView === 'dashboard' && (
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">User Dashboard</h2>
                      <p className="text-slate-500 dark:text-slate-400">Restricted to Users & Admins.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-colors cursor-pointer group" onClick={() => mockApiCall('/api/user/profile', 'GET')}>
                      <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-1 group-hover:text-blue-600">View Profile</h3>
                      <p className="text-xs text-slate-500">GET /api/user/profile</p>
                    </div>
                    <div className="p-5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-colors cursor-pointer group" onClick={() => mockApiCall('/api/user/orders', 'GET')}>
                      <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-1 group-hover:text-blue-600">Order History</h3>
                      <p className="text-xs text-slate-500">GET /api/user/orders</p>
                    </div>
                  </div>
                </div>
              )}

              {currentView === 'admin' && (
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400">
                      <Shield className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-rose-600 dark:text-rose-400">Admin Panel</h2>
                      <p className="text-slate-500 dark:text-slate-400">Restricted to Admins only.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                          <Users className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-700 dark:text-slate-200">Manage Users</div>
                          <div className="text-xs text-slate-500">View and edit user registry</div>
                        </div>
                      </div>
                      <Button variant="ghost" onClick={() => mockApiCall('/api/admin/users', 'GET')}>View List</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-rose-950 flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-rose-600" />
                        </div>
                        <div>
                          <div className="font-bold text-rose-700 dark:text-rose-400">Danger Zone</div>
                          <div className="text-xs text-rose-600/70 dark:text-rose-400/70">Irreversible actions</div>
                        </div>
                      </div>
                      <Button variant="danger" onClick={() => mockApiCall('/api/admin/users', 'DELETE')}>Delete DB</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* --- EXPLOIT TOOL --- */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 transform -skew-y-1 rounded-3xl opacity-10"></div>
              <div className="relative bg-slate-900 text-slate-100 rounded-2xl shadow-xl overflow-hidden border border-slate-700">
                <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span className="font-mono text-sm font-bold tracking-wide">HACKER_CONSOLE.exe</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                </div>
                
                <div className="p-8">
                  <p className="text-slate-400 text-sm mb-6 font-mono leading-relaxed">
                    <span className="text-purple-400 font-bold">$ whoami</span><br/>
                    {`> ${currentUser.name} (${currentUser.role})`}<br/><br/>
                    <span className="text-slate-500"># Attempt to access restricted endpoints manually.</span><br/>
                    <span className="text-slate-500"># Use this to test Broken Access Control (OWASP A01).</span>
                  </p>

                  <div className="flex flex-col md:flex-row gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <select 
                      value={exploitMethod}
                      onChange={(e) => setExploitMethod(e.target.value)}
                      className="bg-slate-950 text-purple-400 font-mono text-sm px-4 py-3 rounded-md border border-slate-700 focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                    
                    <input 
                      type="text" 
                      value={exploitUrl}
                      onChange={(e) => setExploitUrl(e.target.value)}
                      className="flex-1 bg-slate-950 text-slate-200 font-mono text-sm px-4 py-3 rounded-md border border-slate-700 focus:outline-none focus:border-purple-500 placeholder-slate-600"
                      placeholder="/api/target/endpoint"
                    />
                    
                    <button 
                      onClick={() => mockApiCall(exploitUrl, exploitMethod)}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-mono text-sm font-bold px-6 py-3 rounded-md flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-900/20"
                    >
                      SEND_PACKET <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
