// ============================================================================
// Binbot.js - TrashSmart Dashboard JavaScript (2026 Premium)
// Enhanced with Better Performance, UX, and Code Organization
// ============================================================================

// ── Configuration ──────────────────────────────────────────────────────────
const CONFIG = {
  API_BASE: '/BinbotDashboard/api/',         // API base path
  SENSOR_UPDATE_INTERVAL: 2000,              // Poll sensor data every 2 seconds
  CHART_UPDATE_INTERVAL: 30000,              // Update chart every 30 seconds
  PARTICLE_COUNT: 25,                        // Particle effects count
  ANIMATION_DURATION: 600,                   // Standard animation duration (ms)
  FULL_BIN_THRESHOLD: 100                    // Percentage threshold for full bin
};

// ── Bin Lock State ──────────────────────────────────────────────────────────
const binLockState = {
  bio: false,
  nonbio: false,
  hazard: false
};

// ── Real-Time Data Store ────────────────────────────────────────────────────
const realTimeData = {
  sensors: null,
  chartData: null,
  lastUpdate: null,
  isLoading: false
};

// ── Polling Timers ─────────────────────────────────────────────────────────
let sensorPollingTimer = null;
let chartPollingTimer = null;

// ── API Functions ──────────────────────────────────────────────────────────
/**
 * Fetch real sensor data from API
 */
async function fetchSensorData() {
  try {
    const response = await fetch(CONFIG.API_BASE + 'get-sensor-data.php');
    const json = await response.json();
    
    if (json.success) {
      realTimeData.sensors = json.data;
      realTimeData.lastUpdate = new Date();
      updateUIFromSensorData(json.data);
      return true;
    } else {
      console.error('API Error:', json.message);
      return false;
    }
  } catch (err) {
    console.error('Fetch sensor data error:', err);
    return false;
  }
}

/**
 * Fetch 30-day chart data from API
 */
async function fetchChartData(days = 30) {
  try {
    const response = await fetch(CONFIG.API_BASE + `get-chart-data.php?days=${days}`);
    const json = await response.json();
    
    if (json.success) {
      realTimeData.chartData = json.data;
      updateChartFromData(json.data);
      return true;
    } else {
      console.error('Chart API Error:', json.message);
      return false;
    }
  } catch (err) {
    console.error('Chart fetch error:', err);
    return false;
  }
}

/**
 * Send command to ESP32 (via backend)
 */
async function sendCommandToESP32(action, compartment) {
  try {
    const response = await fetch(CONFIG.API_BASE + 'send-command.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, compartment })
    });
    const json = await response.json();
    return json.success;
  } catch (err) {
    console.error('Command send error:', err);
    return false;
  }
}

/**
 * Update UI from real sensor data
 */
function updateUIFromSensorData(data) {
  if (!data.sensors) return;
  
  const { ultrasonic, gas } = data.sensors;
  
  if (ultrasonic) {
    // Update circular progress indicators
    animateCircle('biodegradable', ultrasonic.bio?.fill_level || 0, '#4CAF50');
    animateCircle('nonBiodegradable', ultrasonic.nonbio?.fill_level || 0, '#3b82f6');
    animateCircle('hazardous', ultrasonic.hazard?.fill_level || 0, '#ef4444');
  }
  
  if (gas) {
    // Update gas monitoring display
    updateGasBox(
      false,
      gas.bio?.level_percent || 0,
      gas.nonbio?.level_percent || 0,
      gas.hazard?.level_percent || 0
    );
  }
}

/**
 * Update chart from real data
 */
function updateChartFromData(data) {
  if (!data.daily_readings || data.daily_readings.length === 0) return;
  
  const readings = data.daily_readings;
  const chartData = {
    labels: readings.map(r => r.day),
    bio: readings.map(r => r.bio_fill),
    nonBio: readings.map(r => r.nonbio_fill),
    hazard: readings.map(r => r.hazard_fill)
  };
  
  updateTrendChart(chartData);
}

/**
 * Initialize real-time polling
 */
function startRealtimePolling() {
  // Fetch sensor data immediately
  fetchSensorData();
  
  // Poll sensor data
  sensorPollingTimer = setInterval(() => {
    fetchSensorData();
  }, CONFIG.SENSOR_UPDATE_INTERVAL);
  
  // Fetch chart data
  fetchChartData();
  
  // Poll chart data
  chartPollingTimer = setInterval(() => {
    fetchChartData();
  }, CONFIG.CHART_UPDATE_INTERVAL);
  
  console.log('✓ Real-time polling started');
}

/**
 * Stop real-time polling
 */
function stopRealtimePolling() {
  if (sensorPollingTimer) clearInterval(sensorPollingTimer);
  if (chartPollingTimer) clearInterval(chartPollingTimer);
  console.log('✓ Real-time polling stopped');
}

/**
 * Safely get DOM element with fallback
 * @param {string} id - Element ID
 * @returns {HTMLElement|null}
 */
function getEl(id) {
  return document.getElementById(id);
}

// ── Particles System ──────────────────────────────────────────────────────
function createParticles(selector, count = CONFIG.PARTICLE_COUNT, isHeader = false) {
  const container = document.querySelector(selector);
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dx = (Math.random() - 0.5) * (isHeader ? 200 : 400);
    const dy = (Math.random() - 0.5) * (isHeader ? 200 : 400);
    p.style.left = `${x}%`;
    p.style.top = `${y}%`;
    p.style.setProperty('--dx', `${dx}px`);
    p.style.setProperty('--dy', `${dy}px`);
    p.style.animationDelay = `${Math.random() * 12}s`;
    container.appendChild(p);
  }
}

