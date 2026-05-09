<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title>ESP32-CAM Trash Bin Monitor</title>
  <link rel="stylesheet" href="Binbot.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

<header class="premium-header compact">
  <div class="header-wave-bg"></div>
  
  <div class="logo-title">
    <h1 class="typing-title" id="mainTitle">Binbot</h1>
    <p class="header-subtitle">AI-Powered Waste Monitoring</p> <!-- shortened text -->
  </div>
  
  <div class="header-content">
    <nav class="header-nav">
      <a href="#home" class="nav-link active">Home</a>
      <a href="#settings" class="nav-link">Settings</a>
    </nav>
  </div>

  <div class="particle-container" id="particles"></div>

</header>
<main class="dashboard-layout">
  <!-- Camera (left) + Slider (right) side-by-side -->
  <div class="top-row">
    <!-- Left: Camera -->
    <section class="camera-section">
      <div class="image-box" id="imageBox">
        <video id="cameraFeed" autoplay muted style="width:100%; height:100%; object-fit:cover;"></video>
        <div class="waiting-detection" id="waitingDetection">
          <div class="waiting-content">
            <div class="spinner"></div>
            <p>Waiting for detection...</p>
          </div>
        </div>
        <div class="detection-popup" id="detectionPopup" style="display:none;">
          <div class="popup-content">
            <p>This is Correct?</p>
            <div class="popup-buttons">
              <button class="btn-yes" onclick="handleDetectionResponse(true)">Yes</button>
              <button class="btn-no" onclick="handleDetectionResponse(false)">No</button>
            </div>
            <div class="feedback-message" id="feedbackMessage" style="display:none;">
              <span id="feedbackText"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="detection-result-box" id="detectionResult" style="display:none;">
        <span id="detectionText">Waiting for detection...</span>
      </div>
    </section>

    <!-- Right: Slider Box (calendar + chart) -->
    <div class="slider-section">
      <div class="box-slider-container">
        <div class="box-slider-wrapper" id="boxSlider">

          <!-- Box 1: Calendar Summary -->
          <div class="box-slide active">
            <div class="box-card">
              <h3>Monthly Summary</h3>
              <div class="calendar-box">
                <div class="calendar-header">
                  <button class="nav-arrow prev" onclick="changeMonth(-1)">←</button>
                  <h3 id="currentMonth">April 2026</h3>
                  <button class="nav-arrow next" onclick="changeMonth(1)">→</button>
                </div>
                <div class="calendar-slider" id="calendarSlider">
                  <div class="calendar-slide" data-month="January 2026">
                    <div class="month-stats">
                      <div class="stat bio"><span class="label">Biodegradable</span><span class="value">35%</span></div>
                      <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">52%</span></div>
                      <div class="stat hazard"><span class="label">Hazardous</span><span class="value">13%</span></div>
                    </div>
                    <p class="total-waste">Total percent collected: <strong>100%</strong></p>
                  </div>
                  <div class="calendar-slide" data-month="February 2026">
                    <div class="month-stats">
                      <div class="stat bio"><span class="label">Biodegradable</span><span class="value">33%</span></div>
                      <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">54%</span></div>
                      <div class="stat hazard"><span class="label">Hazardous</span><span class="value">13%</span></div>
                    </div>
                    <p class="total-waste">Total percent collected: <strong>100%</strong></p>
                  </div>
                  <div class="calendar-slide" data-month="March 2026">
                    <div class="month-stats">
                      <div class="stat bio"><span class="label">Biodegradable</span><span class="value">38%</span></div>
                      <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">48%</span></div>
                      <div class="stat hazard"><span class="label">Hazardous</span><span class="value">14%</span></div>
                    </div>
                    <p class="total-waste">Total percent collected: <strong>100%</strong></p>
                  </div>
                  <div class="calendar-slide active" data-month="April 2026">
                    <div class="month-stats">
                      <div class="stat bio"><span class="label">Biodegradable</span><span class="value">36%</span></div>
                      <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">50%</span></div>
                      <div class="stat hazard"><span class="label">Hazardous</span><span class="value">14%</span></div>
                    </div>
                    <p class="total-waste">Total percent collected: <strong>100%</strong></p>
                  </div>
                  <div class="calendar-slide" data-month="May 2026">
                    <div class="month-stats">
                      <div class="stat bio"><span class="label">Biodegradable</span><span class="value">40%</span></div>
                      <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">46%</span></div>
                      <div class="stat hazard"><span class="label">Hazardous</span><span class="value">14%</span></div>
                    </div>
                    <p class="total-waste">Total percent collected: <strong>100%</strong></p>
                  </div>
                  <div class="calendar-slide" data-month="June 2026">
                    <div class="month-stats">
                      <div class="stat bio"><span class="label">Biodegradable</span><span class="value">32%</span></div>
                      <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">55%</span></div>
                      <div class="stat hazard"><span class="label">Hazardous</span><span class="value">13%</span></div>
                    </div>
                    <p class="total-waste">Total percent collected: <strong>100%</strong></p>
                  </div>
                  <div class="calendar-slide" data-month="July 2026">
                    <div class="month-stats">
                      <div class="stat bio"><span class="label">Biodegradable</span><span class="value">39%</span></div>
                      <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">47%</span></div>
                      <div class="stat hazard"><span class="label">Hazardous</span><span class="value">14%</span></div>
                    </div>
                    <p class="total-waste">Total percent collected: <strong>100%</strong></p>
                  </div>
                  <div class="calendar-slide" data-month="August 2026">
                    <div class="month-stats">
                      <div class="stat bio"><span class="label">Biodegradable</span><span class="value">37%</span></div>
                      <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">49%</span></div>
                      <div class="stat hazard"><span class="label">Hazardous</span><span class="value">14%</span></div>
                    </div>
                    <p class="total-waste">Total percent collected: <strong>100%</strong></p>
                  </div>
                  <div class="calendar-slide" data-month="September 2026">
                    <div class="month-stats">
                      <div class="stat bio"><span class="label">Biodegradable</span><span class="value">34%</span></div>
                      <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">52%</span></div>
                      <div class="stat hazard"><span class="label">Hazardous</span><span class="value">14%</span></div>
                    </div>
                    <p class="total-waste">Total percent collected: <strong>100%</strong></p>
                  </div>
                  <div class="calendar-slide" data-month="October 2026">
                    <div class="month-stats">
                      <div class="stat bio"><span class="label">Biodegradable</span><span class="value">38%</span></div>
                      <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">48%</span></div>
                      <div class="stat hazard"><span class="label">Hazardous</span><span class="value">14%</span></div>
                    </div>
                    <p class="total-waste">Total percent collected: <strong>100%</strong></p>
                  </div>
                  <div class="calendar-slide" data-month="November 2026">
                    <div class="month-stats">
                      <div class="stat bio"><span class="label">Biodegradable</span><span class="value">36%</span></div>
                      <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">51%</span></div>
                      <div class="stat hazard"><span class="label">Hazardous</span><span class="value">13%</span></div>
                    </div>
                    <p class="total-waste">Total percent collected: <strong>100%</strong></p>
                  </div>
                  <div class="calendar-slide" data-month="December 2026">
                    <div class="month-stats">
                      <div class="stat bio"><span class="label">Biodegradable</span><span class="value">35%</span></div>
                      <div class="stat nonbio"><span class="label">Non-Biodegradable</span><span class="value">50%</span></div>
                      <div class="stat hazard"><span class="label">Hazardous</span><span class="value">15%</span></div>
                    </div>
                    <p class="total-waste">Total percent collected: <strong>100%</strong></p>
                  </div>
                </div>
              </div>
              <!-- Progress circles – below total waste -->
              <div class="analysis-circles-container">
                <div class="centered-circles" style="flex-direction: row;">
                  <div class="circle-group">
                    <div class="analysis-box" id="biodegradable">
                      <canvas width="160" height="160"></canvas>
                      <div class="circle-percent">0%</div>
                      <div class="circle-summary" id="bioSummary"></div>
                    </div>
                    <div class="circle-label">Bio Fill</div>
                  </div>
                  <div class="circle-group">
                    <div class="analysis-box" id="nonBiodegradable">
                      <canvas width="160" height="160"></canvas>
                      <div class="circle-percent">0%</div>
                      <div class="circle-summary" id="nonBioSummary"></div>
                    </div>
                    <div class="circle-label">Non-Bio Fill</div>
                  </div>
                  <div class="circle-group">
                    <div class="analysis-box" id="hazardous">
                      <canvas width="160" height="160"></canvas>
                      <div class="circle-percent">0%</div>
                      <div class="circle-summary" id="hazardSummary"></div>
                    </div>
                    <div class="circle-label">Hazardous Fill</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="box-slide">
            <div class="box-card">
              <div class="chart-header">
                <div>
                  <h3>📊 Fill Level Trend</h3>
                  <p class="subtitle">Daily waste collection percentage (0–100% over 30 days)</p>
                </div>
                <div class="chart-info-badge">
                  <span class="info-label">Tracking</span>
                  <span class="info-value">30 Days</span>
                </div>
              </div>
              
              <div class="chart-container">
                <canvas id="combinedTrendChart"></canvas>
              </div>
              
              <div class="chart-legend">
                <!-- legend items generated by chart.js -->
              </div>

              <!-- Daily Collection Stats -->
              <div class="collection-stats">
                <div class="stat-item">
                  <span class="stat-label">Avg Daily Collection</span>
                  <span class="stat-value">62.5%</span>
                  <span class="stat-unit">per day</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Peak Collection</span>
                  <span class="stat-value">95%</span>
                  <span class="stat-unit">highest</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Lowest Collection</span>
                  <span class="stat-value">18%</span>
                  <span class="stat-unit">lowest</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Total Tracked</span>
                  <span class="stat-value">1,875%</span>
                  <span class="stat-unit">total 30 days</span>
                </div>
              </div>

              <!-- Trend Insight -->
              <div class="trend-insight">
                📈 <strong>Trend:</strong> Collection rates are trending upward with a +8.2% increase compared to last month. Peak collection typically occurs on weekends.
              </div>
            </div>
          </div>

          <!-- Box 3: Gas Level Monitor -->
          <div class="box-slide">
            <div class="box-card">
              <div class="gas-header">
                <div>
                  <h3>💨 Gas Level Monitoring</h3>
                  <p class="subtitle">Real-time gas detection with automatic fan control (80-90% activation)</p>
                </div>
                <div class="gas-status-badge" id="gasStatusBadge">
                  <span class="badge-label">System</span>
                  <span class="badge-value">Normal</span>
                </div>
              </div>

              <!-- Biodegradable Gas Monitor -->
              <div class="gas-monitor-card">
                <div class="gas-card-header">
                  <span class="gas-type-label">🟩 Biodegradable Compartment</span>
                  <span class="gas-reading" id="bioGasReading">42 PPM</span>
                </div>
                
                <div class="gas-threshold-bar">
                  <div class="threshold-marker" style="left: 80%; top: -8px;" title="Fan Activation Threshold">
                    <span class="threshold-label">Fan ON ⚡</span>
                  </div>
                  <div id="bioLevelBar" class="gas-bar-fill" style="background: linear-gradient(90deg, #4CAF50, #45a049); width: 42%; transition: all 0.5s ease;"></div>
                  <span id="bioLevelPercent" class="gas-level-percent">42%</span>
                </div>

                <div class="gas-indicator-status" id="bioGasStatus">
                  <span class="status-icon safe">✓</span>
                  <span class="status-text">Safe Level - Fan OFF</span>
                </div>
              </div>

              <!-- Non-Biodegradable Gas Monitor -->
              <div class="gas-monitor-card">
                <div class="gas-card-header">
                  <span class="gas-type-label">🟦 Non-Biodegradable Compartment</span>
                  <span class="gas-reading" id="nonBioGasReading">38 PPM</span>
                </div>
                
                <div class="gas-threshold-bar">
                  <div class="threshold-marker" style="left: 80%; top: -8px;" title="Fan Activation Threshold">
                    <span class="threshold-label">Fan ON ⚡</span>
                  </div>
                  <div id="nonBioLevelBar" class="gas-bar-fill" style="background: linear-gradient(90deg, #3b82f6, #2563eb); width: 38%; transition: all 0.5s ease;"></div>
                  <span id="nonBioLevelPercent" class="gas-level-percent">38%</span>
                </div>

                <div class="gas-indicator-status" id="nonBioGasStatus">
                  <span class="status-icon safe">✓</span>
                  <span class="status-text">Safe Level - Fan OFF</span>
                </div>
              </div>

              <!-- Hazardous Gas Monitor -->
              <div class="gas-monitor-card">
                <div class="gas-card-header">
                  <span class="gas-type-label">🟥 Hazardous Compartment</span>
                  <span class="gas-reading" id="hazardGasReading">28 PPM</span>
                </div>
                
                <div class="gas-threshold-bar">
                  <div class="threshold-marker" style="left: 80%; top: -8px;" title="Fan Activation Threshold">
                    <span class="threshold-label">Fan ON ⚡</span>
                  </div>
                  <div id="hazardLevelBar" class="gas-bar-fill" style="background: linear-gradient(90deg, #ef4444, #dc2626); width: 28%; transition: all 0.5s ease;"></div>
                  <span id="hazardLevelPercent" class="gas-level-percent">28%</span>
                </div>

                <div class="gas-indicator-status" id="hazardGasStatus">
                  <span class="status-icon safe">✓</span>
                  <span class="status-text">Safe Level - Fan OFF</span>
                </div>
              </div>

              <!-- Gas System Info -->
              <div class="gas-system-info">
                <div class="info-item">
                  <span class="info-icon">⚡</span>
                  <div>
                    <span class="info-title">Fan Activation</span>
                    <span class="info-detail">Triggers at 80-90% gas level</span>
                  </div>
                </div>
                <div class="info-item">
                  <span class="info-icon">🌡️</span>
                  <div>
                    <span class="info-title">Temperature</span>
                    <span class="info-detail">Cooling System Active</span>
                  </div>
                </div>
                <div class="info-item">
                  <span class="info-icon">📊</span>
                  <div>
                    <span class="info-title">Overall Status</span>
                    <span class="info-detail">All compartments healthy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button class="slider-arrow prev" onclick="moveSlide(-1)">←</button>
        <button class="slider-arrow next" onclick="moveSlide(1)">→</button>
      </div>
    </div>
  </div>

  <!-- Settings Panel -->
  <div class="settings-panel" id="settingsPanel">
    <!-- PIN Unlock Screen -->
    <div class="pin-unlock-screen" id="pinUnlockScreen">
      <div class="pin-unlock-content">
        <h2>🔐 Unlock Settings</h2>
        <p>Enter your 4-digit PIN to access settings</p>
        
        <div class="pin-input-container">
          <input type="password" id="pinInput1" class="pin-input" maxlength="1" inputmode="numeric" placeholder="•" onkeyup="handlePinInput(event, 1)">
          <input type="password" id="pinInput2" class="pin-input" maxlength="1" inputmode="numeric" placeholder="•" onkeyup="handlePinInput(event, 2)">
          <input type="password" id="pinInput3" class="pin-input" maxlength="1" inputmode="numeric" placeholder="•" onkeyup="handlePinInput(event, 3)">
          <input type="password" id="pinInput4" class="pin-input" maxlength="1" inputmode="numeric" placeholder="•" onkeyup="handlePinInput(event, 4)">
        </div>
        
        <button class="btn-unlock-pin" onclick="verifyPin()">🔓 Unlock</button>
        
        <div class="pin-error-message" id="pinErrorMessage" style="display:none;">
          ❌ Invalid PIN. Please try again.
        </div>
        
        <p class="pin-hint">ℹ️ Use your Supervisor or Collector PIN from the admin account</p>
      </div>
    </div>

    <div class="settings-content" id="settingsContentPanel" style="display:none;">
      <button class="settings-close" onclick="closeSettings()">✕</button>
      <h2 class="settings-title">System Settings</h2>
      
      <!-- Tabs Navigation -->
      <div class="settings-tabs">
        <button class="settings-tab-btn active" onclick="switchSettingsTab('sensors')">Sensors</button>
        <button class="settings-tab-btn" onclick="switchSettingsTab('health')">Health & Security</button>
      </div>

      <!-- Sensors Tab -->
      <div id="sensors-tab" class="settings-tab active">
        <div class="settings-section">
          <!-- Camera Detection -->
          <div class="sensor-card">
            <div class="sensor-header">
              <h3>📷 Camera Detection</h3>
              <span class="sensor-status healthy">Active</span>
            </div>
            <p class="sensor-description">AI-powered detection accuracy for waste classification</p>
            <div class="setting-control">
              <label>Detection Confidence Threshold</label>
              <div class="slider-container">
                <input type="range" min="50" max="99" value="85" class="settings-slider" id="cameraThreshold" onchange="updateCameraThreshold(this.value)">
                <span class="slider-value" id="cameraThresholdValue">85%</span>
              </div>
            </div>
            <div class="setting-control">
              <label>Camera Resolution</label>
              <select class="settings-select">
                <option selected>640x480 (Default)</option>
                <option>800x600 (Higher Detail)</option>
                <option>1280x720 (Maximum Detail)</option>
              </select>
            </div>
            <div class="setting-info">
              ℹ️ Higher confidence reduces false positives but may miss some detections.
            </div>
          </div>

          <!-- Ultrasonic Sensor -->
          <div class="sensor-card">
            <div class="sensor-header">
              <h3>📏 Ultrasonic Sensor</h3>
              <span class="sensor-status healthy">Active</span>
            </div>
            <p class="sensor-description">Measures fill levels for Bio, Non-Bio, and Hazardous waste categories</p>
            <div class="setting-control">
              <label>Biodegradable Fill Alert Threshold</label>
              <div class="slider-container">
                <input type="range" min="50" max="100" value="80" class="settings-slider" id="bioThreshold" onchange="updateBioThreshold(this.value)">
                <span class="slider-value" id="bioThresholdValue">80%</span>
              </div>
            </div>
            <div class="setting-control">
              <label>Non-Biodegradable Fill Alert Threshold</label>
              <div class="slider-container">
                <input type="range" min="50" max="100" value="80" class="settings-slider" id="nonBioThreshold" onchange="updateNonBioThreshold(this.value)">
                <span class="slider-value" id="nonBioThresholdValue">80%</span>
              </div>
            </div>
            <div class="setting-control">
              <label>Hazardous Fill Alert Threshold</label>
              <div class="slider-container">
                <input type="range" min="50" max="100" value="75" class="settings-slider" id="hazardThreshold" onchange="updateHazardThreshold(this.value)">
                <span class="slider-value" id="hazardThresholdValue">75%</span>
              </div>
            </div>
            <div class="setting-info">
              ℹ️ Lower thresholds trigger alerts sooner. Adjust based on collection frequency.
            </div>
          </div>

          <!-- Gas Sensor -->
          <div class="sensor-card">
            <div class="sensor-header">
              <h3>💨 Gas Sensor</h3>
              <span class="sensor-status healthy">Active</span>
            </div>
            <p class="sensor-description">Monitors gas levels inside the trash bin and controls ventilation system</p>
            <div class="setting-control">
              <label>Gas Level Alert Threshold (PPM)</label>
              <div class="slider-container">
                <input type="range" min="100" max="500" value="300" class="settings-slider" id="gasThreshold" onchange="updateGasThreshold(this.value)">
                <span class="slider-value" id="gasThresholdValue">300 PPM</span>
              </div>
            </div>
            <div class="setting-control">
              <label>Fan Activation Level</label>
              <select class="settings-select">
                <option>Automatic (Smart Control)</option>
                <option selected>Manual Threshold</option>
                <option>Always On</option>
              </select>
            </div>
            <div class="setting-control">
              <label>Gas Sensor Sensitivity</label>
              <select class="settings-select">
                <option>Low Sensitivity</option>
                <option selected>Medium Sensitivity</option>
                <option>High Sensitivity</option>
              </select>
            </div>
            <div class="setting-info">
              ℹ️ Higher PPM thresholds mean more gas must accumulate before alerts trigger. Recommended: 250-350 PPM.
            </div>
          </div>
        </div>
      </div>

      <!-- Health & Security Tab -->
      <div id="health-tab" class="settings-tab">
        <div class="settings-section">
          <!-- System Health -->
          <div class="health-card">
            <h3>🏥 System Health</h3>
            <div class="health-metric">
              <div class="metric-info">
                <span class="metric-label">System Uptime</span>
                <span class="metric-detail">Last Reboot: 45 days ago</span>
              </div>
              <span class="metric-value healthy">Online</span>
            </div>
            <div class="health-metric">
              <div class="metric-info">
                <span class="metric-label">Detection Accuracy</span>
                <span class="metric-detail">Based on user feedback</span>
              </div>
              <span class="metric-value">87.5%</span>
            </div>
          </div>

          <!-- Sensor Maintenance -->
          <div class="health-card">
            <h3>🔧 Sensor Maintenance</h3>
            <div class="maintenance-item">
              <div class="maintenance-info">
                <span class="maintenance-label">Camera Detection</span>
                <span class="maintenance-detail">Last Calibrated: 30 days ago</span>
              </div>
              <button class="btn-calibrate">Calibrate Now</button>
            </div>
            <div class="maintenance-item">
              <div class="maintenance-info">
                <span class="maintenance-label">Ultrasonic Sensor</span>
                <span class="maintenance-detail">Last Calibrated: 60 days ago</span>
              </div>
              <button class="btn-calibrate">Calibrate Now</button>
            </div>
            <div class="maintenance-item">
              <div class="maintenance-info">
                <span class="maintenance-label">Gas Sensor</span>
                <span class="maintenance-detail">Last Calibrated: 15 days ago</span>
              </div>
              <button class="btn-calibrate">Calibrate Now</button>
            </div>
          </div>

          <!-- Manual Lid Control -->
          <div class="health-card">
            <h3>🚪 Manual Lid Control</h3>
            <p style="color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem;">Manually open the compartment lids for maintenance or emptying</p>
            
            <div class="lid-control-grid">
              <div class="lid-control-item">
                <div class="lid-icon" style="background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1)); color: #4CAF50;">🟩</div>
                <div class="lid-info">
                  <span class="lid-label">Biodegradable Lid</span>
                  <span class="lid-detail">Green compartment</span>
                </div>
                <div class="lid-buttons">
                  <button class="btn-open-lid" onclick="openLid('bio')">Open</button>
                  <button class="btn-close-lid" onclick="closeLid('bio')">Close</button>
                </div>
              </div>

              <div class="lid-control-item">
                <div class="lid-icon" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1)); color: #3b82f6;">🟦</div>
                <div class="lid-info">
                  <span class="lid-label">Non-Biodegradable Lid</span>
                  <span class="lid-detail">Blue compartment</span>
                </div>
                <div class="lid-buttons">
                  <button class="btn-open-lid" onclick="openLid('nonbio')">Open</button>
                  <button class="btn-close-lid" onclick="closeLid('nonbio')">Close</button>
                </div>
              </div>

              <div class="lid-control-item">
                <div class="lid-icon" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1)); color: #ef4444;">🟥</div>
                <div class="lid-info">
                  <span class="lid-label">Hazardous Lid</span>
                  <span class="lid-detail">Red compartment</span>
                </div>
                <div class="lid-buttons">
                  <button class="btn-open-lid" onclick="openLid('hazard')">Open</button>
                  <button class="btn-close-lid" onclick="closeLid('hazard')">Close</button>
                </div>
              </div>
            </div>

            <div class="lid-warning" style="margin-top: 1.5rem;">
              ⚠️ Ensure the bin is stable before opening lids. Only open when necessary for maintenance or emptying.
            </div>
          </div>

          <!-- System Info -->
          <div class="health-card">
            <h3>ℹ️ System Information</h3>
            <div class="info-row">
              <span class="info-label">Firmware Version</span>
              <span class="info-value">v2.1.0</span>
            </div>
            <div class="info-row">
              <span class="info-label">Hardware Version</span>
              <span class="info-value">ESP32-CAM Rev2</span>
            </div>
            <div class="info-row">
              <span class="info-label">System ID</span>
              <span class="info-value">BINBOT-2026-001</span>
            </div>
            <div class="info-row">
              <span class="info-label">Last Update</span>
              <span class="info-value">April 2, 2026</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="settings-actions">
        <button class="btn-reset" onclick="resetToDefaults()">Reset to Defaults</button>
        <button class="btn-save" onclick="saveSettings()">Save Changes</button>
      </div>
    </div>
  </div>

  <!-- Daily Time Bubble -->
  <div class="daily-time-bubble" id="dailyTimeBubble">
    <div class="time-display">
      <div class="month-section">
        <span id="currentMonthNumber">04</span>
      </div>
      <div class="date-info">
        <span id="currentDayOfWeek">Monday</span>
        <span id="floatingMonth">April</span>
        <span id="currentDay">07</span>
      </div>
      <div class="time-info">
        <span id="currentTime">00:00:00</span>
      </div>
    </div>
  </div>

  <!-- Custom Lid Control Modals -->
  <div class="modal-overlay" id="lidModalOverlay"></div>
  
  <!-- Open Lid Modal -->
  <div class="modal-dialog" id="openLidModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>🚪 Open Compartment Lid</h2>
        <button class="modal-close" onclick="closeLidModal()">×</button>
      </div>
      <div class="modal-body">
        <p id="openLidText"></p>
        <div class="modal-warning">⚠️ Make sure the bin is stable before opening!</div>
      </div>
      <div class="modal-footer">
        <button class="btn-modal-secondary" onclick="closeLidModal()">Cancel</button>
        <button class="btn-modal-primary" id="confirmOpenBtn" onclick="confirmOpenLid()">Open Lid</button>
      </div>
    </div>
  </div>

  <!-- Close Lid Modal -->
  <div class="modal-dialog" id="closeLidModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>🚪 Close Compartment Lid</h2>
        <button class="modal-close" onclick="closeLidModal()">×</button>
      </div>
      <div class="modal-body">
        <p id="closeLidText"></p>
        <div class="modal-warning">⚠️ Make sure nothing is in the way!</div>
      </div>
      <div class="modal-footer">
        <button class="btn-modal-secondary" onclick="closeLidModal()">Cancel</button>
        <button class="btn-modal-primary" id="confirmCloseBtn" onclick="confirmCloseLid()">Close Lid</button>
      </div>
    </div>
  </div>

  <!-- Locked Bin Modal -->
  <div class="modal-dialog" id="lockedBinModal">
    <div class="modal-content">
      <div class="modal-header modal-header-locked">
        <h2>🔒 Bin is Locked</h2>
        <button class="modal-close" onclick="closeLidModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="locked-icon">🔴</div>
        <p id="lockedBinText"></p>
        <div class="modal-info">
          <strong>Why is it locked?</strong><br>
          This compartment has reached maximum capacity and is automatically locked for safety.
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-modal-primary" onclick="closeLidModal()">Understand</button>
      </div>
    </div>
  </div>

  <!-- Success Modal -->
  <div class="modal-dialog" id="successModal">
    <div class="modal-content">
      <div class="modal-header modal-header-success">
        <h2>✅ Success</h2>
        <button class="modal-close" onclick="closeLidModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="success-icon">✓</div>
        <p id="successText"></p>
      </div>
      <div class="modal-footer">
        <button class="btn-modal-primary" onclick="closeLidModal()">OK</button>
      </div>
    </div>
  </div>
</main>

<script src="Binbot.js"></script>
</body>
</html>
 