<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Binbot Admin Dashboard - Premium Edition</title>
  <link rel="stylesheet" href="admin-enhanced.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js"></script>
</head>
<body>

<script>
  // Check if user is logged in
  const sessionToken = localStorage.getItem('binbot_session');
  const userData = localStorage.getItem('binbot_user');
  
  if (!sessionToken || !userData) {
    window.location.href = 'login.php';
  }
  
  const user = JSON.parse(userData);
</script>

<!-- Mobile Menu Toggle -->
<button class="mobile-menu-toggle" id="mobileMenuToggle" onclick="toggleMobileMenu()">☰</button>

<!-- Sidebar Navigation -->
<aside class="admin-sidebar" id="adminSidebar">
  <div class="sidebar-header">
    <div class="logo-container">
      <span class="logo-icon">🗑️</span>
      <span class="logo-text">Binbot</span>
      <span class="logo-badge">Pro</span>
    </div>
    <button class="sidebar-close" onclick="closeMobileMenu()">✕</button>
  </div>
  
  <nav class="sidebar-nav">
    <div class="nav-section">
      <h3 class="nav-section-title">Main</h3>
      <a href="#dashboard" class="nav-link active" onclick="switchPage('dashboard')">
        <span class="nav-icon">📊</span>
        <span class="nav-text">Dashboard</span>
        <span class="nav-badge">5</span>
      </a>
    </div>

    <div class="nav-section">
      <h3 class="nav-section-title">System</h3>
      <a href="#sensors" class="nav-link" onclick="switchPage('sensors')">
        <span class="nav-icon">📡</span>
        <span class="nav-text">Sensors</span>
      </a>
      <a href="#alerts" class="nav-link" onclick="switchPage('alerts')">
        <span class="nav-icon">🚨</span>
        <span class="nav-text">Alerts</span>
        <span class="nav-badge alert">3</span>
      </a>
      </a>
    </div>

    <div class="nav-section">
      <h3 class="nav-section-title">Management</h3>
      <a href="#users" class="nav-link" onclick="switchPage('users')">
        <span class="nav-icon">👥</span>
        <span class="nav-text">Users</span>
      </a>
      <a href="#reports" class="nav-link" onclick="switchPage('reports')">
        <span class="nav-icon">📈</span>
        <span class="nav-text">Reports</span>
      </a>
      <a href="#logs" class="nav-link" onclick="switchPage('logs')">
        <span class="nav-icon">📋</span>
        <span class="nav-text">System Logs</span>
      </a>
    </div>

    <div class="nav-section">
      <h3 class="nav-section-title">Configuration</h3>
      <a href="#settings" class="nav-link" onclick="switchPage('settings')">
        <span class="nav-icon">⚙️</span>
        <span class="nav-text">Settings</span>
      </a>
    </div>
  </nav>

  <div class="sidebar-footer">
    <div class="user-profile-mini">
      <div class="user-avatar-mini" id="userAvatarMini">A</div>
      <div class="user-info-mini">
        <p class="user-name-mini" id="userNameMini">Admin</p>
        <p class="user-role-mini" id="userRoleMini">Administrator</p>
      </div>
    </div>
    <button class="btn-logout" onclick="logout()">🚪 Logout</button>
  </div>
</aside>

<!-- Overlay for mobile menu -->
<div class="sidebar-overlay" id="sidebarOverlay" onclick="closeMobileMenu()"></div>