// ── Daily Time Bubble Update ───────────────────────────────────────────────
function updateTimeBubble() {
  const timeEl = document.getElementById('currentTime');
  const floatingMonthEl = document.getElementById('floatingMonth');
  const dayEl = document.getElementById('currentDay');
  const dayOfWeekEl = document.getElementById('currentDayOfWeek');
  
  if (!timeEl) return;
  
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const currentMonth = months[now.getMonth()];
  const currentMonthNumber = String(now.getMonth() + 1).padStart(2, '0');
  const currentDay = String(now.getDate()).padStart(2, '0');
  const currentDayOfWeek = daysOfWeek[now.getDay()];
  
  timeEl.textContent = `${hours}:${minutes}:${seconds}`;
  if (floatingMonthEl) floatingMonthEl.textContent = currentMonth;
  if (dayEl) dayEl.textContent = currentDay;
  if (dayOfWeekEl) dayOfWeekEl.textContent = currentDayOfWeek;
}

// Start time bubble updates
function initTimeBubble() {
  updateTimeBubble();
  setInterval(updateTimeBubble, 1000);
}



function animateCircle(id, targetPercent, baseColor) {
  const box = document.getElementById(id);
  if (!box) return;
  const canvas = box.querySelector('canvas');
  const percentEl = box.querySelector('.circle-percent');
  if (!canvas || !percentEl) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  // Set canvas size for high DPI
  const size = 160;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  ctx.scale(dpr, dpr);
  
  const cx = size / 2, cy = size / 2, r = 58, lw = 11;
  let progress = 0;

  function draw() {
    ctx.clearRect(0, 0, size, size);
    
    // Set up context
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;

    // Background ring - subtle glow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.lineWidth = lw;
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.12)';
    ctx.stroke();

    // Progress arc - main visual element
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (progress / 100) * Math.PI * 2;
    
    // Create linear gradient for progress arc
    const gradX1 = cx - r, gradY1 = cy - r;
    const gradX2 = cx + r, gradY2 = cy + r;
    const gradient = ctx.createLinearGradient(gradX1, gradY1, gradX2, gradY2);
    
    gradient.addColorStop(0, baseColor);
    gradient.addColorStop(0.5, baseColor);
    gradient.addColorStop(1, baseColor + 'cc');

    ctx.shadowColor = baseColor + '80';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.lineWidth = lw;
    ctx.strokeStyle = gradient;
    ctx.stroke();

    // Outer glow for progress arc
    ctx.shadowColor = baseColor + '40';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.lineWidth = lw + 6;
    ctx.strokeStyle = baseColor + '20';
    ctx.stroke();

    // Center circle with radial gradient
    ctx.shadowColor = 'transparent';
    const centerGrad = ctx.createRadialGradient(cx - 20, cy - 20, 5, cx, cy, r - lw - 12);
    centerGrad.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
    centerGrad.addColorStop(0.3, 'rgba(20, 28, 50, 0.8)');
    centerGrad.addColorStop(1, 'rgba(10, 15, 26, 0.95)');

    ctx.beginPath();
    ctx.arc(cx, cy, r - lw / 2 - 8, 0, Math.PI * 2);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = centerGrad;
    ctx.fill();

    // Highlight/Gloss effect
    ctx.shadowColor = 'transparent';
    const glossGrad = ctx.createRadialGradient(cx - 15, cy - 15, 0, cx, cy, r - lw);
    glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    glossGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.1)');
    glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.arc(cx, cy, r - lw - 10, 0, Math.PI * 2);
    ctx.fillStyle = glossGrad;
    ctx.fill();

    percentEl.textContent = Math.round(progress) + '%';

    if (progress < targetPercent) {
      progress += 1.2 + (targetPercent - progress) * 0.08;
      requestAnimationFrame(draw);
    } else if (progress > targetPercent) {
      progress = targetPercent;
      percentEl.textContent = Math.round(progress) + '%';
    }
  }

  requestAnimationFrame(draw);
}

// ── Box Slider ─────────────────────────────────────────────────────────────
let currentSlide = 0;
const sliderWrapper = document.getElementById('boxSlider');
const boxSlides = document.querySelectorAll('.box-slide');
function initializeSlider() {
  if (!sliderWrapper || boxSlides.length === 0) return;
  // Slider initialized without dots
}

function updateSlider() {
  sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
  boxSlides.forEach((slide, i) => {
    if (i === currentSlide) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });
}

function goToSlide(index) {
  currentSlide = index;
  updateSlider();
}

function moveSlide(dir) {
  currentSlide = (currentSlide + dir + boxSlides.length) % boxSlides.length;
  updateSlider();
}

// ── Calendar inside Box 1 ──────────────────────────────────────────────────
let currentMonthIndex = 3;
const monthSlides = document.querySelectorAll('#calendarSlider .calendar-slide');
const monthTitle = document.getElementById('currentMonth');

