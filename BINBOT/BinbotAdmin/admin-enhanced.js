/* ===== Binbot Admin Dashboard - Premium Edition JavaScript ===== */

// ===== DATE & TIME DISPLAY =====
function initializeDateTimeDisplay() {
  updateDateTimeDisplay();
  
  // Update every second
  setInterval(updateDateTimeDisplay, 1000);
}

function updateDateTimeDisplay() {
  const now = new Date();
  const dateElement = document.getElementById('currentDate');
  const timeElement = document.getElementById('currentTime');
  
  if (dateElement) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
  }
  
  if (timeElement) {
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
  }
  
  // Auto-refresh calendar if date has changed
  checkAndUpdateCalendar(now);
}

let lastCalendarDate = null;

function checkAndUpdateCalendar(now) {
  const currentDateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  
  if (lastCalendarDate !== currentDateString) {
    lastCalendarDate = currentDateString;
    
    // Update calendar and related stats when date changes
    if (typeof generateCalendar === 'function') {
      generateCalendar();
    }
    if (typeof updateDetectionStats === 'function') {
      updateDetectionStats();
    }
    if (typeof updateCollectionStats === 'function') {
      updateCollectionStats();
    }
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Check session before initializing app
  const sessionToken = localStorage.getItem('binbot_session');
  if (!sessionToken) {
    window.location.href = 'login-enhanced.php';
    return;
  }

  initializeApp();
  initializeDateTimeDisplay();
  loadUsers();
  initializeCharts();
  initializeReportsPage();
  initializeAlertsPage();
  updateMonthDisplay();
  updateUserStats();
  setupEventListeners();
  updateUserDisplay();
  loadCustomSettings();
});

function initializeApp() {
  // Initialize localStorage with default data if empty
  if (!localStorage.getItem('binbot_users')) {
    const defaultUsers = [
      {
        id: 'USR001',
        name: 'John Supervisor',
        email: 'john@binbot.com',
        role: 'Supervisor',
        department: 'Operations',
        status: 'Active',
        joinDate: '2024-01-15',
        avatar: 'JS'
      },
      {
        id: 'USR002',
        name: 'Sarah Manager',
        email: 'sarah@binbot.com',
        role: 'Manager',
        department: 'Logistics',
        status: 'Active',
        joinDate: '2024-02-20',
        avatar: 'SM'
      },
      {
        id: 'USR003',
        name: 'Mike Collector',
        email: 'mike@binbot.com',
        role: 'Collector',
        department: 'Field',
        status: 'Active',
        joinDate: '2024-03-10',
        avatar: 'MC'
      }
    ];
    localStorage.setItem('binbot_users', JSON.stringify(defaultUsers));
  }

  // Initialize settings
  if (!localStorage.getItem('binbot_settings')) {
    const defaultSettings = {
      bioThreshold: 80,
      plasticThreshold: 75,
      paperThreshold: 85,
      metalThreshold: 80,
      collectionSchedule: 'automatic',
      alertNotifications: true,
      maintenanceAlert: true
    };
    localStorage.setItem('binbot_settings', JSON.stringify(defaultSettings));
  }
}

// Update month display on dashboard
function updateMonthDisplay() {
  const currentDate = new Date(2026, 3, 13); // April 13, 2026 (current date in system)
  const monthName = currentDate.toLocaleString('en-US', { month: 'long' });
  
  // Find all stat cards and update the month
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards.length > 0) {
    const firstCard = statCards[0];
    const header = firstCard.querySelector('.stat-header h4');
    if (header) {
      header.textContent = `Total ${monthName}`;
    }
  }
}

// Update user stats on dashboard
function updateUserStats() {
  const users = JSON.parse(localStorage.getItem('binbot_users') || '[]');
  // Count only users who are not Admin or Manager (i.e., only Collectors)
  const collectorCount = users.filter(u => u.role === 'Collector').length;
  
  const userCountElement = document.getElementById('userCount');
  const userChangeElement = document.getElementById('userChange');
  const userBar = document.getElementById('userBar');
  
  if (userCountElement) {
    userCountElement.textContent = collectorCount;
  }
  
  if (userChangeElement) {
    userChangeElement.textContent = `↑ ${collectorCount} Active collectors`;
  }
  
  if (userBar) {
    // Calculate percentage based on max of 10 collectors
    const percentage = Math.min((collectorCount / 10) * 100, 100);
    userBar.style.width = percentage + '%';
  }
}

// ===== PAGE NAVIGATION =====
function switchPage(pageName) {
  // Hide all pages
  const pages = document.querySelectorAll('.page-content');
  pages.forEach(page => page.classList.remove('active'));

  // Show selected page
  const selectedPage = document.getElementById(`${pageName}-page`);
  if (selectedPage) {
    selectedPage.classList.add('active');
  }

  // Update active nav link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => link.classList.remove('active'));
  event.target.closest('.nav-link').classList.add('active');

  // Update page title
  const pageTitle = {
    'dashboard': '📊 Dashboard',
    'overview': '👁️ Overview',
    'sensors': '📡 Sensors',
    'alerts': '🚨 Alerts',
    'bin-status': '📦 Bin Status',
    'users': '👥 Users',
    'reports': '📈 Reports',
    'logs': '📋 System Logs',
    'settings': '⚙️ Settings',
    'maintenance': '🔧 Maintenance'
  };

  document.getElementById('page-title').textContent = pageTitle[pageName] || 'Dashboard';

  // Close mobile menu if open
  closeMobileMenu();

  // Load specific page data
  if (pageName === 'users') {
    loadUsers();
  } else if (pageName === 'settings') {
    loadSettings();
  } else if (pageName === 'alerts') {
    initializeAlertsPage();
  } else if (pageName === 'reports') {
    initializeReportsPage();
  } else if (pageName === 'logs') {
    loadSecurityLogs();
  }
}

// ===== USER MANAGEMENT =====
function loadUsers() {
  const users = JSON.parse(localStorage.getItem('binbot_users') || '[]');
  const tbody = document.querySelector('.users-table tbody');

  if (!tbody) return;

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #8b92b4;">No users found</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(user => `
    <tr>
      <td>
        <div class="user-cell">
          <div class="user-avatar">${user.avatar}</div>
          <div class="user-info">
            <p class="user-name">${user.name}</p>
            <p class="user-email">${user.email}</p>
          </div>
        </div>
      </td>
      <td>
        <span class="badge badge-${user.role.toLowerCase().replace(' ', '-')}">${user.role}</span>
      </td>
      <td>
        <span class="badge badge-${user.status.toLowerCase()}">${user.status}</span>
      </td>
      <td>${new Date(user.joinDate).toLocaleDateString()}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-action" onclick="editUser('${user.id}')">Edit</button>
          <button class="btn-action btn-delete" onclick="deleteUser('${user.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
  
  // Update user stats on dashboard
  updateUserStats();
}

function deleteUser(userId) {
  if (confirm('Are you sure you want to delete this user?')) {
    let users = JSON.parse(localStorage.getItem('binbot_users') || '[]');
    users = users.filter(u => u.id !== userId);
    localStorage.setItem('binbot_users', JSON.stringify(users));
    loadUsers();
    showNotification('User deleted successfully', 'success');
  }
}

function editUser(userId) {
  const users = JSON.parse(localStorage.getItem('binbot_users') || '[]');
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    showNotification('User not found', 'error');
    return;
  }
  
  // Populate the edit modal
  document.getElementById('editUserName').value = user.name;
  document.getElementById('editUserEmail').value = user.email;
  document.getElementById('editUserRole').value = user.role;
  document.getElementById('editUserStatus').value = user.status;
  
  // Clear password fields
  document.getElementById('editPassword').value = '';
  document.getElementById('editConfirmPassword').value = '';
  
  // Set password label based on role
  const passwordLabel = document.getElementById('editPasswordLabel');
  const confirmPasswordLabel = document.getElementById('editConfirmPasswordLabel');
  const passwordInput = document.getElementById('editPassword');
  const confirmPasswordInput = document.getElementById('editConfirmPassword');
  
  if (user.role === 'Collector' || user.role === 'Supervisor') {
    passwordLabel.textContent = 'New PIN (4 digits)';
    confirmPasswordLabel.textContent = 'Confirm PIN';
    passwordInput.inputMode = 'numeric';
    confirmPasswordInput.inputMode = 'numeric';
    passwordInput.placeholder = 'Enter 4-digit PIN (optional)';
    confirmPasswordInput.placeholder = 'Confirm 4-digit PIN (optional)';
  } else {
    passwordLabel.textContent = 'New Password';
    confirmPasswordLabel.textContent = 'Confirm Password';
    passwordInput.inputMode = 'text';
    confirmPasswordInput.inputMode = 'text';
    passwordInput.placeholder = 'Leave empty to keep current password';
    confirmPasswordInput.placeholder = 'Leave empty to keep current password';
  }
  
  // Store the userId and role for later use
  document.getElementById('editUserForm').dataset.userId = userId;
  document.getElementById('editUserForm').dataset.userRole = user.role;
  
  // Show the modal
  document.getElementById('editUserModal').style.display = 'flex';
}

function closeEditUser() {
  document.getElementById('editUserModal').style.display = 'none';
}

function handleEditUser(event) {
  event.preventDefault();
  
  const userId = document.getElementById('editUserForm').dataset.userId;
  const userRole = document.getElementById('editUserForm').dataset.userRole;
  const newStatus = document.getElementById('editUserStatus').value;
  const newPassword = document.getElementById('editPassword').value;
  const confirmPassword = document.getElementById('editConfirmPassword').value;
  
  // Validate password/PIN if provided
  if (newPassword || confirmPassword) {
    if (newPassword !== confirmPassword) {
      showNotification('❌ Passwords do not match', 'error');
      return;
    }
    
    if (userRole === 'Collector' || userRole === 'Supervisor') {
      // Validate PIN: exactly 4 digits
      if (!/^\d{4}$/.test(newPassword)) {
        showNotification('❌ PIN must be exactly 4 digits', 'error');
        return;
      }
    } else {
      // Validate password: minimum 8 characters
      if (newPassword.length < 8) {
        showNotification('❌ Password must be at least 8 characters', 'error');
        return;
      }
    }
  }
  
  // Update the user in localStorage
  let users = JSON.parse(localStorage.getItem('binbot_users') || '[]');
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex].status = newStatus;
    
    // Update password/PIN if provided
    if (newPassword) {
      users[userIndex].password = newPassword;
    }
    
    localStorage.setItem('binbot_users', JSON.stringify(users));
    
    // Reload the users table
    loadUsers();
    
    // Close the modal
    closeEditUser();
    
    // Show success message
    if (newPassword) {
      showNotification('✅ User status and password updated successfully!', 'success');
    } else {
      showNotification('✅ User status updated successfully!', 'success');
    }
  }
}

function updateUserDisplay() {
  const user = JSON.parse(localStorage.getItem('binbot_user') || '{}');
  const userName = user.username || 'Admin';
  const userRole = user.role || 'Administrator';
  const userInitial = userName.charAt(0).toUpperCase();

  // Update all user display elements
  document.getElementById('userNameMini').textContent = userName;
  document.getElementById('userRoleMini').textContent = userRole;
  document.getElementById('greetingName').textContent = userName;
  document.getElementById('userNameHeader').textContent = userName;
  document.getElementById('userAvatarMini').textContent = userInitial;
  document.getElementById('userAvatarHeader').textContent = userInitial;
}

// ===== SETTINGS MANAGEMENT =====
// Load custom settings on page load
function loadCustomSettings() {
  const saved = localStorage.getItem('binbot_custom_settings');
  if (saved) {
    const settings = JSON.parse(saved);
    
    if (settings.theme) applyTheme(settings.theme, false);
    if (settings.accentColor) applyAccentColor(settings.accentColor, false);
    if (settings.fontSize) applyFontSize(settings.fontSize, false);
    if (settings.animationSpeed) applyAnimationSpeed(settings.animationSpeed, false);
    if (settings.chartAnimation !== undefined) document.getElementById('chartAnimation').checked = settings.chartAnimation;
    if (settings.desktopNotif !== undefined) document.getElementById('desktopNotif').checked = settings.desktopNotif;
    if (settings.soundAlerts !== undefined) document.getElementById('soundAlerts').checked = settings.soundAlerts;
    if (settings.chartLegends !== undefined) document.getElementById('chartLegends').checked = settings.chartLegends;
  }
}