<!-- Main Content -->
<main class="admin-main">
  <!-- Top Header -->
  <header class="admin-header">
    <div class="header-left">
      <h2 id="page-title" class="page-title">Dashboard</h2>
      <p class="page-subtitle" id="pageSubtitle">Welcome back, <span id="greetingName">Admin</span>!</p>
    </div>
    <div class="header-right">
      <div class="header-controls">
        <div class="search-box">
          <input type="text" placeholder="🔍 Search..." class="search-input">
        </div>
        <button class="header-icon-btn" title="Notifications">
          <span>🔔</span>
          <span class="notification-badge">3</span>
        </button>
        <button class="header-icon-btn" title="Settings">
          <span>⚙️</span>
        </button>
        <div class="admin-user-header">
          <div class="user-avatar-header" id="userAvatarHeader">A</div>
          <div class="user-dropdown">
            <p class="user-name-header" id="userNameHeader">Admin</p>
            <p class="user-role-header">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Content Area -->
  <div class="admin-content">

    <!-- Dashboard Page -->
    <div id="dashboard-page" class="page-content active">
      <div class="dashboard-welcome">
        <div class="welcome-center">
          <h3>📊 Dashboard Overview</h3>
          <p>Real-time system monitoring and analytics</p>
        </div>
        <div class="welcome-right">
          <div class="date-time-display">
            <div class="current-date" id="currentDate">--/--/----</div>
            <div class="current-time" id="currentTime">--:--:--</div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="stat-card gradient-blue">
          <div class="stat-header">
            <h4>Total April</h4>
            <span class="stat-icon">📅</span>
          </div>
          <div class="stat-value">87%</div>
          <div class="stat-change positive">↑ 12% from last month</div>
          <div class="stat-bar">
            <div class="stat-bar-fill" style="width: 87%"></div>
          </div>
        </div>

        <div class="stat-card gradient-green">
          <div class="stat-header">
            <h4>Collections Today</h4>
            <span class="stat-icon">✅</span>
          </div>
          <div class="stat-value">24</div>
          <div class="stat-change positive">↑ 8 more than yesterday</div>
          <div class="stat-bar">
            <div class="stat-bar-fill" style="width: 90%"></div>
          </div>
        </div>

        <div class="stat-card gradient-orange">
          <div class="stat-header">
            <h4>Active Alerts</h4>
            <span class="stat-icon">⚠️</span>
          </div>
          <div class="stat-value">5</div>
          <div class="stat-change negative">↑ 3 new alerts</div>
          <div class="stat-bar">
            <div class="stat-bar-fill" style="width: 45%"></div>
          </div>
        </div>

        <div class="stat-card gradient-purple">
          <div class="stat-header">
            <h4>System Uptime</h4>
            <span class="stat-icon">⏱️</span>
          </div>
          <div class="stat-value">99.8%</div>
          <div class="stat-change positive">↑ 0.1% improvement</div>
          <div class="stat-bar">
            <div class="stat-bar-fill" style="width: 99%"></div>
          </div>
        </div>

        <div class="stat-card gradient-cyan">
          <div class="stat-header">
            <h4>Users</h4>
            <span class="stat-icon">👥</span>
          </div>
          <div class="stat-value" id="userCount">0</div>
          <div class="stat-change positive" id="userChange">↑ Active collectors</div>
          <div class="stat-bar">
            <div class="stat-bar-fill" id="userBar" style="width: 0%"></div>
          </div>
        </div>
      </div>

      <div class="dashboard-charts">
        <div class="chart-container full-width">
          <div class="chart-header">
            <h3>📊 Waste Collection Trends</h3>
            <div class="chart-controls">
              <select class="chart-period" id="dashboardChartPeriod" onchange="updateDashboardTrendChart(this.value)">
                <option value="7">Last 7 Days</option>
                <option value="15">Last 15 Days</option>
                <option value="30">Last 30 Days</option>
              </select>
            </div>
          </div>
          <div class="chart-canvas-wrapper" style="position: relative; height: 300px; width: 100%;">
            <canvas id="trendChart"></canvas>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-header">
            <h3>🎯 Waste Distribution</h3>
          </div>
          <div class="chart-canvas-wrapper" style="position: relative; height: 300px; width: 100%;">
            <canvas id="distributionChart"></canvas>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-header">
            <h3>📈 System Performance</h3>
          </div>
          <div class="chart-canvas-wrapper" style="position: relative; height: 300px; width: 100%;">
            <canvas id="performanceChart"></canvas>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-header">
            <h3>🏥 System Health</h3>
          </div>
          <div class="chart-canvas-wrapper" style="position: relative; height: 300px; width: 100%;">
            <canvas id="healthChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Bin Management Statistics -->
      <div class="data-section">
        <h3>🗑️ Bin Management Statistics</h3>
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-label">Total Bins</div>
            <div class="stat-number" id="totalBins">156</div>
            <div class="stat-sub">Active in system</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Active Bins</div>
            <div class="stat-number green" id="activeBins">142</div>
            <div class="stat-sub">91% operational</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Critical Level</div>
            <div class="stat-number red" id="criticalBins">8</div>
            <div class="stat-sub">Need immediate pickup</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Empty Bins</div>
            <div class="stat-number orange" id="emptyBins">6</div>
            <div class="stat-sub">Pending deployment</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Maintenance Due</div>
            <div class="stat-number" id="maintenanceBins">5</div>
            <div class="stat-sub">Scheduled this week</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Average Capacity</div>
            <div class="stat-number" id="avgCapacity">68%</div>
            <div class="stat-sub">System-wide average</div>
          </div>
        </div>
      </div>

      <!-- Waste Type Distribution -->
      <div class="data-section">
        <h3>♻️ Waste Type Distribution</h3>
        <div class="waste-types-grid">
          <div class="waste-type-card">
            <div class="waste-icon">🌱</div>
            <div class="waste-label">Biodegradable</div>
            <div class="waste-percentage">40%</div>
            <div class="waste-details">640 kg today</div>
            <div class="waste-categories">
              <small>📋 Categories:</small><br>
              <small>• Food scraps • Leaves • Plant matter<br>• Paper napkins • Cardboard</small>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 40%; background: #34d399;"></div>
            </div>
          </div>
          <div class="waste-type-card">
            <div class="waste-icon">📦</div>
            <div class="waste-label">Non-Biodegradable</div>
            <div class="waste-percentage">36%</div>
            <div class="waste-details">576 kg today</div>
            <div class="waste-categories">
              <small>📋 Categories:</small><br>
              <small>• Plastic bottles • Plastic bags • Packaging<br>• Metal cans • Glass</small>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 48%; background: #60a5fa;"></div>
            </div>
          </div>
          <div class="waste-type-card">
            <div class="waste-icon">⚠️</div>
            <div class="waste-label">Hazardous</div>
            <div class="waste-percentage">24%</div>
            <div class="waste-details">384 kg today</div>
            <div class="waste-categories">
              <small>📋 Categories:</small><br>
              <small>• Chemicals • Batteries • Medical waste<br>• Oil • Paint • Contaminated materials • Electronics</small>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: 12%; background: #f87171;"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sensor & Device Health -->
      <div class="data-section">
        <h3>� System Performance</h3>
        <div class="performance-grid">
          <div class="performance-item">
            <div class="performance-name">🌱 Biodegradable</div>
            <div class="performance-bar">
              <div class="performance-fill" style="width: 92%">92%</div>
            </div>
            <div class="performance-details">
              <span class="perf-label">Collected:</span>
              <span class="perf-value">46/50</span>
            </div>
          </div>
          <div class="performance-item">
            <div class="performance-name">📦 Non-Biodegradable</div>
            <div class="performance-bar">
              <div class="performance-fill" style="width: 88%">88%</div>
            </div>
            <div class="performance-details">
              <span class="perf-label">Collected:</span>
              <span class="perf-value">44/50</span>
            </div>
          </div>
          <div class="performance-item">
            <div class="performance-name">⚠️ Hazardous</div>
            <div class="performance-bar">
              <div class="performance-fill" style="width: 95%">95%</div>
            </div>
            <div class="performance-details">
              <span class="perf-label">Collected:</span>
              <span class="perf-value">19/20</span>
            </div>
          </div>
        </div>
      </div>

      <div class="recent-activities">
        <h3>📝 Recent Activities</h3>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon error">🔴</div>
            <div class="activity-content">
              <p class="activity-title">Hazardous Bin Alert</p>
              <p class="activity-time">2 minutes ago</p>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon success">✅</div>
            <div class="activity-content">
              <p class="activity-title">South Zone Collection Completed</p>
              <p class="activity-time">15 minutes ago</p>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon info">ℹ️</div>
            <div class="activity-content">
              <p class="activity-title">System Maintenance Scheduled</p>
              <p class="activity-time">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Page -->
    <div id="users-page" class="page-content">
      <div class="page-header">
        <h2>User Management</h2>
        <p>Manage system users and permissions</p>
        <button class="btn-primary" onclick="openUserRegistration()">+ Add User</button>
      </div>

      <div class="users-table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- Users loaded dynamically -->
          </tbody>
        </table>
      </div>
    </div>

    <!-- Alerts Page -->
    <div id="alerts-page" class="page-content">
      <div class="page-header">
        <h2>Alert Management</h2>
        <p>Monitor and manage real-time system alerts and notifications</p>
      </div>

      <!-- Alert Statistics -->
      <div class="data-section">
        <div class="alerts-stats-grid">
          <div class="alert-stat-card critical">
            <div class="stat-number" id="criticalAlertsCount">3</div>
            <div class="stat-label">Critical</div>
            <div class="stat-sublabel">Immediate action needed</div>
          </div>
          <div class="alert-stat-card warning">
            <div class="stat-number" id="warningAlertsCount">5</div>
            <div class="stat-label">Warning</div>
            <div class="stat-sublabel">Attention required</div>
          </div>
          <div class="alert-stat-card info">
            <div class="stat-number" id="infoAlertsCount">8</div>
            <div class="stat-label">Information</div>
            <div class="stat-sublabel">System updates</div>
          </div>
          <div class="alert-stat-card success">
            <div class="stat-number" id="resolvedAlertsCount">24</div>
            <div class="stat-label">Resolved</div>
            <div class="stat-sublabel">Today</div>
          </div>
        </div>
      </div>

      <!-- Alert Filters & Actions -->
      <div class="data-section">
        <div class="alerts-filter-bar">
          <div class="filter-group">
            <button class="filter-btn active" onclick="filterAlerts('all')">All Alerts</button>
            <button class="filter-btn" onclick="filterAlerts('critical')">Critical</button>
            <button class="filter-btn" onclick="filterAlerts('warning')">Warning</button>
            <button class="filter-btn" onclick="filterAlerts('info')">Info</button>
            <button class="filter-btn" onclick="filterAlerts('resolved')">Resolved</button>
          </div>
          <div class="action-buttons">
            <button class="btn-secondary" onclick="dismissAllAlerts()">Dismiss All</button>
            <button class="btn-secondary" onclick="markAllAsRead()">Mark as Read</button>
          </div>
        </div>
      </div>

      <!-- Alerts Container -->
      <div class="data-section">
        <div class="alerts-container" id="alertsContainer">
          <!-- Alerts loaded dynamically by JavaScript -->
        </div>
      </div>
    </div>

    <!-- Reports Page -->
    <div id="reports-page" class="page-content">
      <div class="page-header">
        <h2>Monthly Reports</h2>
        <p>View your waste collection and system performance reports</p>
      </div>

      <!-- Monthly Summary - Percentage Breakdown -->
      <div class="data-section">
        <h3>📊 Monthly Summary</h3>
        <div class="monthly-summary-container">
          <div class="summary-header">
            <button class="nav-arrow prev" onclick="changeMonthSummary(-1)">←</button>
            <h3 id="monthlySummaryMonth">April 2026</h3>
            <button class="nav-arrow next" onclick="changeMonthSummary(1)">→</button>
          </div>
          <div class="summary-slider" id="adminSummarySlider">
            <div class="summary-slide" data-month="January 2026">
              <div class="month-stats">
                <div class="stat bio"><span class="label">Biodegradable</span><span class="value">35%</span></div>
                <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">52%</span></div>
                <div class="stat hazard"><span class="label">Hazardous</span><span class="value">13%</span></div>
              </div>
              <p class="total-waste">Total percent collected: <strong>100%</strong></p>
            </div>
            <div class="summary-slide" data-month="February 2026">
              <div class="month-stats">
                <div class="stat bio"><span class="label">Biodegradable</span><span class="value">33%</span></div>
                <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">54%</span></div>
                <div class="stat hazard"><span class="label">Hazardous</span><span class="value">13%</span></div>
              </div>
              <p class="total-waste">Total percent collected: <strong>100%</strong></p>
            </div>
            <div class="summary-slide" data-month="March 2026">
              <div class="month-stats">
                <div class="stat bio"><span class="label">Biodegradable</span><span class="value">38%</span></div>
                <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">48%</span></div>
                <div class="stat hazard"><span class="label">Hazardous</span><span class="value">14%</span></div>
              </div>
              <p class="total-waste">Total percent collected: <strong>100%</strong></p>
            </div>
            <div class="summary-slide active" data-month="April 2026">
              <div class="month-stats">
                <div class="stat bio"><span class="label">Biodegradable</span><span class="value">40%</span></div>
                <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">36%</span></div>
                <div class="stat hazard"><span class="label">Hazardous</span><span class="value">24%</span></div>
              </div>
              <p class="total-waste">Total percent collected: <strong>100%</strong></p>
            </div>
            <div class="summary-slide" data-month="May 2026">
              <div class="month-stats">
                <div class="stat bio"><span class="label">Biodegradable</span><span class="value">39%</span></div>
                <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">37%</span></div>
                <div class="stat hazard"><span class="label">Hazardous</span><span class="value">24%</span></div>
              </div>
              <p class="total-waste">Total percent collected: <strong>100%</strong></p>
            </div>
            <div class="summary-slide" data-month="June 2026">
              <div class="month-stats">
                <div class="stat bio"><span class="label">Biodegradable</span><span class="value">37%</span></div>
                <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">39%</span></div>
                <div class="stat hazard"><span class="label">Hazardous</span><span class="value">24%</span></div>
              </div>
              <p class="total-waste">Total percent collected: <strong>100%</strong></p>
            </div>
            <div class="summary-slide" data-month="July 2026">
              <div class="month-stats">
                <div class="stat bio"><span class="label">Biodegradable</span><span class="value">41%</span></div>
                <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">35%</span></div>
                <div class="stat hazard"><span class="label">Hazardous</span><span class="value">24%</span></div>
              </div>
              <p class="total-waste">Total percent collected: <strong>100%</strong></p>
            </div>
            <div class="summary-slide" data-month="August 2026">
              <div class="month-stats">
                <div class="stat bio"><span class="label">Biodegradable</span><span class="value">38%</span></div>
                <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">38%</span></div>
                <div class="stat hazard"><span class="label">Hazardous</span><span class="value">24%</span></div>
              </div>
              <p class="total-waste">Total percent collected: <strong>100%</strong></p>
            </div>
            <div class="summary-slide" data-month="September 2026">
              <div class="month-stats">
                <div class="stat bio"><span class="label">Biodegradable</span><span class="value">36%</span></div>
                <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">40%</span></div>
                <div class="stat hazard"><span class="label">Hazardous</span><span class="value">24%</span></div>
              </div>
              <p class="total-waste">Total percent collected: <strong>100%</strong></p>
            </div>
            <div class="summary-slide" data-month="October 2026">
              <div class="month-stats">
                <div class="stat bio"><span class="label">Biodegradable</span><span class="value">39%</span></div>
                <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">37%</span></div>
                <div class="stat hazard"><span class="label">Hazardous</span><span class="value">24%</span></div>
              </div>
              <p class="total-waste">Total percent collected: <strong>100%</strong></p>
            </div>
            <div class="summary-slide" data-month="November 2026">
              <div class="month-stats">
                <div class="stat bio"><span class="label">Biodegradable</span><span class="value">35%</span></div>
                <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">41%</span></div>
                <div class="stat hazard"><span class="label">Hazardous</span><span class="value">24%</span></div>
              </div>
              <p class="total-waste">Total percent collected: <strong>100%</strong></p>
            </div>
            <div class="summary-slide" data-month="December 2026">
              <div class="month-stats">
                <div class="stat bio"><span class="label">Biodegradable</span><span class="value">34%</span></div>
                <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">42%</span></div>
                <div class="stat hazard"><span class="label">Hazardous</span><span class="value">24%</span></div>
              </div>
              <p class="total-waste">Total percent collected: <strong>100%</strong></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Waste Collection Trends Chart -->
      <div class="data-section">
        <div class="chart-container full-width">
          <div class="chart-header">
            <h3>📊 Waste Collection Trends</h3>
            <div class="chart-controls">
              <select class="chart-period" id="reportChartPeriod" onchange="updateReportsTrendChart(this.value)">
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="365">Last Year</option>
              </select>
            </div>
          </div>
          <div class="chart-canvas-wrapper" style="position: relative; height: 300px; width: 100%;">
            <canvas id="reportsTrendChart"></canvas>
          </div>
        </div>
      </div>

      <div class="data-section">
        <h3>📅 Interactive Calendar - Daily Summary</h3>
        <div class="calendar-grid-container">
          <div class="calendar-nav">
            <button class="calendar-btn prev" onclick="prevCalendarMonth()">← Previous</button>
            <h3 id="calendarMonthYear">April 2026</h3>
            <button class="calendar-btn next" onclick="nextCalendarMonth()">Next →</button>
          </div>
          
          <div class="calendar-grid">
            <div class="calendar-weekdays">
              <div class="weekday">Sun</div>
              <div class="weekday">Mon</div>
              <div class="weekday">Tue</div>
              <div class="weekday">Wed</div>
              <div class="weekday">Thu</div>
              <div class="weekday">Fri</div>
              <div class="weekday">Sat</div>
            </div>
            <div class="calendar-dates" id="calendarDates">
              <!-- Generated by JavaScript -->
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly/Monthly Summary (Connected to Calendar) -->
      <div class="data-section">
        <div class="week-selector-container">
          <h3 id="periodSummaryTitle">📊 Weekly Summary - Week 1 (April 1-9, 2026)</h3>
          <div class="week-selector-buttons">
            <button class="week-btn active" onclick="selectWeek(1)">Week 1</button>
            <button class="week-btn" onclick="selectWeek(2)">Week 2</button>
            <button class="week-btn" onclick="selectWeek(3)">Week 3</button>
            <button class="week-btn" onclick="selectWeek(4)">Week 4</button>
            <button class="week-btn" onclick="selectWeek(5)" style="display: none;">Week 5</button>
            <button class="week-btn month-btn" onclick="selectWeek('month')">Full Month</button>
          </div>
        </div>
        <div class="daily-summary-box" id="summaryBox">
          <div class="daily-stat-row" id="singleWeekDisplay">
            <div class="daily-stat">
              <span class="daily-label">Total Waste</span>
              <span class="daily-value" id="periodTotalWaste">100%</span>
            </div>
            <div class="daily-stat">
              <span class="daily-label">Biodegradable</span>
              <span class="daily-value bio-text" id="periodBiodegradable">40%</span>
            </div>
            <div class="daily-stat">
              <span class="daily-label">Non-Biodegradable</span>
              <span class="daily-value nonbio-text" id="periodNonBiodegradable">36%</span>
            </div>
            <div class="daily-stat">
              <span class="daily-label">Hazardous</span>
              <span class="daily-value hazard-text" id="periodHazardous">24%</span>
            </div>
          </div>
          <div class="multi-week-display" id="multiWeekDisplay" style="display: none;">
            <!-- Week rows will be generated by JavaScript -->
          </div>
        </div>
      </div>

      <!-- Monthly Statistics View -->
      <div class="data-section">
        <div class="stats-header">
          <h3>📈 Waste Collection Statistics by Week</h3>
          <div class="stats-legend">
            <span class="legend-item"><span class="legend-dot bio"></span>Bio-Degradable</span>
            <span class="legend-item"><span class="legend-dot nonbio"></span>Non-Biodegradable</span>
            <span class="legend-item"><span class="legend-dot hazard"></span>Hazardous</span>
          </div>
        </div>
        
        <!-- Enhanced Week Cards (Generated Dynamically) -->
        <div class="enhanced-stats-grid" id="enhancedStatsGrid">
          <!-- Generated by JavaScript based on number of weeks in month -->
        </div>

        <!-- Overall Month Statistics -->
        <div class="month-summary-box" id="monthSummaryBox">
          <div class="summary-stat">
            <span class="stat-label">Total Monthly Waste</span>
            <span class="stat-value">100%</span>
            <span class="stat-sublabel"><span id="weeksCount">4</span> Weeks Aggregated</span>
          </div>
          <div class="summary-stat">
            <span class="stat-label">Avg Bio-Degradable</span>
            <span class="stat-value bio-text" id="monthBioValue">40%</span>
            <span class="stat-sublabel">Consistent Collection</span>
          </div>
          <div class="summary-stat">
            <span class="stat-label">Avg Non-Biodegradable</span>
            <span class="stat-value nonbio-text" id="monthNonbioValue">36%</span>
            <span class="stat-sublabel">Recyclable Materials</span>
          </div>
          <div class="summary-stat">
            <span class="stat-label">Avg Hazardous</span>
            <span class="stat-value hazard-text" id="monthHazardValue">24%</span>
            <span class="stat-sublabel">Safety Compliant</span>
          </div>
        </div>
      </div>

      <!-- Download Report -->
      <div class="data-section">
        <h3>📥 Report Actions</h3>
        <div class="report-actions">
          <button class="btn-primary" onclick="downloadReport('pdf')">📄 Download as PDF</button>
          <button class="btn-primary" onclick="downloadReport('xlsx')">📊 Download as Excel</button>
          <button class="btn-secondary" onclick="printReport()">🖨️ Print Report</button>
        </div>
      </div>
    </div>

    <!-- System Logs Page -->
    <div id="logs-page" class="page-content">
      <div class="page-header">
        <h2>System Logs & Security Events</h2>
        <p>Monitor all system activity, PIN unlock events, and security incidents</p>
      </div>

      <!-- Security Logs Statistics -->
      <div class="data-section">
        <div class="alerts-stats-grid">
          <div class="alert-stat-card success">
            <div class="stat-number" id="successfulPinCount">0</div>
            <div class="stat-label">PIN Unlocks</div>
            <div class="stat-sublabel">Successful attempts</div>
          </div>
          <div class="alert-stat-card warning">
            <div class="stat-number" id="failedPinCount">0</div>
            <div class="stat-label">Failed Attempts</div>
            <div class="stat-sublabel">Invalid PIN entries</div>
          </div>
          <div class="alert-stat-card info">
            <div class="stat-number" id="totalLogsCount">0</div>
            <div class="stat-label">Total Events</div>
            <div class="stat-sublabel">Security & system logs</div>
          </div>
          <div class="alert-stat-card">
            <div class="stat-number" id="usersAccessedCount">0</div>
            <div class="stat-label">Users Accessed</div>
            <div class="stat-sublabel">Unique PIN holders</div>
          </div>
        </div>
      </div>

      <!-- Filter & Search Controls -->
      <div class="data-section">
        <div class="alerts-filter-bar">
          <div class="filter-group">
            <button class="filter-btn active" onclick="filterSecurityLogs('all')">All Events</button>
            <button class="filter-btn" onclick="filterSecurityLogs('PIN_UNLOCK_SUCCESS')">✅ Successful Unlocks</button>
            <button class="filter-btn" onclick="filterSecurityLogs('PIN_UNLOCK_FAILED')">❌ Failed Attempts</button>
            <button class="filter-btn" onclick="filterSecurityLogs('SESSION')">🔐 Sessions</button>
          </div>
          <div class="action-buttons">
            <input type="text" id="logSearchInput" placeholder="🔍 Search logs..." class="search-input" onkeyup="searchSecurityLogs(this.value)">
            <button class="btn-secondary" onclick="clearAllLogs()">🗑️ Clear Logs</button>
            <button class="btn-secondary" onclick="exportSecurityLogs()">📥 Export Logs</button>
          </div>
        </div>
      </div>

      <!-- Security Logs Container -->
      <div class="data-section">
        <div class="logs-table-container">
          <table class="logs-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event Type</th>
                <th>User / Details</th>
                <th>Status</th>
                <th>Severity</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody id="logsTableBody">
              <tr><td colspan="6" style="text-align: center; padding: 40px; color: #8b92b4;">No security logs yet. PIN unlocks will appear here.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detailed Logs View -->
      <div class="data-section">
        <h3>📊 Security Events Timeline</h3>
        <div class="timeline-container" id="securityTimeline">
          <p style="text-align: center; padding: 30px; color: #8b92b4;">Activity timeline will display here</p>
        </div>
      </div>
    </div>

    <!-- Sensors Page -->
    <div id="sensors-page" class="page-content">
      <div class="page-header">
        <h2>Active Detection Sensors</h2>
        <p>Monitor all detection sensors and collection activities in real-time</p>
      </div>

      <!-- Detection Sensors & Collections Insight -->
      <div class="data-section">
        <div class="detection-header">
          <h3>🔍 Detection Sensors & Collections Intelligence</h3>
          <div class="detection-quick-stats">
            <div class="quick-stat">
              <span class="stat-icon">📡</span>
              <div class="stat-info">
                <span class="stat-label">Active Sensors</span>
                <span class="stat-value" id="activeSensors">12</span>
              </div>
            </div>
            <div class="quick-stat">
              <span class="stat-icon">📦</span>
              <div class="stat-info">
                <span class="stat-label">Collections Today</span>
                <span class="stat-value" id="collectionsToday">24</span>
              </div>
            </div>
            <div class="quick-stat">
              <span class="stat-icon">✅</span>
              <div class="stat-info">
                <span class="stat-label">Avg Accuracy</span>
                <span class="stat-value" id="avgAccuracy">94.5%</span>
              </div>
            </div>
            <div class="quick-stat">
              <span class="stat-icon">⚡</span>
              <div class="stat-info">
                <span class="stat-label">Response Time</span>
                <span class="stat-value" id="responseTime">2.3s</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="detection-insight-grid">
          <!-- Detection Sensors -->
          <div class="detection-card">
            <div class="card-header">
              <div class="header-title">
                <h4>📡 Active Detection Sensors</h4>
                <span class="sensor-status online">● Live</span>
              </div>
              <div class="filter-controls">
                <select id="sensorTypeFilter" class="filter-dropdown" onchange="filterSensors()">
                  <option value="all">All Sensors</option>
                  <option value="camera">Camera</option>
                  <option value="ultrasonic">Ultrasonic</option>
                </select>
              </div>
            </div>
            
            <div class="sensor-summary">
              <div class="summary-item">
                <span class="summary-icon">✅</span>
                <span class="summary-text">Operational</span>
                <span class="summary-value" id="operationalSensors">11</span>
              </div>
              <div class="summary-item">
                <span class="summary-icon">⚠️</span>
                <span class="summary-text">Calibrating</span>
                <span class="summary-value" id="calibratingSensors">1</span>
              </div>
              <div class="summary-item">
                <span class="summary-icon">🔴</span>
                <span class="summary-text">Offline</span>
                <span class="summary-value" id="offlineSensors">0</span>
              </div>
            </div>
            
            <div class="sensor-list" id="sensorList">
              <!-- Populated by JavaScript -->
            </div>
          </div>

          <!-- Collections Activity -->
          <div class="detection-card">
            <div class="card-header">
              <div class="header-title">
                <h4>📦 Collections Activity</h4>
                <span class="collection-status active">● Active</span>
              </div>
              <div class="filter-controls">
                <select id="collectionStatusFilter" class="filter-dropdown" onchange="filterCollections()">
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div class="collection-summary">
              <div class="summary-item">
                <span class="summary-icon">✅</span>
                <span class="summary-text">Completed</span>
                <span class="summary-value" id="completedCollections">22</span>
              </div>
              <div class="summary-item">
                <span class="summary-icon">⏱️</span>
                <span class="summary-text">In Progress</span>
                <span class="summary-value" id="inProgressCollections">2</span>
              </div>
              <div class="summary-item">
                <span class="summary-icon">⏳</span>
                <span class="summary-text">Pending</span>
                <span class="summary-value" id="pendingCollections">0</span>
              </div>
            </div>
            
            <div class="collection-list" id="collectionList">
              <!-- Populated by JavaScript -->
            </div>
          </div>
        </div>

        <!-- Detection Performance Chart -->
        <div class="detection-performance">
          <div class="performance-card">
            <h4>📊 Sensor Performance Overview</h4>
            <div class="performance-grid" id="performanceGrid">
              <!-- Populated by JavaScript -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Page -->
    <div id="settings-page" class="page-content">
      <div class="page-header">
        <h2>Settings & Customization</h2>
        <p>Personalize your admin dashboard experience</p>
      </div>

      <div class="settings-container">
        <!-- Website Customization Section -->
        <div class="settings-section">
          <h3>🎨 Website Appearance</h3>
          
          <div class="setting-item">
            <label>Theme Mode</label>
            <div class="theme-toggle">
              <button class="theme-btn active" onclick="setTheme('dark')" data-theme="dark">
                <span class="theme-icon">🌙</span> Dark Mode
              </button>
              <button class="theme-btn" onclick="setTheme('light')" data-theme="light">
                <span class="theme-icon">☀️</span> Light Mode
              </button>
            </div>
          </div>

          <div class="setting-item">
            <label>Primary Accent Color</label>
            <div class="color-picker-group">
              <div class="color-options">
                <button class="color-btn active" onclick="setAccentColor('#60a5fa')" style="background: #60a5fa;" title="Blue">
                  <span class="checkmark">✓</span>
                </button>
                <button class="color-btn" onclick="setAccentColor('#a78bfa')" style="background: #a78bfa;" title="Purple">
                  <span class="checkmark">✓</span>
                </button>
                <button class="color-btn" onclick="setAccentColor('#34d399')" style="background: #34d399;" title="Green">
                  <span class="checkmark">✓</span>
                </button>
                <button class="color-btn" onclick="setAccentColor('#fb923c')" style="background: #fb923c;" title="Orange">
                  <span class="checkmark">✓</span>
                </button>
                <button class="color-btn" onclick="setAccentColor('#ec4899')" style="background: #ec4899;" title="Pink">
                  <span class="checkmark">✓</span>
                </button>
                <button class="color-btn" onclick="setAccentColor('#06b6d4')" style="background: #06b6d4;" title="Cyan">
                  <span class="checkmark">✓</span>
                </button>
              </div>
              <input type="color" id="customColorPicker" class="custom-color-picker" onchange="setAccentColor(this.value)" title="Pick custom color">
            </div>
          </div>

          <div class="setting-item">
            <label>Sidebar Behavior</label>
            <div class="option-select">
              <select id="sidebarBehavior" onchange="setSidebarBehavior(this.value)">
                <option value="sticky">Sticky (Always Visible)</option>
                <option value="collapse">Collapsible</option>
                <option value="overlay">Overlay on Mobile</option>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <label>Font Size Scale</label>
            <div class="slider-control">
              <input type="range" id="fontSizeSlider" min="90" max="120" value="100" class="range-slider" onchange="setFontSize(this.value)">
              <span class="range-value"><span id="fontSizeValue">100</span>%</span>
            </div>
          </div>

          <div class="setting-item">
            <label>Animation Speed</label>
            <div class="option-select">
              <select id="animationSpeed" onchange="setAnimationSpeed(this.value)">
                <option value="slow">Slow (600ms)</option>
                <option value="normal" selected>Normal (400ms)</option>
                <option value="fast">Fast (200ms)</option>
                <option value="instant">Instant (0ms)</option>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <label>Chart Animation</label>
            <div class="toggle-switch">
              <input type="checkbox" id="chartAnimation" checked onchange="toggleChartAnimation(this.checked)">
              <label for="chartAnimation" class="switch-label">Enable smooth chart animations</label>
            </div>
          </div>
        </div>

        <!-- Notifications Section -->
        <div class="settings-section">
          <h3>🔔 Notifications</h3>
          
          <div class="setting-item">
            <label>Desktop Notifications</label>
            <div class="toggle-switch">
              <input type="checkbox" id="desktopNotif" checked onchange="toggleNotifications(this.checked)">
              <label for="desktopNotif" class="switch-label">Receive browser notifications</label>
            </div>
          </div>

          <div class="setting-item">
            <label>Sound Alerts</label>
            <div class="toggle-switch">
              <input type="checkbox" id="soundAlerts" checked onchange="toggleSoundAlerts(this.checked)">
              <label for="soundAlerts" class="switch-label">Play sound for alerts</label>
            </div>
          </div>

          <div class="setting-item">
            <label>Alert Notification Frequency</label>
            <div class="option-select">
              <select id="alertFrequency" onchange="setAlertFrequency(this.value)">
                <option value="instant">Instant (Every alert)</option>
                <option value="normal" selected>Normal (Every 5 minutes)</option>
                <option value="digest">Digest (Hourly summary)</option>
                <option value="silent">Silent (No notifications)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Dashboard Display Section -->
        <div class="settings-section">
          <h3>📊 Dashboard Display</h3>
          
          <div class="setting-item">
            <label>Show Chart Legends</label>
            <div class="toggle-switch">
              <input type="checkbox" id="chartLegends" checked onchange="toggleChartLegends(this.checked)">
              <label for="chartLegends" class="switch-label">Display chart legends</label>
            </div>
          </div>

          <div class="setting-item">
            <label>Cards Per Row</label>
            <div class="option-select">
              <select id="cardsPerRow" onchange="setCardsPerRow(this.value)">
                <option value="auto" selected>Auto (Responsive)</option>
                <option value="4">4 Cards</option>
                <option value="3">3 Cards</option>
                <option value="2">2 Cards</option>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <label>Activity Feed Items</label>
            <div class="slider-control">
              <input type="range" id="activityItems" min="3" max="10" value="5" class="range-slider" onchange="setActivityItems(this.value)">
              <span class="range-value"><span id="activityValue">5</span> items</span>
            </div>
          </div>
        </div>

        <!-- System Settings Section -->
        <div class="settings-section">
          <h3>⚙️ System Settings</h3>
          
          <div class="setting-item">
            <label>Auto-refresh Dashboard</label>
            <div class="option-select">
              <select id="autoRefresh" onchange="setAutoRefresh(this.value)">
                <option value="5">Every 5 seconds</option>
                <option value="10" selected>Every 10 seconds</option>
                <option value="30">Every 30 seconds</option>
                <option value="60">Every 60 seconds</option>
                <option value="0">Disabled</option>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <label>Data Retention Period</label>
            <div class="option-select">
              <select id="dataRetention" onchange="setDataRetention(this.value)">
                <option value="7">7 Days</option>
                <option value="30" selected>30 Days</option>
                <option value="90">90 Days</option>
                <option value="365">1 Year</option>
              </select>
            </div>
          </div>

          <div class="setting-item">
            <label>Time Format</label>
            <div class="option-select">
              <select id="timeFormat" onchange="setTimeFormat(this.value)">
                <option value="12h">12-Hour (12:30 PM)</option>
                <option value="24h" selected>24-Hour (12:30)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="settings-section">
          <h3>🛠️ Actions</h3>
          
          <div class="settings-actions">
            <button id="saveSettingsBtn" class="btn-primary" onclick="saveAllSettings()">
              💾 Save All Settings
            </button>
            <button id="resetSettingsBtn" class="btn-secondary" onclick="resetSettings()">
              🔄 Reset to Defaults
            </button>
            <button id="exportSettingsBtn" class="btn-secondary" onclick="exportSettings()">
              📥 Export Settings
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</main>