function changeMonth(dir) {
  // Remove active class from current slide
  monthSlides[currentMonthIndex].classList.remove('active');
  
  // Calculate next month index (ensures proper wrapping and sequential order)
  currentMonthIndex = (currentMonthIndex + dir + monthSlides.length) % monthSlides.length;
  
  // Add active class to new slide and update title
  monthSlides[currentMonthIndex].classList.add('active');
  monthTitle.textContent = monthSlides[currentMonthIndex].dataset.month;
}

// ── Trend Chart inside Box 2 ───────────────────────────────────────────────

let combinedTrendChartInstance = null;

const dailyTrendData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  bio:    [30, 40, 35, 50, 45, 60, 55],
  nonBio: [45, 50, 48, 60, 55, 65, 62],
  hazard: [20, 25, 22, 30, 28, 35, 32]
};

function updateTrendChart(data = dailyTrendData) {
  const chartElement = document.getElementById('combinedTrendChart');
  if (!chartElement) return;
  
  const ctx = chartElement.getContext('2d');
  if (combinedTrendChartInstance) {
    combinedTrendChartInstance.destroy();
  }
  
  combinedTrendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Biodegradable',
          data: data.bio,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76,175,80,0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#4CAF50',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          borderWidth: 3,
        },
        {
          label: 'Non-Biodegradable',
          data: data.nonBio,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          borderWidth: 3,
        },
        {
          label: 'Hazardous',
          data: data.hazard,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          borderWidth: 3,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#e2e8f0',
            font: { size: 14, weight: '600' },
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        title: {
          display: false
        },
        filler: {
          propagate: true
        }
      },
      scales: {
        x: {
          display: true,
          ticks: { color: '#94a3b8', font: { size: 13, weight: '500' } },
          grid: { color: 'rgba(148,163,184,0.12)', drawBorder: false }
        },
        y: {
          display: true,
          min: 0,
          max: 100,
          ticks: { color: '#94a3b8', font: { size: 13, weight: '500' }, stepSize: 20 },
          grid: { color: 'rgba(148,163,184,0.12)', drawBorder: false }
        }
      }
    }
  });
}

// ── Detection Simulation ────────────────────────────────────────────────────
function handleDetectionResponse(isCorrect) {
  const popup = document.getElementById('detectionPopup');
  const feedbackMsg = document.getElementById('feedbackMessage');
  const feedbackText = document.getElementById('feedbackText');
  const popupButtons = document.querySelector('.popup-buttons');
  const popupQuestion = document.querySelector('.popup-content p');
  
  if (!popup || !feedbackMsg) return;
  
  // Hide buttons and question
  if (popupButtons) popupButtons.style.display = 'none';
  if (popupQuestion) popupQuestion.style.display = 'none';
  
  // Show feedback message
  feedbackMsg.style.display = 'block';
  
  if (isCorrect) {
    feedbackMsg.classList.remove('error');
    feedbackMsg.classList.add('success');
    feedbackText.textContent = '✓ Thank you! Feedback recorded.';
  } else {
    feedbackMsg.classList.remove('success');
    feedbackMsg.classList.add('error');
    feedbackText.textContent = '✗ Feedback noted. Will improve detection.';
  }
  
  // Log feedback to console
  console.log(`Detection feedback: ${isCorrect ? 'Correct' : 'Incorrect'}`);
  
  // Hide popup after 2.5 seconds
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => {
      popup.style.display = 'none';
      feedbackMsg.style.display = 'none';
      if (popupButtons) popupButtons.style.display = 'flex';
      if (popupQuestion) popupQuestion.style.display = 'block';
    }, 400);
  }, 2500);
}

function showDetection(item) {
  const imageBox = document.getElementById('imageBox');
  const popup = document.getElementById('detectionPopup');
  const resultBox = document.getElementById('detectionResult');
  const waitingDetection = document.getElementById('waitingDetection');

  // Remove any previous detected image
  let prevImg = document.querySelector('.detected-img');
  if (prevImg) prevImg.remove();

  // Hide waiting detection box
  if (waitingDetection) {
    waitingDetection.classList.add('hidden');
  }

  // Create and display detected waste image (900x750px)
  if (imageBox && item.image) {
    const img = document.createElement('img');
    img.className = 'detected-img';
    img.src = item.image;
    img.alt = `Detected: ${item.name}`;
    img.title = `${item.name} (${item.category})`;
    img.onerror = () => {
      img.src = `https://via.placeholder.com/900x750?text=${encodeURIComponent(item.name)}`;
    };
    imageBox.appendChild(img);
    
    // Generate confidence percentage (85-99%)
    const confidence = Math.floor(Math.random() * 15) + 85;
    
    // Get category display name
    const categoryNames = {
      'bio': 'Biodegradable',
      'nonBio': 'Non-Biodegradable',
      'hazard': 'Hazardous'
    };
    const categoryDisplay = categoryNames[item.category] || item.category;
    
    // Show detection result box with details
    if (resultBox) {
      const resultText = document.getElementById('detectionText');
      if (resultText) {
        resultText.innerHTML = `<strong>${item.name}</strong><br>Category: ${categoryDisplay}<br>Confidence: ${confidence}%`;
      }
      resultBox.style.display = 'block';
      resultBox.classList.add('show');
      resultBox.style.pointerEvents = 'auto';
    }
    
    // Show detection popup for user confirmation
    if (popup) {
      popup.style.display = 'block';
      popup.classList.add('show');
      popup.style.pointerEvents = 'auto';
    }
    
    // Auto-remove image and popups after 8 seconds
    setTimeout(() => {
      if (img && img.parentNode) img.remove();
      if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.style.display = 'none', 400);
      }
      if (resultBox) {
        resultBox.classList.remove('show');
        setTimeout(() => resultBox.style.display = 'none', 400);
      }
      // Show waiting detection box again
      if (waitingDetection) {
        waitingDetection.classList.remove('hidden');
      }
    }, 8000);
  }
}