function saveAllSettings() {
  const settings = {
    theme: document.querySelector('.theme-btn.active')?.dataset.theme || 'dark',
    accentColor: document.body.style.getPropertyValue('--accent-blue') || '#60a5fa',
    sidebar: document.getElementById('sidebarBehavior').value,
    fontSize: document.getElementById('fontSizeSlider').value,
    animationSpeed: document.getElementById('animationSpeed').value,
    chartAnimation: document.getElementById('chartAnimation').checked,
    desktopNotif: document.getElementById('desktopNotif').checked,
    soundAlerts: document.getElementById('soundAlerts').checked,
    alertFrequency: document.getElementById('alertFrequency').value,
    chartLegends: document.getElementById('chartLegends').checked,
    cardsPerRow: document.getElementById('cardsPerRow').value,
    activityItems: document.getElementById('activityItems').value,
    autoRefresh: document.getElementById('autoRefresh').value,
    dataRetention: document.getElementById('dataRetention').value,
    timeFormat: document.getElementById('timeFormat').value,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('binbot_custom_settings', JSON.stringify(settings));
  showNotification('✅ All settings saved successfully!', 'success');
}

function resetSettings() {
  if (confirm('🔄 Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
    localStorage.removeItem('binbot_custom_settings');
    
    // Reset all UI elements
    document.getElementById('fontSizeSlider').value = 100;
    document.getElementById('fontSizeValue').textContent = '100';
    applyFontSize(100, false);
    
    document.getElementById('animationSpeed').value = 'normal';
    applyAnimationSpeed('normal', false);
    
    setTheme('dark');
    setAccentColor('#60a5fa');
    
    document.getElementById('chartAnimation').checked = true;
    document.getElementById('desktopNotif').checked = true;
    document.getElementById('soundAlerts').checked = true;
    document.getElementById('chartLegends').checked = true;
    document.getElementById('sidebarBehavior').value = 'sticky';
    document.getElementById('alertFrequency').value = 'normal';
    document.getElementById('cardsPerRow').value = 'auto';
    document.getElementById('activityItems').value = '5';
    document.getElementById('autoRefresh').value = '10';
    document.getElementById('dataRetention').value = '30';
    document.getElementById('timeFormat').value = '24h';
    
    showNotification('🔄 Settings reset to defaults!', 'success');
  }
}

function exportSettings() {
  const settings = localStorage.getItem('binbot_custom_settings') || '{}';
  const dataStr = JSON.stringify(JSON.parse(settings), null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `binbot-settings-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  showNotification('📥 Settings exported successfully!', 'success');
}

// Theme Management
function setTheme(theme) {
  applyTheme(theme);
  
  // Update button states
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.theme === theme) {
      btn.classList.add('active');
    }
  });
}

function applyTheme(theme, save = true) {
  if (theme === 'light') {
    document.documentElement.style.setProperty('--primary', '#f8fafc');
    document.documentElement.style.setProperty('--secondary', '#f1f5f9');
    document.documentElement.style.setProperty('--tertiary', '#e2e8f0');
    document.documentElement.style.setProperty('--text-primary', '#0f172a');
    document.documentElement.style.setProperty('--text-secondary', '#334155');
    document.documentElement.style.setProperty('--text-muted', '#64748b');
    document.documentElement.style.setProperty('--border-color', '#cbd5e1');
    document.documentElement.style.setProperty('--hover-color', '#e2e8f0');
  } else {
    // Reset to dark mode (default)
    document.documentElement.style.setProperty('--primary', '#0a0f1a');
    document.documentElement.style.setProperty('--secondary', '#0f141f');
    document.documentElement.style.setProperty('--tertiary', '#141a2e');
    document.documentElement.style.setProperty('--text-primary', '#f0f4ff');
    document.documentElement.style.setProperty('--text-secondary', '#c7d2e0');
    document.documentElement.style.setProperty('--text-muted', '#8b92b4');
    document.documentElement.style.setProperty('--border-color', '#1e2747');
    document.documentElement.style.setProperty('--hover-color', '#1a2847');
  }
  
  if (save) saveAllSettings();
}

// Accent Color Management
function setAccentColor(color) {
  applyAccentColor(color);
  
  // Update color button states
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.style.background.includes(color)) {
      btn.classList.add('active');
    }
  });
  
  // Update color picker
  document.getElementById('customColorPicker').value = color;
}

function applyAccentColor(color, save = true) {
  // Parse hex color
  const rgb = parseInt(color.slice(1), 16);
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;
  
  document.documentElement.style.setProperty('--accent-blue', color);
  
  if (save) saveAllSettings();
}

// Font Size Management
function setFontSize(percentage) {
  applyFontSize(percentage);
  document.getElementById('fontSizeValue').textContent = percentage;
}

function applyFontSize(percentage, save = true) {
  const scale = percentage / 100;
  document.documentElement.style.setProperty('--font-scale', scale);
  document.body.style.fontSize = (16 * scale) + 'px';
  
  if (save) saveAllSettings();
}

// Animation Speed Management
function setAnimationSpeed(speed) {
  applyAnimationSpeed(speed);
}

function applyAnimationSpeed(speed, save = true) {
  let duration = 400;
  switch(speed) {
    case 'slow': duration = 600; break;
    case 'normal': duration = 400; break;
    case 'fast': duration = 200; break;
    case 'instant': duration = 0; break;
  }
  
  document.documentElement.style.setProperty('--animation-duration', duration + 'ms');
  
  // Update CSS transitions
  const style = document.getElementById('animation-speed-style') || document.createElement('style');
  style.id = 'animation-speed-style';
  style.textContent = `
    * {
      transition-duration: ${duration}ms !important;
    }
  `;
  if (!document.getElementById('animation-speed-style')) {
    document.head.appendChild(style);
  }
  
  if (save) saveAllSettings();
}

// Sidebar Behavior
function setSidebarBehavior(behavior) {
  // This would control sidebar collapsing, overlay, etc.
  localStorage.setItem('sidebar_behavior', behavior);
  showNotification(`Sidebar behavior set to: ${behavior}`, 'info');
  saveAllSettings();
}

// Chart Options
function toggleChartAnimation(enabled) {
  if (combinedTrendChartInstance) {
    combinedTrendChartInstance.options.animation = enabled ? { duration: 750 } : false;
  }
  saveAllSettings();
}

function toggleChartLegends(enabled) {
  if (combinedTrendChartInstance) {
    combinedTrendChartInstance.options.plugins.legend.display = enabled;
    combinedTrendChartInstance.update();
  }
  saveAllSettings();
}

// Dashboard Display
function setCardsPerRow(count) {
  const grid = document.querySelector('.dashboard-grid');
  if (grid) {
    if (count === 'auto') {
      grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
    } else {
      const colWidths = {
        '4': 'repeat(4, 1fr)',
        '3': 'repeat(3, 1fr)',
        '2': 'repeat(2, 1fr)'
      };
      grid.style.gridTemplateColumns = colWidths[count] || 'repeat(auto-fit, minmax(250px, 1fr))';
    }
  }
  saveAllSettings();
}

function setActivityItems(count) {
  document.getElementById('activityValue').textContent = count;
  const items = document.querySelectorAll('.activity-item');
  items.forEach((item, index) => {
    item.style.display = index < count ? 'flex' : 'none';
  });
  saveAllSettings();
}

// Notifications
function toggleNotifications(enabled) {
  if (enabled && 'Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  saveAllSettings();
}

function toggleSoundAlerts(enabled) {
  localStorage.setItem('sound_alerts', enabled);
  saveAllSettings();
}

function setAlertFrequency(frequency) {
  localStorage.setItem('alert_frequency', frequency);
  saveAllSettings();
}

// System Settings
function setAutoRefresh(seconds) {
  localStorage.setItem('auto_refresh', seconds);
  saveAllSettings();
}

function setDataRetention(days) {
  localStorage.setItem('data_retention', days);
  saveAllSettings();
}

function setTimeFormat(format) {
  localStorage.setItem('time_format', format);
  saveAllSettings();
}

// ===== CHARTS INITIALIZATION =====
// Chart.js context references
let trendChart, distributionChart, performanceChart, healthChart, reportsTrendChart;

function initializeCharts() {
  setTimeout(() => {
    initTrendChart();
    initDistributionChart();
    initPerformanceChart();
    initHealthChart();
  }, 100);
}

function initTrendChart() {
  // Initialize with last 7 days by default
  updateDashboardTrendChart('7');
}

function updateDashboardTrendChart(days) {
  const ctx = document.getElementById('trendChart');
  if (!ctx) return;

  if (trendChart) {
    trendChart.destroy();
  }

  // Generate dates and data based on selected period
  const { labels, bioData, nonBioData, hazardData } = generateDashboardTrendData(parseInt(days));

  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Biodegradable',
          data: bioData,
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#34d399',
          pointBorderColor: '#0a0f1a',
          pointBorderWidth: 2
        },
        {
          label: 'Non-Biodegradable',
          data: nonBioData,
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#60a5fa',
          pointBorderColor: '#0a0f1a',
          pointBorderWidth: 2
        },
        {
          label: 'Hazardous',
          data: hazardData,
          borderColor: '#fb923c',
          backgroundColor: 'rgba(251, 146, 60, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#fb923c',
          pointBorderColor: '#0a0f1a',
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#c7d2e0',
            font: { size: 12, weight: 600 },
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        filler: {
          propagate: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(30, 39, 71, 0.5)',
            drawBorder: false
          },
          ticks: {
            color: '#8b92b4',
            font: { size: 11 }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#8b92b4',
            font: { size: 11 }
          }
        }
      }
    }
  });
}

function generateDashboardTrendData(daysBack) {
  const labels = [];
  const bioData = [];
  const nonBioData = [];
  const hazardData = [];

  // Current date is April 20, 2026
  const today = new Date(2026, 3, 20); // April 20, 2026

  // Generate data for each day going back
  for (let i = daysBack - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Format date as "Day, Month Date, Year" (e.g., "Mon, Apr 20, 2026")
    const dateLabel = date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    labels.push(dateLabel);

    // Generate realistic waste collection data (varies daily)
    const baseVariation = Math.sin(i * 0.5) * 20;
    const randomVariation = Math.random() * 30 - 15;
    
    bioData.push(Math.max(80, 130 + baseVariation + randomVariation));
    nonBioData.push(Math.max(50, 105 + baseVariation + randomVariation));
    hazardData.push(Math.max(90, 150 + baseVariation + randomVariation));
  }

  return { labels, bioData, nonBioData, hazardData };
}

function initDistributionChart() {
  const ctx = document.getElementById('distributionChart');
  if (!ctx) return;

  distributionChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Biodegradable', 'Non-Biodegradable', 'Hazardous'],
      datasets: [{
        data: [40, 36, 24],
        backgroundColor: [
          '#34d399',
          '#60a5fa',
          '#f87171'
        ],
        borderColor: '#0a0f1a',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: (event, activeElements) => {
        if (activeElements.length > 0) {
          const index = activeElements[0].index;
          const labels = ['Biodegradable', 'Non-Biodegradable', 'Hazardous'];
          const wasteDetails = {
            0: {
              title: 'Biodegradable Waste',
              icon: '🌱',
              percentage: '40%',
              amount: '640 kg today',
              items: ['Food scraps', 'Leaves', 'Plant matter', 'Paper napkins', 'Cardboard']
            },
            1: {
              title: 'Non-Biodegradable Waste',
              icon: '📦',
              percentage: '36%',
              amount: '576 kg today',
              items: ['Plastic bottles', 'Plastic bags', 'Packaging', 'Metal cans', 'Glass']
            },
            2: {
              title: 'Hazardous Waste',
              icon: '⚠️',
              percentage: '24%',
              amount: '384 kg today',
              items: ['Chemicals', 'Batteries', 'Medical waste', 'Oil', 'Paint', 'Contaminated materials', 'Electronics']
            }
          };
          
          showWasteDetailModal(wasteDetails[index]);
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#c7d2e0',
            font: { size: 12, weight: 600 },
            padding: 15,
            usePointStyle: true
          }
        }
      }
    }
  });
}

function showWasteDetailModal(wasteData) {
  // Create or update the detail modal
  let modal = document.getElementById('wasteDetailModal');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'wasteDetailModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content waste-detail-content">
        <div class="modal-header">
          <h2 id="detailTitle"></h2>
          <button class="modal-close" onclick="closeWasteDetail()">✕</button>
        </div>
        <div class="modal-body">
          <div class="detail-info">
            <p class="detail-percentage"></p>
            <p class="detail-amount"></p>
          </div>
          <div class="waste-items-list">
            <h4>Items Included:</h4>
            <ul id="wasteItemsList"></ul>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  // Populate the modal with data
  const titleEl = modal.querySelector('#detailTitle');
  const percentEl = modal.querySelector('.detail-percentage');
  const amountEl = modal.querySelector('.detail-amount');
  const itemsList = modal.querySelector('#wasteItemsList');
  
  titleEl.textContent = `${wasteData.icon} ${wasteData.title}`;
  percentEl.textContent = `📊 Percentage: ${wasteData.percentage}`;
  amountEl.textContent = `⚖️ Amount: ${wasteData.amount}`;
  
  itemsList.innerHTML = wasteData.items.map(item => `<li>• ${item}</li>`).join('');
  
  // Show the modal
  modal.style.display = 'flex';
  
  // Close modal on overlay click
  modal.addEventListener('click', function(e) {
    if (e.target === this) {
      closeWasteDetail();
    }
  });
}

function closeWasteDetail() {
  const modal = document.getElementById('wasteDetailModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function initPerformanceChart() {
  const ctx = document.getElementById('performanceChart');
  if (!ctx) return;

  performanceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Biodegradable', 'Non-Biodegradable', 'Hazardous'],
      datasets: [
        {
          label: 'Collection Rate %',
          data: [92, 88, 95],
          backgroundColor: 'rgba(96, 165, 250, 0.6)',
          borderColor: '#60a5fa',
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: 'Target %',
          data: [90, 90, 90],
          backgroundColor: 'rgba(52, 211, 153, 0.3)',
          borderColor: '#34d399',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#c7d2e0',
            font: { size: 12, weight: 600 },
            padding: 15,
            usePointStyle: true
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: 'rgba(30, 39, 71, 0.5)',
            drawBorder: false
          },
          ticks: {
            color: '#8b92b4',
            font: { size: 11 },
            callback: function(value) {
              return value + '%';
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#8b92b4',
            font: { size: 11 }
          }
        }
      }
    }
  });
}

function initHealthChart() {
  const ctx = document.getElementById('healthChart');
  if (!ctx) return;

  healthChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Sensor Health', 'Bin Condition', 'Collection Rate', 'System Uptime', 'Error Rate'],
      datasets: [
        {
          label: 'Biodegradable',
          data: [92, 88, 95, 99, 5],
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.15)',
          pointBackgroundColor: '#34d399',
          pointBorderColor: '#0a0f1a',
          pointBorderWidth: 2,
          tension: 0.4
        },
        {
          label: 'Non-Biodegradable',
          data: [88, 85, 92, 98, 8],
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.15)',
          pointBackgroundColor: '#60a5fa',
          pointBorderColor: '#0a0f1a',
          pointBorderWidth: 2,
          tension: 0.4
        },
        {
          label: 'Hazardous',
          data: [95, 92, 98, 99, 3],
          borderColor: '#fb923c',
          backgroundColor: 'rgba(251, 146, 60, 0.15)',
          pointBackgroundColor: '#fb923c',
          pointBorderColor: '#0a0f1a',
          pointBorderWidth: 2,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#c7d2e0',
            font: { size: 12, weight: 600 },
            padding: 15,
            usePointStyle: true
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: 'rgba(30, 39, 71, 0.5)'
          },
          ticks: {
            color: '#8b92b4',
            font: { size: 10 },
            backdropColor: 'transparent',
            callback: function(value) {
              return value + '%';
            }
          },
          pointLabels: {
            color: '#c7d2e0',
            font: { size: 11, weight: 600 }
          }
        }
      }
    }
  });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Mobile menu
  const sliders = document.querySelectorAll('.range-slider');
  sliders.forEach(slider => {
    slider.addEventListener('input', function() {
      updateSliderValue(this);
    });
  });

  // Alert dismiss buttons
  const dismissButtons = document.querySelectorAll('.btn-dismiss');
  dismissButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      this.closest('.alert-item').remove();
    });
  });

  // Password strength input
  const passwordInput = document.getElementById('password');
  if (passwordInput) {
    passwordInput.addEventListener('input', checkPasswordStrength);
  }

  // Role change handler
  const roleSelect = document.getElementById('role');
  if (roleSelect) {
    roleSelect.addEventListener('change', function() {
      handleRoleChange(this.value);
    });
  }

  // PIN/Password input constraints
  const passwordField = document.getElementById('password');
  const confirmField = document.getElementById('confirmPassword');
  if (passwordField) {
    passwordField.addEventListener('input', function() {
      const role = document.getElementById('role').value;
      if (role === 'Collector' || role === 'Supervisor') {
        // Allow only digits and limit to 4
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
      }
    });
  }
  if (confirmField) {
    confirmField.addEventListener('input', function() {
      const role = document.getElementById('role').value;
      if (role === 'Collector' || role === 'Supervisor') {
        // Allow only digits and limit to 4
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
      }
    });
  }

  // Edit Password input constraints
  const editPasswordField = document.getElementById('editPassword');
  const editConfirmField = document.getElementById('editConfirmPassword');
  if (editPasswordField) {
    editPasswordField.addEventListener('input', function() {
      const userRole = document.getElementById('editUserForm').dataset.userRole;
      if (userRole === 'Collector' || userRole === 'Supervisor') {
        // Allow only digits and limit to 4
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
      }
    });
  }
  if (editConfirmField) {
    editConfirmField.addEventListener('input', function() {
      const userRole = document.getElementById('editUserForm').dataset.userRole;
      if (userRole === 'Collector' || userRole === 'Supervisor') {
        // Allow only digits and limit to 4
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
      }
    });
  }

  // Close modal on overlay click
  const modal = document.getElementById('userRegistrationModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeUserRegistration();
      }
    });
  }

  // Close edit modal on overlay click
  const editModal = document.getElementById('editUserModal');
  if (editModal) {
    editModal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeEditUser();
      }
    });
  }

  // ===== SETTINGS EVENT LISTENERS =====
  // Theme buttons
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      setTheme(this.dataset.theme);
    });
  });

  // Color preset buttons
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const color = this.style.backgroundColor;
      // Extract hex color from rgb
      const rgbMatch = color.match(/\d+/g);
      if (rgbMatch && rgbMatch.length === 3) {
        const hex = '#' + rgbMatch.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
        setAccentColor(hex);
      }
    });
  });

  // Custom color picker
  const colorPicker = document.getElementById('customColorPicker');
  if (colorPicker) {
    colorPicker.addEventListener('input', function() {
      setAccentColor(this.value);
    });
  }

  // Font size slider
  const fontSizeSlider = document.getElementById('fontSizeSlider');
  if (fontSizeSlider) {
    fontSizeSlider.addEventListener('input', function() {
      setFontSize(this.value);
    });
  }

  // Animation speed dropdown
  const animationSpeed = document.getElementById('animationSpeed');
  if (animationSpeed) {
    animationSpeed.addEventListener('change', function() {
      setAnimationSpeed(this.value);
    });
  }

  // Sidebar behavior
  const sidebarBehavior = document.getElementById('sidebarBehavior');
  if (sidebarBehavior) {
    sidebarBehavior.addEventListener('change', function() {
      setSidebarBehavior(this.value);
    });
  }

  // Chart options
  const chartAnimToggle = document.getElementById('chartAnimation');
  if (chartAnimToggle) {
    chartAnimToggle.addEventListener('change', function() {
      toggleChartAnimation(this.checked);
    });
  }

  const chartLegendsToggle = document.getElementById('chartLegends');
  if (chartLegendsToggle) {
    chartLegendsToggle.addEventListener('change', function() {
      toggleChartLegends(this.checked);
    });
  }

  // Notification toggles
  const desktopNotifToggle = document.getElementById('desktopNotif');
  if (desktopNotifToggle) {
    desktopNotifToggle.addEventListener('change', function() {
      toggleNotifications(this.checked);
    });
  }

  const soundAlertsToggle = document.getElementById('soundAlerts');
  if (soundAlertsToggle) {
    soundAlertsToggle.addEventListener('change', function() {
      toggleSoundAlerts(this.checked);
    });
  }

  // Alert frequency
  const alertFrequency = document.getElementById('alertFrequency');
  if (alertFrequency) {
    alertFrequency.addEventListener('change', function() {
      setAlertFrequency(this.value);
    });
  }

  // Cards per row
  const cardsPerRow = document.getElementById('cardsPerRow');
  if (cardsPerRow) {
    cardsPerRow.addEventListener('change', function() {
      setCardsPerRow(this.value);
    });
  }

  // Activity items slider
  const activityItems = document.getElementById('activityItems');
  if (activityItems) {
    activityItems.addEventListener('input', function() {
      setActivityItems(this.value);
    });
  }

  // Auto refresh
  const autoRefresh = document.getElementById('autoRefresh');
  if (autoRefresh) {
    autoRefresh.addEventListener('change', function() {
      setAutoRefresh(this.value);
    });
  }

  // Data retention
  const dataRetention = document.getElementById('dataRetention');
  if (dataRetention) {
    dataRetention.addEventListener('change', function() {
      setDataRetention(this.value);
    });
  }

  // Time format
  const timeFormat = document.getElementById('timeFormat');
  if (timeFormat) {
    timeFormat.addEventListener('change', function() {
      setTimeFormat(this.value);
    });
  }

  // Settings action buttons
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', saveAllSettings);
  }

  const resetSettingsBtn = document.getElementById('resetSettingsBtn');
  if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener('click', resetSettings);
  }

  const exportSettingsBtn = document.getElementById('exportSettingsBtn');
  if (exportSettingsBtn) {
    exportSettingsBtn.addEventListener('click', exportSettings);
  }
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

function closeMobileMenu() {
  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
  // Create notification toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  
  const styles = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 9999;
    animation: slideInUp 0.3s ease;
    ${type === 'success' ? 'background: #34d399; color: #0a0f1a;' : ''}
    ${type === 'error' ? 'background: #ef4444; color: white;' : ''}
    ${type === 'info' ? 'background: #60a5fa; color: white;' : ''}
  `;
  
  toast.style.cssText = styles;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutDown 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== SECURITY LOGS FUNCTIONS =====
function loadSecurityLogs() {
  // Load and display security logs from localStorage
  const logs = JSON.parse(localStorage.getItem('binbot_security_logs') || '[]');
  
  // Update statistics
  const successfulPin = logs.filter(log => log.eventType === 'PIN_UNLOCK_SUCCESS').length;
  const failedPin = logs.filter(log => log.eventType === 'PIN_UNLOCK_FAILED').length;
  const sessionClose = logs.filter(log => log.eventType === 'SETTINGS_SESSION_CLOSED').length;
  const uniqueUsers = new Set(logs.filter(log => log.details.userId).map(log => log.details.userId)).size;
  
  document.getElementById('successfulPinCount').textContent = successfulPin;
  document.getElementById('failedPinCount').textContent = failedPin;
  document.getElementById('totalLogsCount').textContent = logs.length;
  document.getElementById('usersAccessedCount').textContent = uniqueUsers;
  
  // Display logs in table
  displaySecurityLogsTable(logs);
  
  // Display timeline
  displaySecurityTimeline(logs);
}

function displaySecurityLogsTable(logs) {
  const tbody = document.getElementById('logsTableBody');
  if (!tbody) return;
  
  if (logs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #8b92b4;">No security logs yet. PIN unlocks will appear here.</td></tr>';
    return;
  }
  
  // Sort logs by timestamp (newest first)
  const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  tbody.innerHTML = sortedLogs.map(log => {
    let userDetail = '';
    let eventDisplay = '';
    
    if (log.eventType === 'PIN_UNLOCK_SUCCESS') {
      userDetail = `${log.details.userName} (${log.details.userRole})`;
      eventDisplay = '🔓 PIN Unlock';
    } else if (log.eventType === 'PIN_UNLOCK_FAILED') {
      userDetail = `Invalid attempt`;
      eventDisplay = '❌ Failed PIN';
    } else if (log.eventType === 'SETTINGS_SESSION_CLOSED') {
      userDetail = 'Session closed';
      eventDisplay = '🔐 Session End';
    } else {
      userDetail = log.details.userName || 'System';
      eventDisplay = log.eventType.replace(/_/g, ' ');
    }
    
    return `
      <tr>
        <td><small>${log.datetime}</small></td>
        <td>${eventDisplay}</td>
        <td>${userDetail}</td>
        <td>${log.status}</td>
        <td><span class="severity-badge ${log.severity}">${log.severity.toUpperCase()}</span></td>
        <td>${log.source}</td>
      </tr>
    `;
  }).join('');
}

function displaySecurityTimeline(logs) {
  const timeline = document.getElementById('securityTimeline');
  if (!timeline || logs.length === 0) return;
  
  const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
  
  timeline.innerHTML = sortedLogs.map((log, index) => {
    let icon = '📋';
    let title = log.eventType.replace(/_/g, ' ');
    let description = '';
    
    if (log.eventType === 'PIN_UNLOCK_SUCCESS') {
      icon = '✅';
      title = 'PIN Unlock Successful';
      description = `${log.details.userName} (${log.details.userRole}) unlocked settings`;
    } else if (log.eventType === 'PIN_UNLOCK_FAILED') {
      icon = '❌';
      title = 'Failed PIN Attempt';
      description = 'Invalid PIN entered';
    } else if (log.eventType === 'SETTINGS_SESSION_CLOSED') {
      icon = '🔐';
      title = 'Settings Session Closed';
      description = 'User closed the settings panel';
    }
    
    return `
      <div class="timeline-item ${index === 0 ? 'active' : ''}">
        <div class="timeline-marker">${icon}</div>
        <div class="timeline-content">
          <h4>${title}</h4>
          <p>${description}</p>
          <small>${log.datetime}</small>
        </div>
      </div>
    `;
  }).join('');
}

function filterSecurityLogs(filter) {
  const allLogs = JSON.parse(localStorage.getItem('binbot_security_logs') || '[]');
  let filteredLogs = allLogs;
  
  if (filter !== 'all') {
    if (filter === 'PIN_UNLOCK_SUCCESS') {
      filteredLogs = allLogs.filter(log => log.eventType === 'PIN_UNLOCK_SUCCESS');
    } else if (filter === 'PIN_UNLOCK_FAILED') {
      filteredLogs = allLogs.filter(log => log.eventType === 'PIN_UNLOCK_FAILED');
    } else if (filter === 'SESSION') {
      filteredLogs = allLogs.filter(log => log.eventType.includes('SESSION'));
    }
  }
  
  // Update filter buttons active state
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  // Display filtered logs
  displaySecurityLogsTable(filteredLogs);
}

function searchSecurityLogs(searchTerm) {
  const allLogs = JSON.parse(localStorage.getItem('binbot_security_logs') || '[]');
  
  if (!searchTerm.trim()) {
    displaySecurityLogsTable(allLogs);
    return;
  }
  
  const filtered = allLogs.filter(log => 
    log.details.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.datetime.includes(searchTerm)
  );
  
  displaySecurityLogsTable(filtered);
}

function clearAllLogs() {
  if (confirm('⚠️ Are you sure you want to delete all security logs? This cannot be undone.')) {
    localStorage.setItem('binbot_security_logs', '[]');
    loadSecurityLogs();
    showNotification('🗑️ All security logs have been cleared', 'info');
  }
}

function exportSecurityLogs() {
  const logs = JSON.parse(localStorage.getItem('binbot_security_logs') || '[]');
  
  if (logs.length === 0) {
    showNotification('❌ No logs to export', 'warning');
    return;
  }
  
  // Create CSV
  let csv = 'Timestamp,Event Type,User,Status,Severity,Source\n';
  logs.forEach(log => {
    const user = log.details.userName || log.details.reason || 'System';
    csv += `"${log.datetime}","${log.eventType}","${user}","${log.status}","${log.severity}","${log.source}"\n`;
  });
  
  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `security-logs-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  
  showNotification('📥 Security logs exported successfully', 'success');
}

// ===== LOGOUT =====
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    // Clear all session data
    localStorage.removeItem('binbot_session');
    localStorage.removeItem('binbot_user');
    localStorage.removeItem('binbot_remember_me');
    localStorage.removeItem('binbot_settings');
    localStorage.removeItem('binbot_custom_settings');
    
    // Clear form inputs
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.reset();
    
    // Redirect to login page
    setTimeout(() => {
      window.location.href = 'login-enhanced.php';
    }, 200);
  }
}

// ===== USER REGISTRATION MODAL =====
function openUserRegistration() {
  const modal = document.getElementById('userRegistrationModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeUserRegistration() {
  const modal = document.getElementById('userRegistrationModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    document.getElementById('userRegistrationForm').reset();
    clearPasswordStrength();
    resetRoleDisplay();
  }
}

function resetRoleDisplay() {
  // Reset to password mode
  document.getElementById('passwordLabel').textContent = 'Password *';
  document.getElementById('confirmPasswordLabel').textContent = 'Confirm Password *';
  document.getElementById('roleInfo').textContent = '';
  
  const passwordField = document.getElementById('password');
  const confirmField = document.getElementById('confirmPassword');
  
  if (passwordField) passwordField.placeholder = '';
  if (confirmField) confirmField.placeholder = '';
}

function handleRoleChange(role) {
  const passwordLabel = document.getElementById('passwordLabel');
  const confirmPasswordLabel = document.getElementById('confirmPasswordLabel');
  const roleInfo = document.getElementById('roleInfo');
  const passwordField = document.getElementById('password');
  const confirmField = document.getElementById('confirmPassword');
  
  if (role === 'Collector' || role === 'Supervisor') {
    // Switch to PIN mode
    passwordLabel.textContent = 'PIN (4 digits) *';
    confirmPasswordLabel.textContent = 'Confirm PIN (4 digits) *';
    roleInfo.textContent = '🔐 Field access uses 4-digit PIN';
    roleInfo.style.color = '#34d399';
    
    if (passwordField) {
      passwordField.placeholder = '0000';
      passwordField.maxLength = '4';
    }
    if (confirmField) {
      confirmField.placeholder = '0000';
      confirmField.maxLength = '4';
    }
    
    // Clear password strength indicator
    clearPasswordStrength();
  } else {
    // Switch to password mode
    passwordLabel.textContent = 'Password *';
    confirmPasswordLabel.textContent = 'Confirm Password *';
    roleInfo.textContent = '';
    
    if (passwordField) {
      passwordField.placeholder = '';
      passwordField.maxLength = '999';
    }
    if (confirmField) {
      confirmField.placeholder = '';
      confirmField.maxLength = '999';
    }
  }
}

function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  if (field.type === 'password') {
    field.type = 'text';
  } else {
    field.type = 'password';
  }
}

function checkPasswordStrength() {
  const password = document.getElementById('password').value;
  const strengthIndicator = document.getElementById('passwordStrength');

  if (password.length === 0) {
    clearPasswordStrength();
    return;
  }

  let strength = 0;
  
  // Check length
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  
  // Check for uppercase
  if (/[A-Z]/.test(password)) strength++;
  
  // Check for lowercase
  if (/[a-z]/.test(password)) strength++;
  
  // Check for numbers
  if (/\d/.test(password)) strength++;
  
  // Check for special characters
  if (/[!@#$%^&*]/.test(password)) strength++;

  let text = '';
  let className = '';

  if (strength <= 2) {
    text = '❌ Weak password';
    className = 'weak';
  } else if (strength <= 4) {
    text = '⚠️ Medium password';
    className = 'medium';
  } else {
    text = '✅ Strong password';
    className = 'strong';
  }

  strengthIndicator.textContent = text;
  strengthIndicator.className = 'password-strength ' + className;
}

function clearPasswordStrength() {
  const strengthIndicator = document.getElementById('passwordStrength');
  if (strengthIndicator) {
    strengthIndicator.textContent = '';
    strengthIndicator.className = 'password-strength';
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  return password.length >= 8;
}

function handleUserRegistration(event) {
  event.preventDefault();

  // Get form values
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const role = document.getElementById('role').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validation
  if (!firstName || !lastName) {
    showNotification('❌ Please enter first and last name', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showNotification('❌ Please enter a valid email address', 'error');
    return;
  }

  if (!role) {
    showNotification('❌ Please select a user role', 'error');
    return;
  }

  // PIN vs Password Validation
  const isPinRole = role === 'Collector' || role === 'Supervisor';
  
  if (isPinRole) {
    // PIN validation: must be exactly 4 digits
    if (password.length !== 4 || !/^\d{4}$/.test(password)) {
      showNotification('❌ PIN must be exactly 4 digits', 'error');
      return;
    }
  } else {
    // Password validation: minimum 8 characters
    if (!isValidPassword(password)) {
      showNotification('❌ Password must be at least 8 characters long', 'error');
      return;
    }
  }

  if (password !== confirmPassword) {
    const fieldName = isPinRole ? 'PINs' : 'Passwords';
    showNotification(`❌ ${fieldName} do not match`, 'error');
    return;
  }

  // Check if email already exists
  const users = JSON.parse(localStorage.getItem('binbot_users') || '[]');
  if (users.some(u => u.email === email)) {
    showNotification('❌ Email already registered', 'error');
    return;
  }

  // Create new user
  const newUser = {
    id: 'USR' + String(Math.floor(Math.random() * 999999)).padStart(3, '0'),
    firstName: firstName,
    lastName: lastName,
    name: firstName + ' ' + lastName,
    email: email,
    password: password,
    role: role,
    department: role === 'Collector' || role === 'Supervisor' ? 'Field Operations' : 'Management',
    status: 'Active',
    joinDate: new Date().toISOString().split('T')[0],
    avatar: (firstName.charAt(0) + lastName.charAt(0)).toUpperCase(),
    accessType: isPinRole ? 'PIN' : 'Password'
  };

  // Add user to localStorage
  users.push(newUser);
  localStorage.setItem('binbot_users', JSON.stringify(users));
  
  // Also store in binbot_accounts for login compatibility
  const accounts = JSON.parse(localStorage.getItem('binbot_accounts') || '[]');
  accounts.push(newUser);
  localStorage.setItem('binbot_accounts', JSON.stringify(accounts));

  // Show success message
  const roleDisplay = role === 'Collector' || role === 'Supervisor' ? `with 4-digit PIN (${password})` : 'successfully';
  showNotification(`✅ User registered ${roleDisplay}!`, 'success');

  // Close modal and reload users
  closeUserRegistration();
  loadUsers();
}

// ===== DATA PERSISTENCE =====
function saveSettings() {
  const settings = {
    bioThreshold: document.querySelector('[data-setting="bioThreshold"]')?.value || 80,
    collectionSchedule: 'automatic',
    alertNotifications: true,
    maintenanceAlert: true
  };
  localStorage.setItem('binbot_settings', JSON.stringify(settings));
  showNotification('Settings saved successfully', 'success');
}

// ===== UTILITY FUNCTIONS =====
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// ===== REPORTS PAGE INITIALIZATION =====
function initializeReportsPage() {
  // Initialize calendar and report data when reports page is shown
  generateCalendar();
  updateMonthlySummaryDisplay();
  generateWeekStatCards();
  selectWeek(1); // Default to Week 1
  
  // Initialize reports trend chart
  setTimeout(() => {
    initReportsTrendChart();
  }, 100);
}

function initReportsTrendChart() {
  // Initialize with last 7 days by default
  updateReportsTrendChart('7');
}

function updateReportsTrendChart(days) {
  const ctx = document.getElementById('reportsTrendChart');
  if (!ctx) return;

  if (reportsTrendChart) {
    reportsTrendChart.destroy();
  }

  // Generate dates and data based on selected period
  const { labels, bioData, nonBioData, hazardData } = generateTrendData(parseInt(days));

  reportsTrendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Biodegradable',
          data: bioData,
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#34d399',
          pointBorderColor: '#0a0f1a',
          pointBorderWidth: 2
        },
        {
          label: 'Non-Biodegradable',
          data: nonBioData,
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96, 165, 250, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#60a5fa',
          pointBorderColor: '#0a0f1a',
          pointBorderWidth: 2
        },
        {
          label: 'Hazardous',
          data: hazardData,
          borderColor: '#fb923c',
          backgroundColor: 'rgba(251, 146, 60, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#fb923c',
          pointBorderColor: '#0a0f1a',
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#c7d2e0',
            font: { size: 12, weight: 600 },
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        filler: {
          propagate: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(30, 39, 71, 0.5)',
            drawBorder: false
          },
          ticks: {
            color: '#8b92b4',
            font: { size: 11 }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#8b92b4',
            font: { size: 11 }
          }
        }
      }
    }
  });
}

function generateTrendData(daysBack) {
  const labels = [];
  const bioData = [];
  const nonBioData = [];
  const hazardData = [];

  // Current date is April 20, 2026
  const today = new Date(2026, 3, 20); // April 20, 2026

  // Generate data for each day going back
  for (let i = daysBack - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Format date as "Apr 20" for 7 days, "Apr 20, 2026" for 30+ days
    let dateLabel;
    if (daysBack <= 7) {
      dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (daysBack <= 30) {
      dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
    } else {
      // For year view, show month and day
      dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    labels.push(dateLabel);

    // Generate realistic waste collection data (varies daily)
    const baseVariation = Math.sin(i * 0.5) * 20;
    const randomVariation = Math.random() * 30 - 15;
    
    bioData.push(Math.max(80, 130 + baseVariation + randomVariation));
    nonBioData.push(Math.max(50, 105 + baseVariation + randomVariation));
    hazardData.push(Math.max(90, 150 + baseVariation + randomVariation));
  }

  return { labels, bioData, nonBioData, hazardData };
}

function initializeSensorsPage() {
  // Initialize sensors page with detection sensors, collections activity, and performance data
  populateDetectionSensors();
  populateCollectionsActivity();
  populatePerformanceChart();
}

// ===== DETECTION SENSORS & COLLECTIONS FUNCTIONS =====
const detectionSensorsData = [
  { id: 1, type: 'Camera', detection: 'Plastic (Non-Biodegradable)', time: '10:30 AM', accuracy: '98%', status: 'high', zone: 'Zone A' },
  { id: 2, type: 'Camera', detection: 'Paper (Biodegradable)', time: '10:28 AM', accuracy: '97%', status: 'high', zone: 'Zone A' },
  { id: 3, type: 'Ultrasonic', detection: 'Biodegradable - 50% (Half Capacity)', time: '10:25 AM', accuracy: '96%', status: 'high', zone: 'Zone B', capacityPercent: 50 },
  { id: 4, type: 'Camera', detection: 'Electronics (Hazardous)', time: '10:20 AM', accuracy: '94%', status: 'high', zone: 'Zone C' },
  { id: 5, type: 'Camera', detection: 'Glass (Non-Biodegradable)', time: '10:18 AM', accuracy: '93%', status: 'high', zone: 'Zone C' },
  { id: 6, type: 'Ultrasonic', detection: 'Non-Biodegradable - 85% (Full Capacity)', time: '10:15 AM', accuracy: '91%', status: 'medium', zone: 'Zone A', capacityPercent: 85 },
  { id: 7, type: 'Camera', detection: 'Fabric (Biodegradable)', time: '10:10 AM', accuracy: '89%', status: 'medium', zone: 'Zone D' },
  { id: 8, type: 'Ultrasonic', detection: 'Hazardous - 15% (Empty Capacity)', time: '10:05 AM', accuracy: '95%', status: 'high', zone: 'Zone B', capacityPercent: 15 },
  { id: 9, type: 'Camera', detection: 'Plastic Bags (Non-Biodegradable)', time: '9:58 AM', accuracy: '92%', status: 'high', zone: 'Zone E' },
  { id: 10, type: 'Ultrasonic', detection: 'Biodegradable - 95% (Full Capacity)', time: '9:50 AM', accuracy: '97%', status: 'high', zone: 'Zone A', capacityPercent: 95 },
  { id: 11, type: 'Camera', detection: 'Paint Cans (Hazardous)', time: '9:42 AM', accuracy: '88%', status: 'medium', zone: 'Zone C' },
  { id: 12, type: 'Ultrasonic', detection: 'Non-Biodegradable - 60% (Half Capacity)', time: '9:35 AM', accuracy: '93%', status: 'high', zone: 'Zone D', capacityPercent: 60 }
];

const collectionsActivityData = [
  { id: 1, wasteType: 'Biodegradable', capacity: 100, time: '10:28 AM', duration: '2.3 min' },
  { id: 2, wasteType: 'Non-Biodegradable', capacity: 100, time: '10:23 AM', duration: '3.1 min' },
  { id: 3, wasteType: 'Hazardous', capacity: 100, time: '10:18 AM', duration: '1.8 min' },
  { id: 4, wasteType: 'Biodegradable', capacity: 50, time: '10:12 AM', duration: '2.5 min' },
  { id: 5, wasteType: 'Non-Biodegradable', capacity: 75, time: '10:08 AM', duration: '4.2 min' },
  { id: 6, wasteType: 'Hazardous', capacity: 25, time: '9:55 AM', duration: '2.1 min' },
  { id: 7, wasteType: 'Biodegradable', capacity: 0, time: '9:48 AM', duration: '1.9 min' },
  { id: 8, wasteType: 'Non-Biodegradable', capacity: 100, time: '9:40 AM', duration: '2.7 min' },
  { id: 9, wasteType: 'Hazardous', capacity: 50, time: '9:32 AM', duration: '1.6 min' },
  { id: 10, wasteType: 'Biodegradable', capacity: 100, time: '9:24 AM', duration: '0 min' }
];

let filteredSensors = [...detectionSensorsData];
let filteredCollections = [...collectionsActivityData];

function populateDetectionSensors() {
  const sensorList = document.getElementById('sensorList');
  if (!sensorList) return;

  filteredSensors = detectionSensorsData;
  
  sensorList.innerHTML = filteredSensors.map(sensor => `
    <div class="sensor-item">
      <div class="sensor-info">
        <span class="sensor-type">${sensor.type}</span>
        <span class="detection-type">${sensor.detection}</span>
        <span class="detection-time">${sensor.time}</span>
        <span class="accuracy-badge ${sensor.status}">${sensor.accuracy} Accuracy</span>
      </div>
    </div>
  `).join('');

  updateDetectionStats();
}

function populateCollectionsActivity() {
  const collectionList = document.getElementById('collectionList');
  if (!collectionList) return;

  filteredCollections = collectionsActivityData;
  
  collectionList.innerHTML = filteredCollections.map(collection => {
    const capacityLabel = collection.capacity === 100 ? 'Full Capacity' : collection.capacity === 0 ? 'Empty Capacity' : 'Half Capacity';
    const statusText = collection.capacity === 100 
      ? `${collection.wasteType} Waste needs to be collected`
      : `${collection.wasteType} Waste Collected`;
    const statusType = collection.capacity === 100 ? 'medium' : 'high';
    
    return `
      <div class="collection-item">
        <div class="sensor-info">
          <span class="sensor-type">${collection.wasteType}</span>
          <span class="detection-type">${capacityLabel}</span>
          <span class="detection-time">${collection.time}</span>
          <span class="accuracy-badge ${statusType}">${statusText}</span>
        </div>
      </div>
    `;
  }).join('');

  updateCollectionStats();
}

function filterSensors() {
  const filterValue = document.getElementById('sensorTypeFilter').value;
  const sensorList = document.getElementById('sensorList');
  
  if (filterValue === 'all') {
    filteredSensors = [...detectionSensorsData];
  } else {
    filteredSensors = detectionSensorsData.filter(s => s.type.toLowerCase().includes(filterValue.toLowerCase()));
  }

  sensorList.innerHTML = filteredSensors.map(sensor => `
    <div class="sensor-item">
      <div class="sensor-info">
        <span class="sensor-type">${sensor.type}</span>
        <span class="detection-type">${sensor.detection}</span>
        <span class="detection-time">${sensor.time}</span>
        <span class="accuracy-badge ${sensor.status}">${sensor.accuracy} Accuracy</span>
      </div>
    </div>
  `).join('');
}

function filterCollections() {
  const filterValue = document.getElementById('collectionStatusFilter').value;
  const collectionList = document.getElementById('collectionList');
  
  if (filterValue === 'all') {
    filteredCollections = [...collectionsActivityData];
  } else if (filterValue === 'completed') {
    filteredCollections = collectionsActivityData.filter(c => c.capacity !== 100);
  } else if (filterValue === 'in-progress') {
    filteredCollections = collectionsActivityData.filter(c => c.capacity === 100);
  } else if (filterValue === 'pending') {
    filteredCollections = collectionsActivityData.filter(c => c.capacity === 0);
  }

  collectionList.innerHTML = filteredCollections.map(collection => {
    const capacityLabel = collection.capacity === 100 ? 'Full Capacity' : collection.capacity === 0 ? 'Empty Capacity' : 'Half Capacity';
    const statusText = collection.capacity === 100 
      ? `${collection.wasteType} Waste needs to be collected`
      : `${collection.wasteType} Waste Collected`;
    const statusType = collection.capacity === 100 ? 'medium' : 'high';
    
    return `
      <div class="collection-item">
        <div class="sensor-info">
          <span class="sensor-type">${collection.wasteType}</span>
          <span class="detection-type">${capacityLabel}</span>
          <span class="detection-time">${collection.time}</span>
          <span class="accuracy-badge ${statusType}">${statusText}</span>
        </div>
      </div>
    `;
  }).join('');
}

function updateDetectionStats() {
  // Calculate and update detection statistics
  const activeSensors = detectionSensorsData.length;
  const operationalSensors = detectionSensorsData.filter(s => s.status === 'high').length + 2; // 2 more for operational
  const calibratingSensors = 1;
  const offlineSensors = 0;
  
  // Calculate average accuracy
  const accuracyValues = detectionSensorsData.map(s => parseInt(s.accuracy));
  const avgAccuracy = (accuracyValues.reduce((a, b) => a + b, 0) / accuracyValues.length).toFixed(1);
  
  // Update UI
  document.getElementById('activeSensors').textContent = activeSensors;
  document.getElementById('avgAccuracy').textContent = avgAccuracy + '%';
  document.getElementById('operationalSensors').textContent = operationalSensors;
  document.getElementById('calibratingSensors').textContent = calibratingSensors;
  document.getElementById('offlineSensors').textContent = offlineSensors;
}

function updateCollectionStats() {
  // Calculate collection statistics based on capacity
  const completedCollections = collectionsActivityData.filter(c => c.capacity !== 100).length;
  const inProgressCollections = collectionsActivityData.filter(c => c.capacity === 100).length;
  const pendingCollections = collectionsActivityData.filter(c => c.capacity === 0).length;
  
  // Update UI
  document.getElementById('collectionsToday').textContent = collectionsActivityData.length;
  document.getElementById('completedCollections').textContent = completedCollections;
  document.getElementById('inProgressCollections').textContent = inProgressCollections;
  document.getElementById('pendingCollections').textContent = pendingCollections;
}

function populatePerformanceChart() {
  const performanceGrid = document.getElementById('performanceGrid');
  if (!performanceGrid) return;

  const sensorTypes = [
    { name: 'Camera', accuracy: 92, count: 6 },
    { name: 'Ultrasonic', accuracy: 93, count: 6 }
  ];

  performanceGrid.innerHTML = sensorTypes.map(sensor => `
    <div class="performance-item">
      <div class="performance-name">${sensor.name}</div>
      <div class="performance-bar">
        <div class="performance-fill" style="width: ${sensor.accuracy}%">${sensor.accuracy}%</div>
      </div>
      <div class="performance-details">
        <span class="perf-label">Active Units:</span>
        <span class="perf-value">${sensor.count}</span>
      </div>
    </div>
  `).join('');
}

// ===== REPORTS FUNCTIONS =====
function downloadReport(format) {
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  
  const reportData = {
    month: monthYear,
    generatedDate: currentDate.toLocaleString(),
    summary: {
      totalWaste: '18,480 kg',
      biodegradable: '7,392 kg (40%)',
      nonBiodegradable: '6,653 kg (36%)',
      hazardous: '4,435 kg (24%)',
      collectionsCompleted: 247,
      avgResponseTime: '12.3 min',
      successRate: '98.4%',
      uptime: '99.7%'
    },
    weekly: {
      week1: 4060,
      week2: 4450,
      week3: 4872,
      week4: 5188
    },
    performance: {
      routes: 247,
      activeUnits: '18/20',
      efficiency: '94.6%',
      costPerCollection: '$2.35'
    }
  };

  if (format === 'csv') {
    downloadAsCSV(reportData, monthYear);
  } else if (format === 'json') {
    downloadAsJSON(reportData, monthYear);
  } else {
    showNotification('📥 Report generation started...', 'info');
    // In a real application, this would integrate with a PDF library
    setTimeout(() => {
      showNotification('📥 Report downloaded successfully!', 'success');
    }, 1000);
  }
}

function downloadAsCSV(data, monthYear) {
  let csv = 'Binbot Monthly Report\n';
  csv += `Month: ${data.month}\n`;
  csv += `Generated: ${data.generatedDate}\n\n`;
  
  csv += 'MONTHLY SUMMARY\n';
  csv += `Total Waste,${data.summary.totalWaste}\n`;
  csv += `Biodegradable,${data.summary.biodegradable}\n`;
  csv += `Non-Biodegradable,${data.summary.nonBiodegradable}\n`;
  csv += `Hazardous,${data.summary.hazardous}\n`;
  csv += `Collections Completed,${data.summary.collectionsCompleted}\n`;
  csv += `Average Response Time,${data.summary.avgResponseTime}\n`;
  csv += `Success Rate,${data.summary.successRate}\n`;
  csv += `System Uptime,${data.summary.uptime}\n\n`;
  
  csv += 'WEEKLY BREAKDOWN\n';
  csv += 'Week,Waste (kg)\n';
  csv += `Week 1,${data.weekly.week1}\n`;
  csv += `Week 2,${data.weekly.week2}\n`;
  csv += `Week 3,${data.weekly.week3}\n`;
  csv += `Week 4,${data.weekly.week4}\n\n`;
  
  csv += 'PERFORMANCE METRICS\n';
  csv += `Total Routes,${data.performance.routes}\n`;
  csv += `Active Units,${data.performance.activeUnits}\n`;
  csv += `Efficiency,${data.performance.efficiency}\n`;
  csv += `Cost Per Collection,${data.performance.costPerCollection}\n`;
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Binbot-Report-${monthYear.replace(' ', '-')}.csv`;
  link.click();
  
  showNotification('✅ Report downloaded as CSV!', 'success');
}

function downloadAsJSON(data, monthYear) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Binbot-Report-${monthYear.replace(' ', '-')}.json`;
  link.click();
  
  showNotification('✅ Report downloaded as JSON!', 'success');
}

function printReport() {
  window.print();
  showNotification('🖨️ Print dialog opened. Check your printer settings.', 'info');
}

// ===== CALENDAR MONTH NAVIGATION =====
let currentAdminMonthIndex = 3; // April (index 3)
const adminMonthSlides = document.querySelectorAll('#adminCalendarSlider .calendar-slide');
const adminMonthTitle = document.getElementById('adminCurrentMonth');

function changeAdminMonth(dir) {
  if (adminMonthSlides.length === 0) return;
  
  // Remove active class from current slide
  adminMonthSlides[currentAdminMonthIndex].classList.remove('active');
  
  // Calculate next month index (ensures proper wrapping and sequential order)
  currentAdminMonthIndex = (currentAdminMonthIndex + dir + adminMonthSlides.length) % adminMonthSlides.length;
  
  // Add active class to new slide and update title
  adminMonthSlides[currentAdminMonthIndex].classList.add('active');
  adminMonthTitle.textContent = adminMonthSlides[currentAdminMonthIndex].dataset.month;
}

// ===== MONTHLY SUMMARY NAVIGATION =====
let currentSummaryMonthIndex = 3; // April (index 3)
let summarySlides = document.querySelectorAll('#adminSummarySlider .summary-slide');
const summaryMonthTitle = document.getElementById('monthlySummaryMonth');

function changeMonthSummary(dir) {
  // Re-query in case DOM changed
  summarySlides = document.querySelectorAll('#adminSummarySlider .summary-slide');
  if (summarySlides.length === 0) return;
  
  // Remove active class from current slide
  summarySlides[currentSummaryMonthIndex].classList.remove('active');
  
  // Calculate next month index (ensures proper wrapping and sequential order)
  currentSummaryMonthIndex = (currentSummaryMonthIndex + dir + summarySlides.length) % summarySlides.length;
  
  // Add active class to new slide and update title
  summarySlides[currentSummaryMonthIndex].classList.add('active');
  summaryMonthTitle.textContent = summarySlides[currentSummaryMonthIndex].dataset.month;
}

// ===== UPDATE MONTHLY SUMMARY DISPLAY =====
function updateMonthlySummaryDisplay() {
  summarySlides = document.querySelectorAll('#adminSummarySlider .summary-slide');
  if (summarySlides.length === 0) return;
  
  // Remove active from all slides
  summarySlides.forEach(slide => slide.classList.remove('active'));
  
  // Set current month to active (based on currentCalendarDate)
  const monthIndex = currentCalendarDate.getMonth();
  if (summarySlides[monthIndex]) {
    summarySlides[monthIndex].classList.add('active');
    currentSummaryMonthIndex = monthIndex;
    if (summaryMonthTitle) {
      summaryMonthTitle.textContent = summarySlides[monthIndex].dataset.month;
    }
  }
}

// ===== INTERACTIVE CALENDAR GRID =====

let currentCalendarDate = new Date(2026, 3, 9); // April 9, 2026

const dailyWasteData = {
  '2026-4-1': { total: 100, bio: 40, nonbio: 36, hazard: 24, collections: 8, response: 12.2, success: 98 },
  '2026-4-2': { total: 100, bio: 40, nonbio: 36, hazard: 24, collections: 8, response: 12.4, success: 98 },
  '2026-4-3': { total: 100, bio: 40, nonbio: 36, hazard: 24, collections: 9, response: 12.1, success: 99 },
  '2026-4-4': { total: 100, bio: 40, nonbio: 36, hazard: 24, collections: 7, response: 13.1, success: 97 },
  '2026-4-5': { total: 100, bio: 40, nonbio: 36, hazard: 24, collections: 9, response: 11.8, success: 99 },
  '2026-4-6': { total: 100, bio: 40, nonbio: 36, hazard: 24, collections: 8, response: 12.8, success: 98 },
  '2026-4-7': { total: 100, bio: 40, nonbio: 36, hazard: 24, collections: 7, response: 13.5, success: 96 },
  '2026-4-8': { total: 100, bio: 40, nonbio: 36, hazard: 24, collections: 9, response: 11.9, success: 99 },
  '2026-4-9': { total: 100, bio: 40, nonbio: 36, hazard: 24, collections: 8, response: 12.5, success: 98 }
};

function generateCalendar() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  
  // Update calendar header
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById('calendarMonthYear').textContent = monthNames[month] + ' ' + year;
  
  // Update monthly summary display
  updateMonthlySummaryDisplay();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  const calendarDates = document.getElementById('calendarDates');
  calendarDates.innerHTML = '';
  
  // Previous month's dates
  for (let i = firstDay - 1; i >= 0; i--) {
    const dateNum = daysInPrevMonth - i;
    const dateElement = document.createElement('div');
    dateElement.className = 'calendar-date other-month';
    dateElement.innerHTML = `
      <span class="calendar-date-number">${dateNum}</span>
      <span class="calendar-date-waste">-</span>
    `;
    calendarDates.appendChild(dateElement);
  }
  
  // Current month's dates
  const today = new Date(2026, 3, 9); // Today is April 9, 2026
  for (let day = 1; day <= daysInMonth; day++) {
    const dateElement = document.createElement('div');
    const dateKey = `${year}-${month + 1}-${day}`;
    const data = dailyWasteData[dateKey];
    
    let className = 'calendar-date';
    if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      className += ' today';
    }
    
    // Add waste level indicator
    if (data) {
      if (data.total > 680) className += ' high-waste';
      else if (data.total > 600) className += ' medium-waste';
      else className += ' low-waste';
    }
    
    dateElement.className = className;
    dateElement.dataset.dateKey = dateKey;
    dateElement.onclick = () => selectCalendarDate(dateKey, data);
    
    const wasteLabel = data ? `${data.total}%` : '-';
    dateElement.innerHTML = `
      <span class="calendar-date-number">${day}</span>
      <span class="calendar-date-waste">${wasteLabel}</span>
    `;
    
    // Mark April 9 as selected by default
    if (day === 9 && month === 3) {
      dateElement.classList.add('selected');
    }
    
    calendarDates.appendChild(dateElement);
  }
  
  // Next month's dates
  const totalCells = calendarDates.children.length + firstDay;
  const remainingCells = 42 - totalCells; // 6 rows × 7 days
  for (let day = 1; day <= remainingCells; day++) {
    const dateElement = document.createElement('div');
    dateElement.className = 'calendar-date other-month';
    dateElement.innerHTML = `
      <span class="calendar-date-number">${day}</span>
      <span class="calendar-date-waste">-</span>
    `;
    calendarDates.appendChild(dateElement);
  }
}

function selectCalendarDate(dateKey, data) {
  // Remove selected from all dates
  document.querySelectorAll('.calendar-date').forEach(el => {
    el.classList.remove('selected');
  });
  
  // Add selected to clicked date
  event.target.closest('.calendar-date').classList.add('selected');
  
  // Calculate which week this date belongs to and display it
  if (data) {
    const [year, month, day] = dateKey.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const firstDay = new Date(year, month - 1, 1);
    
    // Calculate week number within the month
    const weekNumber = Math.ceil((date.getDate() + firstDay.getDay()) / 7);
    selectWeek(weekNumber);
  }
}

function getWeekNumber(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const firstDay = new Date(year, month - 1, 1);
  const dayOfWeek = date.getDay();
  
  // Calculate week number within the month
  const weekNumber = Math.ceil((date.getDate() + firstDay.getDay()) / 7);
  return weekNumber;
}

function getWeekDateRange(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();
  
  // Get start of week (Sunday)
  const startDate = new Date(date);
  startDate.setDate(date.getDate() - dayOfWeek);
  
  // Get end of week (Saturday)
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  const startStr = monthNames[startDate.getMonth()] + ' ' + startDate.getDate();
  const endStr = monthNames[endDate.getMonth()] + ' ' + endDate.getDate();
  
  return { start: startStr, end: endStr, startDate: startDate, endDate: endDate };
}

function getWeekData(startDate, endDate, currentMonth) {
  let totalBio = 0, totalNonBio = 0, totalHazard = 0, dayCount = 0;
  
  // Iterate through each day in the week
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    
    // Only count dates within the current month
    if (d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear()) {
      if (dailyWasteData[dateKey]) {
        totalBio += dailyWasteData[dateKey].bio;
        totalNonBio += dailyWasteData[dateKey].nonbio;
        totalHazard += dailyWasteData[dateKey].hazard;
        dayCount++;
      }
    }
  }
  
  // Calculate averages
  const avgBio = dayCount > 0 ? Math.round(totalBio / dayCount) : 0;
  const avgNonBio = dayCount > 0 ? Math.round(totalNonBio / dayCount) : 0;
  const avgHazard = dayCount > 0 ? Math.round(totalHazard / dayCount) : 0;
  
  return { bio: avgBio, nonbio: avgNonBio, hazard: avgHazard, total: 100 };
}

function updateWeeklySummary(dateKey, data) {
  const dateRange = getWeekDateRange(dateKey);
  const weekData = getWeekData(dateRange.startDate, dateRange.endDate, currentCalendarDate);
  
  document.getElementById('periodSummaryTitle').textContent = 
    '📊 Weekly Summary - ' + dateRange.start + ' - ' + dateRange.end + ', ' + currentCalendarDate.getFullYear();
  
  document.getElementById('periodTotalWaste').textContent = '100%';
  document.getElementById('periodBiodegradable').textContent = weekData.bio + '%';
  document.getElementById('periodNonBiodegradable').textContent = weekData.nonbio + '%';
  document.getElementById('periodHazardous').textContent = weekData.hazard + '%';
}

function updateDetectionAndCollectionsInsight() {
  // Calculate detection and collection metrics from daily data
  const allData = getAllWeeksTotals();
  
  // Calculate total collections and metrics
  let totalCollections = 0;
  let totalDays = 0;
  let totalResponseTime = 0;
  let successCount = 0;
  
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth() + 1;
  
  for (let day = 1; day <= 31; day++) {
    const dateKey = `${year}-${month}-${day}`;
    if (dailyWasteData[dateKey]) {
      const data = dailyWasteData[dateKey];
      totalCollections += data.collections || 0;
      totalResponseTime += data.response || 0;
      successCount += data.success || 0;
      totalDays++;
    }
  }
  
  // Calculate averages
  const avgResponseTime = totalDays > 0 ? (totalResponseTime / totalDays).toFixed(1) : 12.4;
  const successRate = totalDays > 0 ? Math.round((successCount / totalDays)) : 99;
  
  // Update Detection Metrics
  const binsDetected = document.getElementById('binsDetected');
  const sensorsActive = document.getElementById('sensorsActive');
  const alertTriggers = document.getElementById('alertTriggers');
  
  if (binsDetected) binsDetected.textContent = 200 + totalCollections;
  if (sensorsActive) sensorsActive.textContent = Math.round((200 + totalCollections) * 0.98);
  if (alertTriggers) alertTriggers.textContent = Math.max(8, Math.round(totalCollections * 0.1));
  
  // Update Collection Insights
  const collectionEfficiency = document.getElementById('collectionEfficiency');
  const avgResponseTimeEl = document.getElementById('avgResponseTime');
  const collectionsCompleted = document.getElementById('collectionsCompleted');
  
  if (collectionEfficiency) collectionEfficiency.textContent = (90 + (successRate / 10)).toFixed(1) + '%';
  if (avgResponseTimeEl) avgResponseTimeEl.textContent = avgResponseTime;
  if (collectionsCompleted) collectionsCompleted.textContent = totalCollections;
}
  // Calculate monthly totals for the currently displayed month
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth() + 1;
  
  let totalBio = 0, totalNonBio = 0, totalHazard = 0, dayCount = 0;
  
  // Iterate through all daily data and filter by current month
  for (const [dateKey, data] of Object.entries(dailyWasteData)) {
    const [dataYear, dataMonth, dataDay] = dateKey.split('-').map(Number);
    
    // Only count dates within the current displayed month
    if (dataYear === year && dataMonth === month) {
      totalBio += data.bio;
      totalNonBio += data.nonbio;
      totalHazard += data.hazard;
      dayCount++;
    }
  }
  
  // Calculate averages for the month
  const avgBio = dayCount > 0 ? Math.round(totalBio / dayCount) : 0;
  const avgNonBio = dayCount > 0 ? Math.round(totalNonBio / dayCount) : 0;
  const avgHazard = dayCount > 0 ? Math.round(totalHazard / dayCount) : 0;
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const monthYear = monthNames[currentCalendarDate.getMonth()] + ' ' + year;
  
  // Update the summary cards that display monthly percentages
  summarySlides = document.querySelectorAll('#adminSummarySlider .summary-slide');
  summarySlides.forEach((slide, index) => {
    if (index === currentCalendarDate.getMonth()) {
      // Update the active slide with calculated data
      const stats = slide.querySelector('.month-stats');
      if (stats) {
        const bioStat = stats.querySelector('.stat.bio .value');
        const nonbioStat = stats.querySelector('.stat.nonbio .value');
        const hazardStat = stats.querySelector('.stat.hazard .value');
        
        if (bioStat) bioStat.textContent = avgBio + '%';
        if (nonbioStat) nonbioStat.textContent = avgNonBio + '%';
        if (hazardStat) hazardStat.textContent = avgHazard + '%';
      }
    }
  });
  
  // Update period summary display
  document.getElementById('periodSummaryTitle').textContent = '📊 Monthly Summary - ' + monthYear;
  document.getElementById('periodTotalWaste').textContent = '100%';
  document.getElementById('periodBiodegradable').textContent = avgBio + '%';
  document.getElementById('periodNonBiodegradable').textContent = avgNonBio + '%';
  document.getElementById('periodHazardous').textContent = avgHazard + '%';


function prevCalendarMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  generateCalendar();
  updateMonthlySummaryDisplay();
  generateWeekStatCards();
  populateDetectionSensors();
  populateCollectionsActivity();
  populatePerformanceChart();
  selectWeek(1); // Reset to Week 1 when changing months
}

function nextCalendarMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  generateCalendar();
  updateMonthlySummaryDisplay();
  generateWeekStatCards();
  populateDetectionSensors();
  populateCollectionsActivity();
  populatePerformanceChart();
  selectWeek(1); // Reset to Week 1 when changing months
}

// ===== WEEK SELECTION FUNCTIONS =====
function getCurrentMonthWeekRanges() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const weeks = [];
  let weekStart = new Date(firstDay);
  weekStart.setDate(weekStart.getDate() - firstDay.getDay()); // Start from Sunday
  
  // Generate week ranges for the entire month view
  let weekCount = 0;
  for (let i = 0; i < 6; i++) {
    const start = new Date(weekStart);
    start.setDate(start.getDate() + (i * 7));
    
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    // Check if this week has any days in the current month
    if (start <= lastDay && end >= firstDay) {
      weekCount++;
      weeks.push({ start: start, end: end, weekNumber: weekCount });
    }
    
    if (end > lastDay) break;
  }
  
  return weeks;
}

function getWeekTotals(weekNumber) {
  const weeks = getCurrentMonthWeekRanges();
  if (weekNumber < 1 || weekNumber > weeks.length) return null;
  
  const week = weeks[weekNumber - 1];
  let totalBio = 0, totalNonBio = 0, totalHazard = 0, dayCount = 0;
  
  // Iterate through each day in the week
  for (let d = new Date(week.start); d <= week.end; d.setDate(d.getDate() + 1)) {
    const dateKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    
    // Only count dates within the current month
    if (d.getMonth() === currentCalendarDate.getMonth() && 
        d.getFullYear() === currentCalendarDate.getFullYear()) {
      if (dailyWasteData[dateKey]) {
        totalBio += dailyWasteData[dateKey].bio;
        totalNonBio += dailyWasteData[dateKey].nonbio;
        totalHazard += dailyWasteData[dateKey].hazard;
        dayCount++;
      }
    }
  }
  
  // Calculate averages
  const avgBio = dayCount > 0 ? Math.round(totalBio / dayCount) : 0;
  const avgNonBio = dayCount > 0 ? Math.round(totalNonBio / dayCount) : 0;
  const avgHazard = dayCount > 0 ? Math.round(totalHazard / dayCount) : 0;
  
  return { bio: avgBio, nonbio: avgNonBio, hazard: avgHazard, dayCount: dayCount };
}

function getAllWeeksTotals() {
  const weeks = getCurrentMonthWeekRanges();
  const allWeeks = [];
  let totalBioAll = 0, totalNonBioAll = 0, totalHazardAll = 0, totalDays = 0;
  
  for (let i = 1; i <= weeks.length; i++) {
    const weekData = getWeekTotals(i);
    if (weekData && weekData.dayCount > 0) {
      allWeeks.push({
        weekNumber: i,
        bio: weekData.bio,
        nonbio: weekData.nonbio,
        hazard: weekData.hazard
      });
      totalBioAll += weekData.bio;
      totalNonBioAll += weekData.nonbio;
      totalHazardAll += weekData.hazard;
      totalDays += weekData.dayCount;
    }
  }
  
  const avgTotalBio = allWeeks.length > 0 ? Math.round(totalBioAll / allWeeks.length) : 0;
  const avgTotalNonBio = allWeeks.length > 0 ? Math.round(totalNonBioAll / allWeeks.length) : 0;
  const avgTotalHazard = allWeeks.length > 0 ? Math.round(totalHazardAll / allWeeks.length) : 0;
  
  return { weeks: allWeeks, totalBio: avgTotalBio, totalNonBio: avgTotalNonBio, totalHazard: avgTotalHazard };
}

function generateWeekStatCards() {
  const weeks = getCurrentMonthWeekRanges();
  const grid = document.getElementById('enhancedStatsGrid');
  
  if (!grid) return;
  
  // Clear existing cards
  grid.innerHTML = '';
  
  // Create card for each week
  weeks.forEach((week) => {
    const weekNum = week.weekNumber;
    const card = document.createElement('div');
    card.className = 'week-stat-card clickable';
    card.onclick = () => selectWeek(weekNum);
    card.dataset.weekNumber = weekNum;
    
    // Get trend direction (increasing or decreasing)
    const trendDirection = weekNum % 2 === 0 ? 'positive' : 'positive';
    const trendValue = 20 + (weekNum * 2);
    
    card.innerHTML = `
      <div class="card-header">
        <h4>Week ${weekNum}</h4>
        <span class="trend-badge ${trendDirection}">📈 +${weekNum}%</span>
      </div>
      <div class="total-percentage">${20 + (weekNum * 2)}%</div>
      <div class="stacked-bar">
        <div class="bar-segment bio" style="width: 40%;" title="Biodegradable"></div>
        <div class="bar-segment nonbio" style="width: 36%;" title="Non-Biodegradable"></div>
        <div class="bar-segment hazard" style="width: 24%;" title="Hazardous"></div>
      </div>
      <div class="waste-breakdown">
        <div class="waste-item"><span class="label">Bio</span><span class="value bio-text">40%</span></div>
        <div class="waste-item"><span class="label">Non-Bio</span><span class="value nonbio-text">36%</span></div>
        <div class="waste-item"><span class="label">Hazard</span><span class="value hazard-text">24%</span></div>
      </div>
      <div class="card-footer">
        <span class="collections-metric">📦 Collections: 0</span>
      </div>
    `;
    
    grid.appendChild(card);
  });
  
  // Update week count in summary
  const weeksCount = document.getElementById('weeksCount');
  if (weeksCount) {
    weeksCount.textContent = weeks.length;
  }
  
  // Update week selector buttons visibility
  updateWeekSelectorButtons();
  
  // Update enhanced statistics
  updateEnhancedStatistics();
}

function updateEnhancedStatistics() {
  // Update the week stat cards with calculated data
  const weeks = getCurrentMonthWeekRanges();
  const allData = getAllWeeksTotals();
  
  // Update month summary totals
  const monthBioValue = document.getElementById('monthBioValue');
  const monthNonbioValue = document.getElementById('monthNonbioValue');
  const monthHazardValue = document.getElementById('monthHazardValue');
  
  if (monthBioValue) monthBioValue.textContent = allData.totalBio + '%';
  if (monthNonbioValue) monthNonbioValue.textContent = allData.totalNonBio + '%';
  if (monthHazardValue) monthHazardValue.textContent = allData.totalHazard + '%';
  
  // Update individual week cards with calculated percentages
  const cards = document.querySelectorAll('.week-stat-card');
  
  cards.forEach((card, index) => {
    if (index < weeks.length) {
      const weekNum = index + 1;
      const weekData = getWeekTotals(weekNum);
      
      if (weekData && weekData.dayCount > 0) {
        // Calculate week's contribution to total monthly waste
        let weekTotal = 0;
        for (let i = 1; i <= 4; i++) {
          const wd = getWeekTotals(i);
          if (wd && wd.dayCount > 0) weekTotal += 25; // 25% per week max
        }
        const calculatedTotal = Math.round((weekData.dayCount / 30) * 100); // Normalize to calendar
        
        // Update total percentage
        card.querySelector('.total-percentage').textContent = calculatedTotal + '%';
        
        // Update waste breakdown values
        const breakdownItems = card.querySelectorAll('.waste-item .value');
        if (breakdownItems.length >= 3) {
          breakdownItems[0].textContent = weekData.bio + '%';
          breakdownItems[1].textContent = weekData.nonbio + '%';
          breakdownItems[2].textContent = weekData.hazard + '%';
        }
        
        // Update stacked bar segments based on actual percentages
        const segments = card.querySelectorAll('.bar-segment');
        if (segments.length >= 3) {
          segments[0].style.width = weekData.bio + '%';
          segments[1].style.width = weekData.nonbio + '%';
          segments[2].style.width = weekData.hazard + '%';
        }
        
        // Update collections count
        let totalCollections = 0;
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth() + 1;
        
        for (let day = 1; day <= 31; day++) {
          const dateKey = `${year}-${month}-${day}`;
          if (dailyWasteData[dateKey]) {
            const [y, m, d] = dateKey.split('-').map(Number);
            const date = new Date(y, m - 1, d);
            const firstDay = new Date(y, m - 1, 1);
            const wk = Math.ceil((date.getDate() + firstDay.getDay()) / 7);
            if (wk === weekNum) {
              totalCollections += dailyWasteData[dateKey].collections || 0;
            }
          }
        }
        
        const collectionMetric = card.querySelector('.collections-metric');
        if (collectionMetric) {
          collectionMetric.textContent = '📦 Collections: ' + totalCollections;
        }
      } else {
        // No data for this week - show as empty/disabled
        card.style.opacity = '0.5';
      }
    }
  });
}

function selectWeek(weekOrMonth) {
  const singleDisplay = document.getElementById('singleWeekDisplay');
  const multiDisplay = document.getElementById('multiWeekDisplay');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  updateWeekButtons(weekOrMonth);
  
  if (weekOrMonth === 'month') {
    // Display all weeks
    singleDisplay.style.display = 'none';
    multiDisplay.style.display = 'block';
    
    const allData = getAllWeeksTotals();
    let htmlContent = '<h4 style="margin-bottom: 15px; text-align: center;">📊 Monthly Waste Breakdown by Week</h4>';
    
    allData.weeks.forEach(week => {
      htmlContent += `
        <div class="week-summary-row">
          <div class="week-label">Week ${week.weekNumber}</div>
          <div class="week-stats-inline">
            <span class="stat-item"><span class="label">Bio:</span> <span class="value bio-text">${week.bio}%</span></span>
            <span class="stat-item"><span class="label">Non-Bio:</span> <span class="value nonbio-text">${week.nonbio}%</span></span>
            <span class="stat-item"><span class="label">Hazard:</span> <span class="value hazard-text">${week.hazard}%</span></span>
          </div>
        </div>
      `;
    });
    
    htmlContent += `
      <div class="week-total-row">
        <div class="week-label"><strong>📈 Monthly Total</strong></div>
        <div class="week-stats-inline">
          <span class="stat-item"><span class="label">Bio:</span> <span class="value bio-text"><strong>${allData.totalBio}%</strong></span></span>
          <span class="stat-item"><span class="label">Non-Bio:</span> <span class="value nonbio-text"><strong>${allData.totalNonBio}%</strong></span></span>
          <span class="stat-item"><span class="label">Hazard:</span> <span class="value hazard-text"><strong>${allData.totalHazard}%</strong></span></span>
        </div>
      </div>
    `;
    
    multiDisplay.innerHTML = htmlContent;
    document.getElementById('periodSummaryTitle').textContent = 
      '📊 Monthly Summary - ' + monthNames[currentCalendarDate.getMonth()] + ' ' + currentCalendarDate.getFullYear();
  } else {
    // Display single week
    multiDisplay.style.display = 'none';
    singleDisplay.style.display = 'flex';
    
    const weekData = getWeekTotals(weekOrMonth);
    if (weekData) {
      const weeks = getCurrentMonthWeekRanges();
      const week = weeks[weekOrMonth - 1];
      
      const startStr = week.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endStr = week.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      document.getElementById('periodSummaryTitle').textContent = 
        `📊 Week ${weekOrMonth} - ${startStr} to ${endStr}, ${currentCalendarDate.getFullYear()}`;
      
      document.getElementById('periodTotalWaste').textContent = '100%';
      document.getElementById('periodBiodegradable').textContent = weekData.bio + '%';
      document.getElementById('periodNonBiodegradable').textContent = weekData.nonbio + '%';
      document.getElementById('periodHazardous').textContent = weekData.hazard + '%';
    }
  }
}

function updateWeekSelectorButtons() {
  const weeks = getCurrentMonthWeekRanges();
  const buttonsContainer = document.querySelector('.week-selector-buttons');
  
  if (!buttonsContainer) return;
  
  console.log(`📊 Month: ${currentCalendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })} - Total Weeks: ${weeks.length}`);
  
  // Update or hide week buttons based on number of weeks
  const allButtons = buttonsContainer.querySelectorAll('.week-btn');
  allButtons.forEach((btn, index) => {
    // Skip the month button (it's the last one)
    if (btn.classList.contains('month-btn')) {
      return;
    }
    
    const weekNumber = index + 1;
    if (weekNumber <= weeks.length) {
      btn.style.display = 'block';
      btn.textContent = `Week ${weekNumber}`;
    } else {
      btn.style.display = 'none';
    }
  });
}

function updateWeekButtons(activeWeek) {
  const buttons = document.querySelectorAll('.week-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (activeWeek === 'month') {
    document.querySelector('.month-btn').classList.add('active');
    // Highlight all week cards when viewing full month
    document.querySelectorAll('.week-stat-card').forEach(card => {
      card.classList.remove('highlighted');
    });
  } else {
    // Find the button by its text content
    let found = false;
    buttons.forEach(btn => {
      if (btn.textContent.includes(`Week ${activeWeek}`)) {
        btn.classList.add('active');
        found = true;
      }
    });
    
    // If not found by text, try by position (fallback for dynamic buttons)
    if (!found && activeWeek >= 1 && activeWeek <= 5) {
      const weekOptions = document.querySelectorAll('.week-selector-buttons .week-btn:not(.month-btn)');
      if (weekOptions[activeWeek - 1]) {
        weekOptions[activeWeek - 1].classList.add('active');
      }
    }
    
    // Highlight the selected week card
    document.querySelectorAll('.week-stat-card').forEach((card, index) => {
      if (index + 1 === activeWeek) {
        card.classList.add('highlighted');
      } else {
        card.classList.remove('highlighted');
      }
    });
  }
}

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', function() {
  // Calendar initialization will run after page setup
  setTimeout(() => {
    const calendarDates = document.getElementById('calendarDates');
    if (calendarDates) {
      generateCalendar();
      generateWeekStatCards();
      populateDetectionSensors();
      populateCollectionsActivity();
      populatePerformanceChart();
      selectWeek(1); // Initialize with Week 1
    }
  }, 500);
});

// ===== ALERTS PAGE FUNCTIONS =====
const alertsData = [
  { id: 1, severity: 'critical', type: 'Capacity', title: 'Hazardous Bin Critical Level', description: 'BIN-0847 fill level: 98% - Immediate collection required', time: '2 minutes ago', icon: '🔴', zone: 'Zone A', read: false },
  { id: 2, severity: 'critical', type: 'Sensor', title: 'Sensor Malfunction Detected', description: 'Camera sensor in Zone C is offline - Unable to detect waste type', time: '5 minutes ago', icon: '📡', zone: 'Zone C', read: false },
  { id: 3, severity: 'critical', type: 'Collection', title: 'Overdue Collection Task', description: 'Route 03 collection not completed - 2 hours overdue', time: '15 minutes ago', icon: '🚛', zone: 'Central', read: false },
  { id: 4, severity: 'warning', type: 'Capacity', title: 'Biodegradable Bin - Half Capacity', description: 'BIN-0523 is at 50% capacity - Schedule collection soon', time: '22 minutes ago', icon: '⚠️', zone: 'Zone B', read: false },
  { id: 5, severity: 'warning', type: 'Sensor', title: 'Ultrasonic Sensor Drift', description: 'Ultrasonic sensor accuracy dropped to 85% - Calibration recommended', time: '35 minutes ago', icon: '📡', zone: 'Zone D', read: false },
  { id: 6, severity: 'warning', type: 'System', title: 'High Response Time', description: 'System response time exceeded 500ms - 3 requests delayed', time: '42 minutes ago', icon: '⏱️', zone: 'System', read: true },
  { id: 7, severity: 'warning', type: 'Capacity', title: 'Non-Biodegradable Full Capacity', description: 'BIN-0692 is at 82% capacity - Collection in 2 hours', time: '58 minutes ago', icon: '⚠️', zone: 'Zone E', read: true },
  { id: 8, severity: 'info', type: 'System', title: 'Scheduled Maintenance', description: 'System maintenance will occur on April 15 at 02:00 AM', time: '1 hour ago', icon: 'ℹ️', zone: 'System', read: true },
  { id: 9, severity: 'info', type: 'Report', title: 'Weekly Report Available', description: 'Weekly waste collection report has been generated', time: '2 hours ago', icon: '📊', zone: 'System', read: true },
  { id: 10, severity: 'success', type: 'Collection', title: 'Collection Completed', description: 'Route 02 collection completed - 15 bins emptied successfully', time: '3 hours ago', icon: '✅', zone: 'Central', read: true },
  { id: 11, severity: 'success', type: 'Sensor', title: 'Sensor Calibration Success', description: 'Camera sensor recalibration completed - Accuracy: 98%', time: '4 hours ago', icon: '✅', zone: 'Zone C', read: true },
  { id: 12, severity: 'success', type: 'System', title: 'System Backup Complete', description: 'Daily system backup completed successfully', time: '5 hours ago', icon: '✅', zone: 'System', read: true }
];

let filteredAlerts = [...alertsData];
let currentAlertFilter = 'all';

function initializeAlertsPage() {
  populateAlerts();
  updateAlertStats();
}

function populateAlerts() {
  const alertsContainer = document.getElementById('alertsContainer');
  if (!alertsContainer) return;

  alertsContainer.innerHTML = filteredAlerts.map(alert => `
    <div class="alert-item ${alert.severity} ${!alert.read ? 'unread' : ''}">
      <div class="alert-icon">${alert.icon}</div>
      <div class="alert-content">
        <div class="alert-header">
          <h4>${alert.title}</h4>
          <span class="alert-type">${alert.type}</span>
        </div>
        <p>${alert.description}</p>
        <div class="alert-footer">
          <span class="alert-time">${alert.time}</span>
          <span class="alert-zone">${alert.zone}</span>
        </div>
      </div>
      <div class="alert-actions">
        <button class="btn-action" onclick="acknowledgeAlert(${alert.id})" title="Acknowledge">👁️</button>
        <button class="btn-action dismiss" onclick="dismissAlert(${alert.id})" title="Dismiss">✕</button>
      </div>
    </div>
  `).join('');
}

function filterAlerts(severity) {
  currentAlertFilter = severity;

  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Filter alerts
  if (severity === 'all') {
    filteredAlerts = [...alertsData];
  } else {
    filteredAlerts = alertsData.filter(a => a.severity === severity);
  }

  populateAlerts();
}

function acknowledgeAlert(id) {
  const alert = alertsData.find(a => a.id === id);
  if (alert) {
    alert.read = true;
    populateAlerts();
    updateAlertStats();
  }
}

function dismissAlert(id) {
  const index = alertsData.findIndex(a => a.id === id);
  if (index > -1) {
    alertsData.splice(index, 1);
    // Reapply filter
    if (currentAlertFilter === 'all') {
      filteredAlerts = [...alertsData];
    } else {
      filteredAlerts = alertsData.filter(a => a.severity === currentAlertFilter);
    }
    populateAlerts();
    updateAlertStats();
  }
}

function dismissAllAlerts() {
  if (confirm('Are you sure you want to dismiss all alerts?')) {
    alertsData.length = 0;
    filteredAlerts = [];
    populateAlerts();
    updateAlertStats();
    showNotification('All alerts dismissed', 'success');
  }
}

function markAllAsRead() {
  alertsData.forEach(alert => alert.read = true);
  populateAlerts();
  updateAlertStats();
  showNotification('All alerts marked as read', 'success');
}

function updateAlertStats() {
  const criticalCount = alertsData.filter(a => a.severity === 'critical').length;
  const warningCount = alertsData.filter(a => a.severity === 'warning').length;
  const infoCount = alertsData.filter(a => a.severity === 'info').length;
  const resolvedCount = alertsData.filter(a => a.severity === 'success').length;

  document.getElementById('criticalAlertsCount').textContent = criticalCount;
  document.getElementById('warningAlertsCount').textContent = warningCount;
  document.getElementById('infoAlertsCount').textContent = infoCount;
  document.getElementById('resolvedAlertsCount').textContent = resolvedCount;
}

// ===== AUTO-UPDATE CHARTS =====
// Auto-update charts every 30 seconds (for demo purposes)
setInterval(() => {
  if (trendChart) {
    // Update trend chart with random data
    trendChart.data.datasets.forEach(dataset => {
      dataset.data = dataset.data.map(() => Math.floor(Math.random() * 200) + 50);
    });
    trendChart.update('quiet');
  }
}, 30000);