<!-- User Registration Modal -->
<div id="userRegistrationModal" class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Register New User</h2>
      <button class="modal-close" onclick="closeUserRegistration()">✕</button>
    </div>

    <form id="userRegistrationForm" class="registration-form" onsubmit="handleUserRegistration(event)">
      <div class="form-row">
        <div class="form-group">
          <label for="firstName">First Name *</label>
          <input type="text" id="firstName" required>
        </div>
        <div class="form-group">
          <label for="lastName">Last Name *</label>
          <input type="text" id="lastName" required>
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email Address *</label>
        <input type="email" id="email" required>
      </div>

      <div class="form-group">
        <label for="role">User Role *</label>
        <select id="role" required onchange="handleRoleChange(this.value)">
          <option value="">Select Role</option>
          <option value="Administrator">Administrator</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Manager">Manager</option>
          <option value="Collector">Collector</option>
        </select>
        <small id="roleInfo" class="role-info"></small>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="password" id="passwordLabel">Password *</label>
          <div class="password-input-group">
            <input type="password" id="password" class="password-input" inputmode="numeric" placeholder="" required>
            <button type="button" class="toggle-password" onclick="togglePassword('password')">👁️</button>
          </div>
          <small id="passwordStrength" class="password-strength"></small>
        </div>
        <div class="form-group">
          <label for="confirmPassword" id="confirmPasswordLabel">Confirm Password *</label>
          <div class="password-input-group">
            <input type="password" id="confirmPassword" class="password-input" inputmode="numeric" placeholder="" required>
            <button type="button" class="toggle-password" onclick="togglePassword('confirmPassword')">👁️</button>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn-secondary" onclick="closeUserRegistration()">Cancel</button>
        <button type="submit" class="btn-primary">Register User</button>
      </div>
    </form>
  </div>