// ── Camera Access ──────────────────────────────────────────────────────────
async function startCamera() {
  const video = document.getElementById('cameraFeed');
  if (!video) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    console.log('✓ Camera started successfully');
  } catch (err) {
    console.error('✗ Camera error:', err.message);
    video.style.display = 'none';
    const placeholder = document.createElement('span');
    placeholder.className = 'placeholder-text';
    placeholder.textContent = 'Camera access denied. Using demo mode.';
    video.parentNode.insertBefore(placeholder, video);
  }
}



// ── Gas Sensor & Level Bars Demo ────────────────────────────────────────────
function showFullBinNotification(category, categoryName) {
  const notificationId = `notification-${category}`;
  
  // Check if notification already exists
  if (document.getElementById(notificationId)) {
    return;
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.id = notificationId;
  notification.className = `full-bin-notification ${category}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">🔴</span>
      <span class="notification-text">${categoryName} Bin is Full!</span>
      <span class="notification-action">🔒 Lid Locked</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
  
  // Log event
  console.log(`⚠️ ${categoryName} Bin is FULL! Lid automatically locked.`);
  logSecurityEvent('bin_full', { 
    category: category, 
    categoryName: categoryName,
    lidLocked: true 
  });
}

function updateGasBox(gasHigh, bio, nonBio, hazard) {
  // Update gas readings (PPM)
  const bioPPM = Math.round(bio * 3.75); // Convert percentage to PPM (0-300 PPM scale)
  const nonBioPPM = Math.round(nonBio * 3.75);
  const hazardPPM = Math.round(hazard * 3.75);
  
  // Update readings
  const bioReading = document.getElementById('bioGasReading');
  const nonBioReading = document.getElementById('nonBioGasReading');
  const hazardReading = document.getElementById('hazardGasReading');
  
  if (bioReading) bioReading.textContent = bioPPM + ' PPM';
  if (nonBioReading) nonBioReading.textContent = nonBioPPM + ' PPM';
  if (hazardReading) hazardReading.textContent = hazardPPM + ' PPM';
  
  // Update bar fills
  document.getElementById('bioLevelBar').style.width = bio + '%';
  document.getElementById('bioLevelPercent').textContent = bio + '%';
  document.getElementById('nonBioLevelBar').style.width = nonBio + '%';
  document.getElementById('nonBioLevelPercent').textContent = nonBio + '%';
  document.getElementById('hazardLevelBar').style.width = hazard + '%';
  document.getElementById('hazardLevelPercent').textContent = hazard + '%';
  
  // ── Check for Full Bins and Auto-Lock Lids ──
  const fullBinThreshold = CONFIG.FULL_BIN_THRESHOLD;
  
  // Check Bio Bin
  if (bio >= fullBinThreshold && !binLockState.bio) {
    binLockState.bio = true;
    showFullBinNotification('bio', 'Biodegradable');
    updateLidButtonState('bio', true);
  } else if (bio < fullBinThreshold && binLockState.bio) {
    binLockState.bio = false;
    updateLidButtonState('bio', false);
  }
  
  // Check Non-Bio Bin
  if (nonBio >= fullBinThreshold && !binLockState.nonbio) {
    binLockState.nonbio = true;
    showFullBinNotification('nonbio', 'Non-Biodegradable');
    updateLidButtonState('nonbio', true);
  } else if (nonBio < fullBinThreshold && binLockState.nonbio) {
    binLockState.nonbio = false;
    updateLidButtonState('nonbio', false);
  }
  
  // Check Hazard Bin
  if (hazard >= fullBinThreshold && !binLockState.hazard) {
    binLockState.hazard = true;
    showFullBinNotification('hazard', 'Hazardous');
    updateLidButtonState('hazard', true);
  } else if (hazard < fullBinThreshold && binLockState.hazard) {
    binLockState.hazard = false;
    updateLidButtonState('hazard', false);
  }
  
  // Update status for each compartment
  function updateGasStatus(compartmentName, percent, statusElementId) {
    const statusElement = document.getElementById(statusElementId);
    if (!statusElement) return;
    
    let statusClass = 'safe';
    let statusIcon = '✓';
    let statusText = 'Safe Level - Fan OFF';
    
    if (percent >= 80) {
      statusClass = 'danger';
      statusIcon = '⚡';
      statusText = 'CRITICAL - Fan AUTO-ON!';
    } else if (percent >= 70) {
      statusClass = 'warning';
      statusIcon = '⚠';
      statusText = 'Warning - Monitor Closely';
    } else if (percent >= 50) {
      statusClass = 'warning';
      statusIcon = '⚠';
      statusText = 'Elevated - Fan Ready';
    }
    
    statusElement.className = 'gas-indicator-status ' + statusClass;
    statusElement.innerHTML = `
      <span class="status-icon ${statusClass}">${statusIcon}</span>
      <span class="status-text">${statusText}</span>
    `;
  }
  
  updateGasStatus('Bio', bio, 'bioGasStatus');
  updateGasStatus('Non-Bio', nonBio, 'nonBioGasStatus');
  updateGasStatus('Hazardous', hazard, 'hazardGasStatus');
  
  // Update overall system status badge
  const systemBadge = document.getElementById('gasStatusBadge');
  if (systemBadge) {
    const maxGasLevel = Math.max(bio, nonBio, hazard);
    let badgeStatus = 'Normal';
    let badgeColor = '#4CAF50';
    
    if (maxGasLevel >= 80) {
      badgeStatus = 'CRITICAL';
      badgeColor = '#ef4444';
    } else if (maxGasLevel >= 70) {
      badgeStatus = 'Warning';
      badgeColor = '#ffc107';
    } else if (maxGasLevel >= 50) {
      badgeStatus = 'Elevated';
      badgeColor = '#ff9800';
    }
    
    systemBadge.style.borderColor = 'rgba(' + 
      (badgeColor === '#4CAF50' ? '76, 175, 80' : 
       badgeColor === '#ffc107' ? '255, 193, 7' : '239, 68, 68') + ', 0.3)';
    
    const badgeValue = systemBadge.querySelector('.badge-value');
    if (badgeValue) {
      badgeValue.textContent = badgeStatus;
      badgeValue.style.color = badgeColor;
    }
  }
}

function updateLidButtonState(category, isLocked) {
  const openButton = document.querySelector(`button[onclick="openLid('${category}')"]`);
  if (openButton) {
    if (isLocked) {
      openButton.disabled = true;
      openButton.classList.add('lid-locked');
      openButton.textContent = '🔒 Locked';
      openButton.title = 'Bin is full! Lid is locked. Can only be opened manually by admin.';
    } else {
      openButton.disabled = false;
      openButton.classList.remove('lid-locked');
      openButton.textContent = 'Open';
      openButton.title = 'Open lid';
    }
  }
}



// ── Note: Detection now happens via AI camera on ESP32-CAM ──────────────────
// Real detections are logged via log-detection.php API endpoint

// ── Settings Panel Management ───────────────────────────────────────────────
function openSettings() {
  const panel = document.getElementById('settingsPanel');
  const pinScreen = document.getElementById('pinUnlockScreen');
  const contentPanel = document.getElementById('settingsContentPanel');
  
  if (panel) {
    panel.classList.add('show');
    document.body.style.overflow = 'hidden';
    // Show PIN unlock screen, hide content
    if (pinScreen) pinScreen.style.display = 'flex';
    if (contentPanel) contentPanel.style.display = 'none';
    // Clear previous PIN inputs
    clearPinInputs();
  }
}

function closeSettings() {
  const panel = document.getElementById('settingsPanel');
  const pinScreen = document.getElementById('pinUnlockScreen');
  const contentPanel = document.getElementById('settingsContentPanel');
  
  // Log session close if settings were open
  if (contentPanel && contentPanel.style.display === 'block') {
    logSecurityEvent('SETTINGS_SESSION_CLOSED', {
      success: true,
      reason: 'User closed settings panel'
    });
  }
  
  if (panel) {
    panel.classList.remove('show');
    document.body.style.overflow = 'auto';
    clearPinInputs();
    if (pinScreen) pinScreen.style.display = 'flex';
    if (contentPanel) contentPanel.style.display = 'none';
  }
}

// ── PIN Unlock Functions ─────────────────────────────────────────────────────
function handlePinInput(event, fieldNumber) {
  const input = event.target;
  const value = input.value;
  
  // Only allow numbers
  if (value && isNaN(value)) {
    input.value = '';
    return;
  }
  
  // Auto-focus to next field if value entered
  if (value && fieldNumber < 4) {
    document.getElementById(`pinInput${fieldNumber + 1}`).focus();
  }
  
  // Allow backspace to go to previous field
  if (event.key === 'Backspace' && !value && fieldNumber > 1) {
    document.getElementById(`pinInput${fieldNumber - 1}`).focus();
  }
}

function clearPinInputs() {
  for (let i = 1; i <= 4; i++) {
    const input = document.getElementById(`pinInput${i}`);
    if (input) input.value = '';
  }
  const errorMsg = document.getElementById('pinErrorMessage');
  if (errorMsg) errorMsg.style.display = 'none';
}

// ── Security Logging Function ───────────────────────────────────────────────
function logSecurityEvent(eventType, details = {}) {
  // Get existing logs
  const existingLogs = JSON.parse(localStorage.getItem('binbot_security_logs') || '[]');
  
  // Create new log entry
  const logEntry = {
    id: 'LOG_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    datetime: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }),
    eventType: eventType,
    severity: details.success ? 'info' : 'warning',
    details: details,
    source: 'Dashboard',
    userAgent: navigator.userAgent,
    status: details.success ? '✅ Success' : '⚠️ Failed'
  };
  
  // Add to logs array
  existingLogs.push(logEntry);
  
  // Keep only last 500 logs (prevent storage overflow)
  if (existingLogs.length > 500) {
    existingLogs.shift();
  }
  
  // Save back to localStorage
  localStorage.setItem('binbot_security_logs', JSON.stringify(existingLogs));
  
  // Also sync to admin system for real-time visibility
  syncLogsToAdmin();
  
  console.log(`📋 Security Event Logged: ${eventType}`, logEntry);
}

function syncLogsToAdmin() {
  // This function ensures logs are visible in the admin dashboard
  // Logs are stored in shared localStorage so admin can access them
  const currentLogs = JSON.parse(localStorage.getItem('binbot_security_logs') || '[]');
  localStorage.setItem('binbot_security_logs', JSON.stringify(currentLogs));
}

function getPinValue() {
  let pin = '';
  for (let i = 1; i <= 4; i++) {
    const input = document.getElementById(`pinInput${i}`);
    pin += input ? input.value : '';
  }
  return pin;
}

function verifyPin() {
  const enteredPin = getPinValue();
  
  // Check if all 4 digits entered
  if (enteredPin.length !== 4) {
    logSecurityEvent('PIN_ATTEMPT_INCOMPLETE', {
      success: false,
      pinLength: enteredPin.length,
      reason: 'Incomplete PIN entry'
    });
    showPinError();
    return;
  }
  
  // Get admin users from localStorage
  const adminUsers = JSON.parse(localStorage.getItem('binbot_users') || '[]');
  
  // Check if PIN matches any Supervisor or Collector account
  const validUser = adminUsers.find(user => {
    const isValidRole = user.role === 'Supervisor' || user.role === 'Collector';
    const isPinMatch = user.password === enteredPin;
    return isValidRole && isPinMatch;
  });
  
  if (validUser) {
    // PIN is correct - Log successful unlock
    logSecurityEvent('PIN_UNLOCK_SUCCESS', {
      success: true,
      userId: validUser.id,
      userName: validUser.name,
      userRole: validUser.role,
      email: validUser.email
    });
    
    const pinScreen = document.getElementById('pinUnlockScreen');
    const contentPanel = document.getElementById('settingsContentPanel');
    
    if (pinScreen) pinScreen.style.display = 'none';
    if (contentPanel) contentPanel.style.display = 'block';
    
    console.log(`✅ Settings unlocked for ${validUser.role}: ${validUser.name}`);
  } else {
    // PIN is incorrect - Log failed attempt
    logSecurityEvent('PIN_UNLOCK_FAILED', {
      success: false,
      reason: 'Invalid PIN entered',
      attemptedPin: enteredPin.replace(/./g, '*') // Mask PIN in log
    });
    
    showPinError();
    clearPinInputs();
    document.getElementById('pinInput1').focus();
  }
}

function showPinError() {
  const errorMsg = document.getElementById('pinErrorMessage');
  if (errorMsg) {
    errorMsg.style.display = 'block';
    // Shake animation already applied via CSS
    setTimeout(() => {
      errorMsg.style.display = 'none';
    }, 3000);
  }
}

function switchSettingsTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active class from all buttons
  document.querySelectorAll('.settings-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  const tab = document.getElementById(`${tabName}-tab`);
  if (tab) {
    tab.classList.add('active');
  }
  
  // Activate button
  event.target.classList.add('active');
}

function updateCameraThreshold(value) {
  document.getElementById('cameraThresholdValue').textContent = value + '%';
  console.log('Camera Detection Threshold updated to:', value + '%');
}

function updateBioThreshold(value) {
  document.getElementById('bioThresholdValue').textContent = value + '%';
  console.log('Biodegradable Fill Alert Threshold updated to:', value + '%');
}

function updateNonBioThreshold(value) {
  document.getElementById('nonBioThresholdValue').textContent = value + '%';
  console.log('Non-Biodegradable Fill Alert Threshold updated to:', value + '%');
}

function updateHazardThreshold(value) {
  document.getElementById('hazardThresholdValue').textContent = value + '%';
  console.log('Hazardous Fill Alert Threshold updated to:', value + '%');
}

function updateGasThreshold(value) {
  document.getElementById('gasThresholdValue').textContent = value + ' PPM';
  console.log('Gas Level Alert Threshold updated to:', value + ' PPM');
}

function resetToDefaults() {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    // Reset all sliders and controls to default values
    document.getElementById('cameraThreshold').value = 85;
    document.getElementById('bioThreshold').value = 80;
    document.getElementById('nonBioThreshold').value = 80;
    document.getElementById('hazardThreshold').value = 75;
    document.getElementById('gasThreshold').value = 300;
    
    // Update display values
    document.getElementById('cameraThresholdValue').textContent = '85%';
    document.getElementById('bioThresholdValue').textContent = '80%';
    document.getElementById('nonBioThresholdValue').textContent = '80%';
    document.getElementById('hazardThresholdValue').textContent = '75%';
    document.getElementById('gasThresholdValue').textContent = '300 PPM';
    
    console.log('All settings reset to defaults');
  }
}

function saveSettings() {
  const settings = {
    cameraThreshold: document.getElementById('cameraThreshold').value,
    bioThreshold: document.getElementById('bioThreshold').value,
    nonBioThreshold: document.getElementById('nonBioThreshold').value,
    hazardThreshold: document.getElementById('hazardThreshold').value,
    gasThreshold: document.getElementById('gasThreshold').value,
    timestamp: new Date().toISOString()
  };
  
  // Save to localStorage
  localStorage.setItem('binbotSettings', JSON.stringify(settings));
  
  // Show success message
  alert('✅ Settings saved successfully!');
  console.log('Settings saved:', settings);
  
  closeSettings();
}

// ── Manual Lid Control ──────────────────────────────────────────────────
// Track current action for modal confirmation
let pendingLidAction = null;

function showLidModal(type, category) {
  const categoryNames = {
    'bio': 'Biodegradable',
    'nonbio': 'Non-Biodegradable',
    'hazard': 'Hazardous'
  };
  
  const name = categoryNames[category] || category;
  const overlay = document.getElementById('lidModalOverlay');
  
  if (type === 'open') {
    pendingLidAction = { type: 'open', category: category, name: name };
    const openModal = document.getElementById('openLidModal');
    document.getElementById('openLidText').textContent = `Open ${name} compartment lid?`;
    if (overlay) overlay.classList.add('show');
    if (openModal) openModal.classList.add('show');
  } else if (type === 'close') {
    pendingLidAction = { type: 'close', category: category, name: name };
    const closeModal = document.getElementById('closeLidModal');
    document.getElementById('closeLidText').textContent = `Close ${name} compartment lid?`;
    if (overlay) overlay.classList.add('show');
    if (closeModal) closeModal.classList.add('show');
  } else if (type === 'locked') {
    const lockedModal = document.getElementById('lockedBinModal');
    document.getElementById('lockedBinText').textContent = `The ${name} Bin is FULL!\n\nThis compartment needs to be manually emptied by an administrator before it can be opened.`;
    if (overlay) overlay.classList.add('show');
    if (lockedModal) lockedModal.classList.add('show');
  }
}

function closeLidModal() {
  const overlay = document.getElementById('lidModalOverlay');
  const openModal = document.getElementById('openLidModal');
  const closeModal = document.getElementById('closeLidModal');
  const lockedModal = document.getElementById('lockedBinModal');
  const successModal = document.getElementById('successModal');
  
  if (overlay) overlay.classList.remove('show');
  if (openModal) openModal.classList.remove('show');
  if (closeModal) closeModal.classList.remove('show');
  if (lockedModal) lockedModal.classList.remove('show');
  if (successModal) successModal.classList.remove('show');
  
  pendingLidAction = null;
}

function showSuccessModal(message) {
  const overlay = document.getElementById('lidModalOverlay');
  const successModal = document.getElementById('successModal');
  
  document.getElementById('successText').textContent = message;
  if (overlay) overlay.classList.add('show');
  if (successModal) successModal.classList.add('show');
}

function confirmOpenLid() {
  if (!pendingLidAction || pendingLidAction.type !== 'open') return;
  
  const category = pendingLidAction.category;
  const name = pendingLidAction.name;
  
  // Check if bin is locked
  if (binLockState[category]) {
    closeLidModal();
    showLidModal('locked', category);
    logSecurityEvent('locked_lid_open_attempt', { 
      category: category, 
      categoryName: name,
      status: false,
      reason: 'Bin is full - lid locked'
    });
    return;
  }
  
  // Send command to ESP32 via API
  console.log(`Sending open command for ${name} compartment...`);
  
  sendCommandToESP32('open_lid', category).then(success => {
    if (success) {
      const lidAction = {
        action: 'open_lid',
        category: category,
        categoryName: name,
        timestamp: new Date().toISOString()
      };
      
      // Log to localStorage for history
      const lidHistory = JSON.parse(localStorage.getItem('lidHistory') || '[]');
      lidHistory.push(lidAction);
      localStorage.setItem('lidHistory', JSON.stringify(lidHistory));
      
      logSecurityEvent('lid_opened', {
        category: category,
        categoryName: name,
        success: true
      });
      
      closeLidModal();
      showSuccessModal(`✅ ${name} lid is now open!\n\nRemember to close it when finished.`);
    } else {
      closeLidModal();
      showSuccessModal(`❌ Failed to open lid. Check ESP32 connection.`);
    }
  });
}

function confirmCloseLid() {
  if (!pendingLidAction || pendingLidAction.type !== 'close') return;
  
  const category = pendingLidAction.category;
  const name = pendingLidAction.name;
  
  console.log(`Sending close command for ${name} compartment...`);
  
  // Send command to ESP32 via API
  sendCommandToESP32('close_lid', category).then(success => {
    if (success) {
      const lidAction = {
        action: 'close_lid',
        category: category,
        categoryName: name,
        timestamp: new Date().toISOString()
      };
      
      // Log to localStorage for history
      const lidHistory = JSON.parse(localStorage.getItem('lidHistory') || '[]');
      lidHistory.push(lidAction);
      localStorage.setItem('lidHistory', JSON.stringify(lidHistory));
      
      logSecurityEvent('lid_closed', {
        category: category,
        categoryName: name,
        success: true
      });
      
      closeLidModal();
      showSuccessModal(`✅ ${name} lid is now closed securely!`);
    } else {
      closeLidModal();
      showSuccessModal(`❌ Failed to close lid. Check ESP32 connection.`);
    }
  });
}

function openLid(category) {
  showLidModal('open', category);
}

function closeLid(category) {
  showLidModal('close', category);
}

function closeLid(category) {
  const categoryNames = {
    'bio': 'Biodegradable',
    'nonbio': 'Non-Biodegradable',
    'hazard': 'Hazardous'
  };
  
  const name = categoryNames[category] || category;
  
  // Show confirmation before closing
  const confirmed = confirm(`🚪 Close ${name} Lid?\n\nMake sure nothing is in the way!`);
  
  if (confirmed) {
    // Simulate lid closing action
    console.log(`Closing ${name} compartment lid...`);
    
    // Show success message
    alert(`✅ ${name} lid is now closed securely!`);
    
    // Log to console for debugging/backend integration
    const lidAction = {
      action: 'close_lid',
      category: category,
      categoryName: name,
      timestamp: new Date().toISOString()
    };
    
    console.log('Lid action:', lidAction);
    
    // Save to localStorage for tracking
    const lidHistory = JSON.parse(localStorage.getItem('lidHistory') || '[]');
    lidHistory.push(lidAction);
    localStorage.setItem('lidHistory', JSON.stringify(lidHistory));
    
    // Log security event
    logSecurityEvent('lid_closed', {
      category: category,
      categoryName: name,
      success: true
    });
    
    // In production, you would send this to your backend/ESP32
    // Example: sendToBackend('/api/lid/close', lidAction);
  }
}

// ── Admin Manual Lid Unlock ──
function unlockLockedBin(category) {
  const categoryNames = {
    'bio': 'Biodegradable',
    'nonbio': 'Non-Biodegradable',
    'hazard': 'Hazardous'
  };
  
  const name = categoryNames[category] || category;
  
  if (!binLockState[category]) {
    showSuccessModal(`ℹ️ ${name} bin is not locked.`);
    return;
  }
  
  // Prompt for PIN to verify Supervisor or Collector role
  const pin = prompt('🔐 Enter your 4-digit PIN to unlock this bin:\n(Supervisor or Collector only)');
  
  if (!pin) {
    return; // User cancelled
  }
  
  if (pin.length !== 4 || isNaN(pin)) {
    showSuccessModal('❌ Invalid PIN! Must be 4 digits.');
    logSecurityEvent('bin_unlock_invalid_pin', {
      category: category,
      success: false,
      reason: 'Invalid PIN format'
    });
    return;
  }
  
  // Get users from localStorage
  const adminUsers = JSON.parse(localStorage.getItem('binbot_users') || '[]');
  
  // Check if PIN matches any Supervisor or Collector account
  const validUser = adminUsers.find(user => {
    const isValidRole = user.role === 'Supervisor' || user.role === 'Collector';
    const isPinMatch = user.password === pin;
    return isValidRole && isPinMatch;
  });
  
  if (!validUser) {
    showSuccessModal('❌ Access Denied!\n\nOnly Supervisor and Collector accounts can unlock bins.\nPlease check your PIN and role.');
    logSecurityEvent('bin_unlock_failed', {
      category: category,
      success: false,
      reason: 'Invalid PIN or insufficient privileges'
    });
    return;
  }
  
  // PIN is valid and user has proper role
  const confirmed = confirm(`✅ Welcome, ${validUser.name}!\n\n🔓 Unlock ${name} Bin?\n\nThis should only be done after emptying the bin.`);
  
  if (confirmed) {
    binLockState[category] = false;
    updateLidButtonState(category, false);
    showSuccessModal(`✅ ${name} Bin has been unlocked by ${validUser.name}!\n\nLid can now be opened normally.`);
    
    logSecurityEvent('bin_manually_unlocked', {
      category: category,
      categoryName: name,
      unlockedBy: validUser.name,
      userRole: validUser.role,
      userId: validUser.id,
      success: true
    });
    
    console.log(`🔓 ${name} Bin unlocked by ${validUser.name} (${validUser.role})`);
  }
}

// ── Initialization ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Initialize time bubble
  initTimeBubble();
  
  // Initialize slider
  initializeSlider();
  updateSlider();
  
  // Create particles
  createParticles('.particle-container', 16, true);
  createParticles('body', 22, false);

  // Start camera
  startCamera();

  // Initialize calendar
  if (monthSlides.length > 0) {
    monthSlides[currentMonthIndex].classList.add('active');
    monthTitle.textContent = monthSlides[currentMonthIndex].dataset.month;
  }

  // Initialize trend chart (will be populated by API)
  updateTrendChart();

  // ─── START REAL-TIME POLLING ───
  startRealtimePolling();

  // Add Settings nav link click handler
  const settingsLink = document.querySelector('a[href="#settings"]');
  if (settingsLink) {
    settingsLink.addEventListener('click', (e) => {
      e.preventDefault();
      openSettings();
    });
  }

  // Initialize first settings tab as active
  switchSettingsTabDirect('sensors');
  
  console.log('✓ Dashboard initialized with real-time polling');
});

// Stop polling when user leaves the page
window.addEventListener('beforeunload', () => {
  stopRealtimePolling();
});

// Helper function to set active tab directly (on init)
function switchSettingsTabDirect(tabName) {
  const tab = document.getElementById(`${tabName}-tab`);
  const btns = document.querySelectorAll('.settings-tab-btn');
  
  document.querySelectorAll('.settings-tab').forEach(t => {
    t.classList.remove('active');
  });
  
  btns.forEach((btn, i) => {
    if (i === 0 && tabName === 'sensors') {
      btn.classList.add('active');
    } else if (i === 1 && tabName === 'health') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  if (tab) {
    tab.classList.add('active');
  }
}

// Redraw chart on resize
window.addEventListener('resize', () => {
  updateTrendChart();
});
