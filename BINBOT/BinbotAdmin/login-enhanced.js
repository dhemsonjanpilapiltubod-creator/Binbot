/* ===== Binbot Login - Premium Edition JavaScript ===== */

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  initializeLogin();
});

function initializeLogin() {
  // Clear any previous dashboard session data when on login page
  localStorage.removeItem('binbot_session');
  localStorage.removeItem('binbot_user');
  
  // Initialize demo accounts in localStorage if not exists
  if (!localStorage.getItem('binbot_demo_accounts')) {
    const demoAccounts = [
      {
        id: 'ADM001',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@binbot.com',
        password: 'password123',
        role: 'Administrator',
        createdAt: new Date().toISOString()
      },
      {
        id: 'MGR001',
        firstName: 'Manager',
        lastName: 'User',
        email: 'manager@binbot.com',
        password: 'password123',
        role: 'Manager',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('binbot_demo_accounts', JSON.stringify(demoAccounts));
  }

  // Initialize user accounts storage if not exists
  if (!localStorage.getItem('binbot_accounts')) {
    localStorage.setItem('binbot_accounts', JSON.stringify([]));
  }

  // Check if already logged in
  if (localStorage.getItem('binbot_session')) {
    redirectToDashboard();
  }
}

// ===== LOGIN HANDLER =====
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  // Validation
  if (!email || !password) {
    showNotification('❌ Please enter email and password', 'error');
    return;
  }

  // Get all accounts (demo + registered + admin-created)
  const demoAccounts = JSON.parse(localStorage.getItem('binbot_demo_accounts') || '[]');
  const userAccounts = JSON.parse(localStorage.getItem('binbot_accounts') || '[]');
  const adminUsers = JSON.parse(localStorage.getItem('binbot_users') || '[]');
  const allAccounts = [...demoAccounts, ...userAccounts, ...adminUsers];

  // Debug: Log what accounts exist
  console.log('Demo Accounts:', demoAccounts);
  console.log('User Accounts:', userAccounts);
  console.log('Admin Users:', adminUsers);
  console.log('All Accounts:', allAccounts);
  console.log('Looking for email:', email, 'password:', password);

  // Find account
  const account = allAccounts.find(acc => acc.email === email && acc.password === password);
  
  // Debug: Log search result
  console.log('Account Found:', account);

  if (!account) {
    showNotification('❌ Invalid email or password', 'error');
    return;
  }

  // Check if account is active (optional)
  if (account.status === 'inactive') {
    showNotification('❌ Your account is inactive', 'error');
    return;
  }

  // Create session
  const userName = account.firstName && account.lastName 
    ? `${account.firstName} ${account.lastName}` 
    : account.name || account.username || 'User';
  
  const session = {
    token: generateSessionToken(),
    userId: account.id,
    email: account.email,
    role: account.role,
    username: userName,
    loginTime: new Date().toISOString()
  };

  // Save session and user data
  localStorage.setItem('binbot_session', session.token);
  localStorage.setItem('binbot_user', JSON.stringify({
    id: account.id,
    username: session.username,
    email: account.email,
    role: account.role
  }));

  if (rememberMe) {
    localStorage.setItem('binbot_remember_me', 'true');
  }

  const firstName = account.firstName || (account.name ? account.name.split(' ')[0] : 'User');
  showNotification(`✅ Welcome back, ${firstName}!`, 'success');

  // Redirect after short delay
  setTimeout(() => {
    redirectToDashboard();
  }, 1000);
}

// ===== PASSWORD HANDLERS =====
function togglePasswordField(fieldId) {
  const field = document.getElementById(fieldId);
  if (field.type === 'password') {
    field.type = 'text';
  } else {
    field.type = 'password';
  }
}

function setupPasswordInputListeners() {
  // Password input listeners setup
}

// ===== PASSWORD RESET =====
function showResetForm(event) {
  event.preventDefault();
  showNotification('📧 Password reset feature coming soon!', 'info');
}

// ===== VALIDATION FUNCTIONS =====
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
  const notificationDiv = document.getElementById('notification');
  
  notificationDiv.textContent = message;
  notificationDiv.className = `notification ${type} show`;

  setTimeout(() => {
    notificationDiv.classList.remove('show');
  }, 4000);
}

// ===== SESSION MANAGEMENT =====
function generateSessionToken() {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function redirectToDashboard() {
  // Clear any previous data and redirect
  setTimeout(() => {
    window.location.href = 'admin-enhanced.php';
  }, 100);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(event) {
  // Enter to submit form
  if (event.key === 'Enter' && document.getElementById('loginForm').classList.contains('active-form')) {
    const email = document.getElementById('loginEmail').value;
    if (email) {
      document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }
  }
});