</div>

<!-- Edit User Modal -->
<div id="editUserModal" class="modal-overlay">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Edit User</h2>
      <button class="modal-close" onclick="closeEditUser()">✕</button>
    </div>

    <form id="editUserForm" class="registration-form" onsubmit="handleEditUser(event)">
      <div class="form-group">
        <label>User Name</label>
        <input type="text" id="editUserName" disabled readonly style="background: rgba(96, 165, 250, 0.1); cursor: not-allowed;">
      </div>

      <div class="form-group">
        <label>Email</label>
        <input type="email" id="editUserEmail" disabled readonly style="background: rgba(96, 165, 250, 0.1); cursor: not-allowed;">
      </div>

      <div class="form-group">
        <label>Role</label>
        <input type="text" id="editUserRole" disabled readonly style="background: rgba(96, 165, 250, 0.1); cursor: not-allowed;">
      </div>

      <div class="form-group">
        <label for="editUserStatus">User Status *</label>
        <select id="editUserStatus" required>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
          <option value="On Leave">On Leave</option>
        </select>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="editPassword" id="editPasswordLabel">New Password</label>
          <div class="password-input-group">
            <input type="password" id="editPassword" class="password-input" placeholder="Leave empty to keep current password">
            <button type="button" class="toggle-password" onclick="togglePassword('editPassword')">👁️</button>
          </div>
          <small id="editPasswordStrength" class="password-strength"></small>
          <small style="display: block; font-size: 11px; color: var(--text-muted); margin-top: 4px;">For Collector/Supervisor: 4-digit PIN</small>
        </div>
        <div class="form-group">
          <label for="editConfirmPassword" id="editConfirmPasswordLabel">Confirm Password</label>
          <div class="password-input-group">
            <input type="password" id="editConfirmPassword" class="password-input" placeholder="Leave empty to keep current password">
            <button type="button" class="toggle-password" onclick="togglePassword('editConfirmPassword')">👁️</button>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn-secondary" onclick="closeEditUser()">Cancel</button>
        <button type="submit" class="btn-primary">Save Changes</button>
      </div>
    </form>
  </div>
</div>

<script src="admin-enhanced.js"></script>
</body>
</html>
