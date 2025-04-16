<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>M&A Simulation Tool</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h2, h3, h4 { margin-bottom: 10px; }
    .section {
      margin-bottom: 30px;
      padding: 15px;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 10px;
    }
    .input-group {
      display: flex;
      flex-direction: column;
      min-width: 130px;
    }
    .input-group label {
      font-weight: bold;
      font-size: 12px;
      margin-bottom: 3px;
    }
    .input-pair {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 4px;
    }
    .input-pair span {
      width: 70px;
      font-size: 11px;
      text-align: right;
    }
    .input-pair input,
    .input-group input {
      width: 60px;
      padding: 3px;
      font-size: 11px;
    }
    .toggle-btn {
      font-size: 14px;
      cursor: pointer;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .collapsed { display: none; }
    .summary-block {
      background-color: #eef2f7;
      border: 1px solid #ccd;
      padding: 10px;
      margin-top: 8px;
      border-radius: 4px;
      font-size: 13px;
    }
    button {
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      border: 1px solid #999;
      border-radius: 4px;
      background-color: #f4f4f4;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-top: 15px;
    }
    table th, table td {
      border: 1px solid #ccc;
      padding: 8px 14px;
      text-align: right;
      font-size: 13px;
      min-width: 70px;
    }
    table th {
      background-color: #f2f2f2;
      text-align: center;
    }
    .table-wrapper .toggle-btn {
      cursor: pointer;
      font-weight: bold;
      margin-bottom: 5px;
      font-size: 13px;
    }
    .table-wrapper .collapsed {
      display: none;
    }

    .chart-card {
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 12px;
      padding: 15px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      flex: 1 1 calc(50% - 20px);
      min-width: 300px;
    }
    .chart-card canvas {
      width: 100% !important;
      height: 350px !important;
    }

  </style>

<!-- Plotly -->
<script src="https://cdn.plot.ly/plotly-2.26.0.min.js"></script>





</head>
<body>
  <h2>M&A Simulation Tool – Accounting Firm Rollup</h2>
  <div class="section">
    <h3>Macro Inputs</h3>
    <div class="row">
      <div class="input-group"><label>Price Adjustment Rate (%)</label><input type="number" id="inflation" value="3"></div>
      <div class="input-group"><label>Cost Adjustment Rate (%)</label><input type="number" id="cost_inflation" value="3"></div>
      <div class="input-group"><label>Interest Rate (%)</label><input type="number" id="interest" value="5"></div>
<!--  <div class="input-group"><label>Revenue Growth Rate (%)</label><input type="number" id="growth" value="6"></div> -->
    </div>
  </div>

  <div class="section">
    <h3>Parameters</h3>

    <!-- Archetypes -->
    <div class="section" style="background-color:#fafafa;">
      <h4>Companies Archetype (Estimated %)</h4>
      <div class="row">
        <div class="input-group"><label>Single Owner (%)</label><input type="number" id="arch_single" value="80"></div>
        <div class="input-group"><label>Small Firm (%)</label><input type="number" id="arch_small" value="15"></div>
        <div class="input-group"><label>Mid Firm (%)</label><input type="number" id="arch_mid" value="5"></div>
        <div class="input-group"><label># of Companies</label><input type="number" id="num_companies" value="10" min="1" max="50"></div>
        <div class="input-group"><label>&nbsp;</label><button id="generateCompaniesBtn">Generate Companies</button></div>
      </div>
    </div>

    <!-- Target Companies -->
    <div class="section" style="background-color:#f9f9f9;">
      <h4>Target Companies</h4>
      <div class="row">
        <button id="collapseToSingleLineBtn" onclick="toggleCollapsedBlock()">Toggle All Companies</button>
        <button onclick="toggleAllCompanies()">Toggle Companies</button>
      </div>

      <!-- Collapsed Summary Block -->
      <div id="collapsedCompanies" class="collapsed">
        <div class="summary-block" id="collapsedSummary">
          Companies (collapsed view) – <span id="companyCount">0 companies</span>
        </div>
      </div>

      <div id="companies-container"></div>
    </div>
  </div>

      <!-- Collapsed Summary Block -->
      <div class="section" style="background-color:#f4f4ff;">
        <h3>Financing</h3>
      
        <div class="row">
          <div class="input-group">
            <label>SF Capital Left ($K)</label>
            <input id="sf_capital_left" type="number" value="400" />
          </div>
          <div class="input-group">
            <label>Initial Cash Available BS ($K)</label>
            <input id="initial_cash" type="number" value="300" />
          </div>

        </div>
      
        <div id="financing-strategy-container" class="table-wrapper"></div>

      </div>
      



  <!-- Simulation & Results -->
  <div class="section">
    <h3>Simulation & Results</h3>
    <div class="row">
      <button id="runSimBtn">Run Simulation</button>
    </div>
    <div id="resultsTable"></div>
  </div>

  <!-- Charts -->
  <div class="section" id="chartsSection" style="display: none;">
    <h3>Charts</h3>
    <div id="chartsContainer" style="display: flex; flex-wrap: wrap; gap: 20px;">
      <!-- Row 1 -->
      <div class="chart-card" style="flex: 1 1 45%;">
        <div id="ebitdaBoxPlot" style="width:100%; height:450px;"></div>
      </div>
      <div class="chart-card" style="flex: 1 1 45%;">
          <div id="ebitdaBandChart" style="width:100%; height:450px;"></div>
      </div>

      <!-- Row 2 -->
      <div class="chart-card" style="flex: 1 1 45%;">
        <div id="finalYearHistogram" style="width:100%; height:450px;"></div>
      </div>
      <div class="chart-card" style="flex: 1 1 45%;">
        <div id="cdfChart" style="width:100%; height:450px;"></div>
      </div>
      

      <!-- Row 3 -->
      <div class="chart-card" style="flex: 1 1 45%;">
          <div id="valuationAndCashChart" style="width:100%; height:450px;"></div>
      </div>
      <div class="chart-card" style="flex: 1 1 45%;">
          <div id="valuationByCompanyChart" style="width:100%; height:450px;"></div>
      </div>

      <!-- Row 4 -->
      <div class="chart-card" style="flex: 1 1 45%;">
          <div id="equityByYearChart" style="height: 450px;"></div>
      </div>
      <div class="chart-card" style="flex: 1 1 45%;">
        <div id="dscrByYearChart" style="width:100%; height:450px;"></div>
      </div>

      <!-- Row 5 -->
      <div class="chart-card" style="flex: 1 1 45%;">
          <div id="debtByYearChart" style="width:100%;height:450px;"></div>
      </div>
      <div class="chart-card" style="flex: 1 1 45%;">
        <div id="debtByCompanyChart" style="width:100%; height:450px;"></div>
      </div>

      <!-- Row 6 -->
      <div class="chart-card" style="flex: 1 1 45%;">
        <div id="debtCDFChart" style="width:100%; height:450px;"></div>
      </div>
      <div class="chart-card" style="flex: 1 1 45%;">
        <div id="opsCashCDFChart" style="width:100%; height:450px;"></div>
      </div>

    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/gh/rafaelh194/ma-simulation@v1.593/ma-simulation.js" defer></script>




</body>
</html>
