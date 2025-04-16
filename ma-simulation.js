const archetypes = ['Single Owner', 'Small Firm', 'Mid Firm'];
let allCollapsed = false;
let collapsedView = false;

const archetypeDefaults = {
	'Single Owner': {
		revenue_comp: {
			personal: [30, 60],
			corp: [10, 20],
			rec: [10, 40],
			adhoc: [5, 15]
		},
		revenue: {
			min: 800,
			ml: 1000,
			max: 1400
		},
		ebitda: {
			min: 35,
			ml: 40,
			max: 45
		},
		multiple: {
			avg: 3,
			std: 0.75
		},
		synergies: {
			cross: [5, 0.5],
			price: [5, 0.5],
			churn: [5, 0.5],
			tech: [5, 0.5],
			shared: [5, 0.5],
			facility: [5, 0.5]
		},
		rollover: {
			min: 0,
			ml: 10,
			max: 20
		},
		earnout: {
			min: 0,
			ml: 5,
			max: 10,
			years: 2
		},
		sellerFin: {
			min: 0,
			ml: 0,
			max: 10,
			rate: 5,
			term: 60
		},
		extra_exp: 0,
		timing: {
			year: 2025,
			month: 1
		}
	},


	'Small Firm': {
		revenue_comp: {
			personal: [30, 60],
			corp: [10, 20],
			rec: [10, 40],
			adhoc: [5, 15]
		},
		revenue: {
			min: 1400,
			ml: 2000,
			max: 2600
		},
		ebitda: {
			min: 30,
			ml: 35,
			max: 40
		},
		multiple: {
			avg: 4,
			std: 0.75
		},
		synergies: {
			cross: [5, 0.5],
			price: [5, 0.5],
			churn: [5, 0.5],
			tech: [5, 0.5],
			shared: [5, 0.5],
			facility: [5, 0.5]
		},
		rollover: {
			min: 0,
			ml: 10,
			max: 20
		},
		earnout: {
			min: 0,
			ml: 5,
			max: 10,
			years: 2
		},
		sellerFin: {
			min: 0,
			ml: 0,
			max: 10,
			rate: 5,
			term: 60
		},
		extra_exp: 0,
		timing: {
			year: 2025,
			month: 1
		}
	},
	'Mid Firm': {
		revenue_comp: {
			personal: [30, 60],
			corp: [10, 20],
			rec: [10, 40],
			adhoc: [5, 15]
		},
		revenue: {
			min: 3000,
			ml: 4000,
			max: 5000
		},
		ebitda: {
			min: 28,
			ml: 33,
			max: 38
		},
		multiple: {
			avg: 5,
			std: 0.75
		},
		synergies: {
			cross: [5, 0.5],
			price: [5, 0.5],
			churn: [5, 0.5],
			tech: [5, 0.5],
			shared: [5, 0.5],
			facility: [5, 0.5]
		},
		rollover: {
			min: 0,
			ml: 10,
			max: 20
		},
		earnout: {
			min: 0,
			ml: 5,
			max: 10,
			years: 2
		},
		sellerFin: {
			min: 0,
			ml: 0,
			max: 10,
			rate: 5,
			term: 60
		},
		extra_exp: 0,
		timing: {
			year: 2025,
			month: 1
		}
	},
};

function generateCompanies() {
	const single = parseFloat(document.getElementById('arch_single').value) || 0;
	const small = parseFloat(document.getElementById('arch_small').value) || 0;
	const mid = parseFloat(document.getElementById('arch_mid').value) || 0;
	const total = single + small + mid;

	const weights = [single / total, small / total, mid / total];
	const numCompanies = parseInt(document.getElementById('num_companies').value) || 10;

	const container = document.getElementById('companies-container');
	container.innerHTML = '';

	let startYear = 2025;
	let startMonth = 7; // July
	let lastAcqYear = startYear;
	let lastAcqMonth = startMonth;

	function randomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function addMonths(year, month, offset) {
		const totalMonths = (year * 12 + (month - 1)) + offset;
		const newYear = Math.floor(totalMonths / 12);
		const newMonth = (totalMonths % 12) + 1;
		return {
			year: newYear,
			month: newMonth
		};
	}



	for (let i = 0; i < numCompanies; i++) {
		const rand = Math.random();
		let acqYear, acqMonth;
		let type;

		if (i === 0) {
			acqYear = 2025;
			acqMonth = 7; // July
		} else {
			const monthOffset = randomInt(5, 7);
			const next = addMonths(lastAcqYear, lastAcqMonth, monthOffset);
			acqYear = next.year;
			acqMonth = next.month;
			lastAcqYear = acqYear;
			lastAcqMonth = acqMonth;
		}

		if (rand < weights[0]) type = 'Single Owner';
		else if (rand < weights[0] + weights[1]) type = 'Small Firm';
		else type = 'Mid Firm';

		container.innerHTML += createCompanyBlock(i, type, archetypeDefaults[type], acqYear, acqMonth);
	}

	document.getElementById('companyCount').innerText = `${numCompanies} companies`;
	document.getElementById('companies-container').style.display = 'block';
	document.getElementById('collapsedCompanies').classList.add('collapsed');
	collapsedView = false;
	document.getElementById('collapseToSingleLineBtn').innerText = "Toggle All Companies";

	generateFinancingStrategy(numCompanies);
}


function generateFinancingStrategy(simulationStartYear = 2025) {
	const container = document.getElementById("financing-strategy-container");
	container.innerHTML = '';

	const numCompanies = document.getElementById('companies-container').children.length;

	let row = document.createElement('div');
	row.className = 'row';

	for (let i = 0; i < numCompanies; i++) {
		const year = simulationStartYear;
		const card = document.createElement('div');
		card.className = 'section';
		card.style.backgroundColor = 'white';
		card.style.flex = '1 1 300px';
		card.innerHTML = `
      <h4>Source – Acq. ${i + 1}</h4>
      <div class="row">
        <!-- Column 1 -->
        <div class="input-group">
          <label>Min. Req. DSCR</label>
          <input id="fund_dscr_min_${i}" type="number" value="2" step="0.1">
        </div>
        <div class="input-group">
          <label>Debt Min (%)</label>
          <input id="fund_debt_min_${i}" type="number" value="0">
        </div>
        <div class="input-group">
          <label>Debt ML (%)</label>
          <input id="fund_debt_ml_${i}" type="number" value="30">
        </div>
        <div class="input-group">
          <label>Debt Max (%)</label>
          <input id="fund_debt_max_${i}" type="number" value="100">
        </div>
      </div>
      <div class="row">
        <!-- Column 2 -->
        <div class="input-group">
          <label>Rate (%)</label>
          <input id="fund_rate_${i}" type="number" value="8">
        </div>
        <div class="input-group">
          <label>Transaction Fee (%)</label>
          <input id="fund_fee_${i}" type="number" value="2">
        </div>
        <div class="input-group">
          <label>Term (mo)</label>
          <input id="fund_term_${i}" type="number" value="72">
        </div>
        <div class="input-group">
          <label>Min OP Cash ($K)</label>
          <input id="fund_cash_min_${i}" type="number" value="100">
        </div>
      </div>
    `;
		row.appendChild(card);
	}

	container.appendChild(row);
}

function createCompanyBlock(i, type, defaults, acqYear, acqMonth) {
	return `
    <div class="section company-block">
      <div class="toggle-btn" onclick="toggleCompany(${i})" id="toggle${i}">− Company ${i + 1} (${type})</div>
      <div class="company-fields" id="companyFields${i}">
        <div class="row">
          <div class="input-group">
            <label>Revenue % Composition</label>
            <div class="input-pair"><span>Personal</span><input id="c${i}_personal_min" value="${defaults.revenue_comp.personal[0]}" />
              <input id="c${i}_personal_max" value="${defaults.revenue_comp.personal[1]}" /></div>
            <div class="input-pair"><span>Corporate</span><input id="c${i}_corp_min" value="${defaults.revenue_comp.corp[0]}" />
            <input id="c${i}_corp_max" value="${defaults.revenue_comp.corp[1]}" /></div>
            <div class="input-pair"><span>Recurrent</span><input id="c${i}_rec_min" value="${defaults.revenue_comp.rec[0]}" />
            <input id="c${i}_rec_max" value="${defaults.revenue_comp.rec[1]}" /></div>
            <div class="input-pair"><span>Ad Hoc</span><input id="c${i}_adhoc_min" value="${defaults.revenue_comp.adhoc[0]}" />
            <input id="c${i}_adhoc_max" value="${defaults.revenue_comp.adhoc[1]}" /></div>
          </div>
          <div class="input-group">
            <label>Revenue ($K)</label>
            <div class="input-pair"><span>Min</span><input id="c${i}_rev_min" value="${defaults.revenue.min}" /></div>
            <div class="input-pair"><span>Most Likely</span><input id="c${i}_rev_ml" value="${defaults.revenue.ml}" /></div>
            <div class="input-pair"><span>Max</span><input id="c${i}_rev_max" value="${defaults.revenue.max}" /></div>
          </div>
          <div class="input-group">
            <label>EBITDA (%)</label>
            <div class="input-pair"><span>Min</span><input id="c${i}_ebitda_min" value="${defaults.ebitda.min}" /></div>
            <div class="input-pair"><span>Most Likely</span><input id="c${i}_ebitda_ml" value="${defaults.ebitda.ml}" /></div>
            <div class="input-pair"><span>Max</span><input id="c${i}_ebitda_max" value="${defaults.ebitda.max}" /></div>
          </div>
          <div class="input-group">
            <label>Entry Multiple</label>
            <div class="input-pair"><span>Avg</span><input id="c${i}_entry_avg" value="${defaults.multiple.avg}" /></div>
            <div class="input-pair"><span>SD</span><input id="c${i}_entry_std" value="${defaults.multiple.std}" /></div>
          </div>
          ${Object.entries(defaults.synergies).map(([metric, [avg, std]]) => `
            <div class="input-group">
              <label>${metric.charAt(0).toUpperCase() + metric.slice(1)} (%)</label>
              <div class="input-pair"><span>Avg</span><input id="c${i}_${metric}_avg" value="${avg}" /></div>
              <div class="input-pair"><span>SD</span><input id="c${i}_${metric}_std" value="${std}" /></div>
            </div>
          `).join('')}
          <div class="input-group">
            <label>Rollover (%)</label>
            <div class="input-pair"><span>Min</span><input id="c${i}_rollover_min" value="${defaults.rollover.min}" /></div>
            <div class="input-pair"><span>ML</span><input id="c${i}_rollover_ml" value="${defaults.rollover.ml}" /></div>
            <div class="input-pair"><span>Max</span><input id="c${i}_rollover_max" value="${defaults.rollover.max}" /></div>
          </div>

          <div class="input-group">
            <label>Earnout (% of EV)</label>
            <div class="input-pair"><span>Min</span><input id="c${i}_earnout_min" value="${defaults.earnout.min}" /></div>
            <div class="input-pair"><span>ML</span><input id="c${i}_earnout_ml" value="${defaults.earnout.ml}" /></div>
            <div class="input-pair"><span>Max</span><input id="c${i}_earnout_max" value="${defaults.earnout.max}" /></div>
            <div class="input-pair"><span>Pay Over (yrs)</span><input id="c${i}_earnout_years" value="${defaults.earnout.years}" /></div>
          </div>

          <div class="input-group">
            <label>Seller Financing (% of EV)</label>
            <div class="input-pair"><span>Min</span><input id="c${i}_seller_min" value="${defaults.sellerFin.min}" /></div>
            <div class="input-pair"><span>ML</span><input id="c${i}_seller_ml" value="${defaults.sellerFin.ml}" /></div>
            <div class="input-pair"><span>Max</span><input id="c${i}_seller_max" value="${defaults.sellerFin.max}" /></div>
            <div class="input-pair"><span>Interest (%)</span><input id="c${i}_seller_rate" value="${defaults.sellerFin.rate}" /></div>
            <div class="input-pair"><span>Term (mo)</span><input id="c${i}_seller_term" value="${defaults.sellerFin.term || 60}" /></div>
          </div>  


          <div class="input-group">
            <label>Extra Expenses ($)</label>
            <div class="input-pair"><span>Cost</span><input id="c${i}_extra_exp" value="${defaults.extra_exp}" /></div>
          </div>
          <div class="input-group">
            <label>Acquisition Timing</label>
            <div class="input-pair"><span>Year</span><input id="c${i}_year" value="${acqYear}" /></div>
            <div class="input-pair"><span>Month</span><input id="c${i}_month" value="${acqMonth}" /></div>
          </div>
        </div>
      </div>
    </div>`;
}

function toggleAllCompanies() {
	allCollapsed = !allCollapsed;
	const count = document.getElementById('companies-container').children.length;
	for (let i = 0; i < count; i++) toggleCompany(i, true);
}

function toggleCompany(i, force = false) {
	const fields = document.getElementById(`companyFields${i}`);
	const btn = document.getElementById(`toggle${i}`);
	const isCollapsed = fields.classList.contains('collapsed');
	const collapse = force ? allCollapsed : !isCollapsed;
	fields.classList.toggle('collapsed', collapse);
	btn.innerText = (collapse ? '+' : '−') + ` Company ${i + 1}`;
}

function toggleCollapsedBlock() {
	collapsedView = !collapsedView;
	const block = document.getElementById("collapsedCompanies");
	const container = document.getElementById("companies-container");
	const btn = document.getElementById("collapseToSingleLineBtn");

	if (collapsedView) {
		block.classList.remove("collapsed");
		container.style.display = "none";
		btn.innerText = "+ Toggle All Companies";
	} else {
		block.classList.add("collapsed");
		container.style.display = "block";
		btn.innerText = "- Toggle All Companies";
	}
}

function sampleTriangular(min, mode, max) {
	const u = Math.random();
	return u < (mode - min) / (max - min) ?
		min + Math.sqrt(u * (max - min) * (mode - min)) :
		max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

function sampleNormal(mean, std) {
	let u = 0,
		v = 0;
	while (u === 0) u = Math.random(); // Convert [0,1) to (0,1)
	while (v === 0) v = Math.random();
	const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
	return mean + std * z;
}

///// CHARTS

function renderCharts(
	summary,
	revenueTotals,
	costTotals,
	ebitdaTotals,
	ebitdaAnnualRuns,
	valuationRunsByYear,
	cashByYear,
	companyRunData,
	sellerDebtScheduleByCompany,
	debtScheduleByCompany,
	equityPerYear,
	equityPerCompany,
	debtUsedByYear,
	opsCashUsedByYear,
	cashRequiredRuns,
	numCompanies,
    debtUsedByCompany,
    dscrByYear,
	years,
	months
) {
	const simulationStartYear = 2025;
	const yearLabels = summary.map((_, i) => (simulationStartYear + i).toString());

	const p10 = summary.map(r => r.p10);
	const p50 = summary.map(r => r.p50);
	const p90 = summary.map(r => r.p90);

	Plotly.newPlot("ebitdaBandChart", [{
			x: yearLabels,
			y: p90,
			name: "P90",
			type: "scatter",
			line: {
				color: "rgba(75, 192, 192, 1)"
			},
			fill: "tonexty"
		},
		{
			x: yearLabels,
			y: p50,
			name: "P50",
			type: "scatter",
			line: {
				color: "rgba(54, 162, 235, 1)"
			},
			fill: "tonexty"
		},
		{
			x: yearLabels,
			y: p10,
			name: "P10",
			type: "scatter",
			line: {
				color: "rgba(255, 99, 132, 1)"
			}
		}
	], {
		title: "EBITDA Monte Carlo Range (P10–P90)",
		yaxis: {
			title: "EBITDA ($)"
		},
		margin: {
			t: 50
		}
	});

	const finalYearIndex = summary.length - 1;
	const finalValues = ebitdaAnnualRuns.map(run => run[finalYearIndex]);

	Plotly.newPlot("finalYearHistogram", [{
		x: finalValues,
		type: "histogram",
		nbinsx: 20,
		marker: {
			color: "rgba(153, 102, 255, 0.6)",
			line: {
				width: 1,
				color: "rgba(153, 102, 255, 1)"
			}
		}
	}], {
		title: "Final Year EBITDA Distribution",
		xaxis: {
			title: "EBITDA ($)",
			tickformat: ",",
			automargin: true
		},
		yaxis: {
			title: "Count"
		},
		bargap: 0.1,
		margin: {
			t: 60,
			b: 60,
			l: 60,
			r: 40
		}
	});

	const sorted = [...finalValues].sort((a, b) => a - b);
	const cdf = sorted.map((v, i) => ({
		x: v,
		y: (i + 1) / sorted.length
	}));

	Plotly.newPlot("cdfChart", [{
		x: cdf.map(p => p.x),
		y: cdf.map(p => p.y),
		type: "scatter",
		mode: "lines",
		line: {
			color: "rgba(255, 159, 64, 1)"
		}
	}], {
		title: "Cumulative Probability – Final Year EBITDA (CDF)",
		xaxis: {
			title: "EBITDA ($)"
		},
		yaxis: {
			title: "Probability",
			range: [0, 1]
		},
		margin: {
			t: 50
		}
	});

	const boxData = summary.map((_, yearIdx) => {
		const yearValues = ebitdaAnnualRuns.map(run => run[yearIdx]);
		return {
			y: yearValues,
			type: 'box',
			name: `${simulationStartYear + yearIdx}`,
			boxpoints: false,
			width: 0.6,
			marker: {
				color: 'rgba(0, 123, 255, 0.6)'
			},
			line: {
				color: 'rgba(0, 123, 255, 1)'
			}
		};
	});

	Plotly.newPlot("ebitdaBoxPlot", boxData, {
		title: "Annual EBITDA",
		yaxis: {
			title: "EBITDA ($)",
			zeroline: false
		},
		margin: {
			t: 80
		},
		boxmode: "group"
	});

	const valuationBoxPlots = valuationRunsByYear.map((vals, yearIdx) => ({
		y: vals,
		type: 'box',
		name: `${simulationStartYear + yearIdx}`,
		boxpoints: false,
		width: 0.5,
		marker: {
			color: 'rgba(40, 167, 69, 0.6)'
		},
		line: {
			color: 'rgba(40, 167, 69, 1)'
		}
	}));

	Plotly.newPlot("valuationAndCashChart", valuationBoxPlots, {
		title: "Valuation Distribution by Acquisition Year",
		yaxis: {
			title: "Valuation ($)"
		},
		margin: {
			t: 60
		},
		boxmode: "group"
	});


	const debtBoxByYear = debtUsedByYear.map((vals, idx) => ({
		y: vals,
		type: 'box',
		name: `Year ${simulationStartYear + idx}`,
		boxpoints: false,
		width: 0.5
	}));

	Plotly.newPlot("debtByYearChart", debtBoxByYear, {
		title: "Debt Used by Year",
		yaxis: {
			title: "Debt ($)"
		}
	});

    const dscrBoxByYear = dscrByYear.map((vals, idx) => ({
        y: vals,
        type: 'box',
        name: `${simulationStartYear + idx}`,
        boxpoints: false,
        width: 0.5,
        marker: {
            color: 'rgba(255, 206, 86, 0.6)'
        },
        line: {
            color: 'rgba(255, 206, 86, 1)'
        }
    }));
    
    Plotly.newPlot("dscrByYearChart", dscrBoxByYear, {
        title: "DSCR by Year",
        yaxis: {
            title: "DSCR"
        },
        margin: {
            t: 60
        }
    });


    const debtBoxByCompany = debtUsedByCompany.map((vals, idx) => ({
        y: vals,
        type: 'box',
        name: `Company ${idx + 1}`,
        boxpoints: false,
        width: 0.5,
        marker: {
            color: 'rgba(54, 162, 235, 0.6)'
        },
        line: {
            color: 'rgba(54, 162, 235, 1)'
        }
    }));
    
    Plotly.newPlot("debtByCompanyChart", debtBoxByCompany, {
        title: "Debt Used by Company",
        yaxis: {
            title: "Debt Used ($)"
        },
        margin: {
            t: 60
        },
        boxmode: "group"
    });



	// Clear previous export buttons if they exist
	const chartsSection = document.getElementById("chartsSection");
	const prevButtons = chartsSection.querySelectorAll(".export-btn");
	prevButtons.forEach(btn => btn.remove());

	// Create Company CSV Export button
	const exportAllBtn = document.createElement("button");
	exportAllBtn.textContent = "Export Companies Data CSV";
	exportAllBtn.className = "export-btn";
	exportAllBtn.onclick = () => exportCompanyRunDataCSV(companyRunData);
	chartsSection.appendChild(exportAllBtn);

	// Create Debt CSV Export button
	const exportAllDebtBtn = document.createElement("button");
	exportAllDebtBtn.textContent = "Export Debt Data CSV";
	exportAllDebtBtn.className = "export-btn";
	exportAllDebtBtn.onclick = () => exportDebtSchedulesCSV(sellerDebtScheduleByCompany, debtScheduleByCompany, numCompanies, years, months);
	chartsSection.appendChild(exportAllDebtBtn);

    	// Create Debt CSV Export button
	const exportAllDebtKPIBtn = document.createElement("button");
	exportAllDebtKPIBtn.textContent = "Export Debt KPI's Data CSV";
	exportAllDebtKPIBtn.className = "export-btn";
	exportAllDebtKPIBtn.onclick = () => exportKPIDataCSV(companyRunData, equityPerCompany, debtUsedByCompany, dscrByYear, numCompanies, NUM_RUNS);
	chartsSection.appendChild(exportAllDebtKPIBtn);



	// Valuation by Company (All Runs)
	const companyValuations = {};

	companyRunData.forEach(row => {
		const companyId = `Company ${row.company}`;
		const val = parseFloat(row.valuation);
		if (!companyValuations[companyId]) companyValuations[companyId] = [];
		companyValuations[companyId].push(val);
	});

	const valuationBoxPerCompany = Object.keys(companyValuations).map(companyId => ({
		y: companyValuations[companyId],
		type: 'box',
		name: companyId,
		boxpoints: false,
		width: 0.5,
		marker: {
			color: 'rgba(0, 0, 0, 0.6)'
		},
		line: {
			color: 'rgba(0, 0, 0, 1)'
		}
	}));

	Plotly.newPlot("valuationByCompanyChart", valuationBoxPerCompany, {
		title: "Valuation Distribution by Company",
		yaxis: {
			title: "Valuation ($)"
		},
		margin: {
			t: 60
		},
		boxmode: "group"
	});


	// For boxplot per year
	const equityBoxByYear = equityPerYear.map((vals, idx) => ({
		y: vals,
		type: 'box',
		name: `${simulationStartYear + idx}`,
		boxpoints: false,
		width: 0.5
	}));
	Plotly.newPlot("equityByYearChart", equityBoxByYear, {
		title: "Equity Injection Required by Year",
		yaxis: {
			title: "Equity ($)"
		}
	});

	// For boxplot per company
	const equityBoxByCompany = equityPerCompany.map((vals, idx) => ({
		y: vals,
		type: 'box',
		name: `Company ${idx + 1}`,
		boxpoints: false,
		width: 0.5
	}));
	Plotly.newPlot("equityByCompanyChart", equityBoxByCompany, {
		title: "Equity Required by Company",
		yaxis: {
			title: "Equity ($)"
		}
	});

	// Debt Used – CDF
	const totalDebtPerRun = debtUsedByYear[0].map((_, runIdx) =>
		debtUsedByYear.reduce((sum, yearArray) => sum + yearArray[runIdx], 0)
	);
	const debtCDFSorted = [...totalDebtPerRun].sort((a, b) => a - b);
	const debtCDF = debtCDFSorted.map((val, idx) => ({
		x: val,
		y: (idx + 1) / totalDebtPerRun.length
	}));

	Plotly.newPlot("debtCDFChart", [{
		x: debtCDF.map(p => p.x),
		y: debtCDF.map(p => p.y),
		type: "scatter",
		mode: "lines",
		line: {
			color: "rgba(54, 162, 235, 1)"
		}
	}], {
		title: "Cumulative Distribution – Total Debt Used",
		xaxis: {
			title: "Total Debt ($)"
		},
		yaxis: {
			title: "Probability",
			range: [0, 1]
		},
		margin: {
			t: 60
		}
	});

	// Equity Required – CDF
	const totalEquityPerRun = equityPerYear[0].map((_, runIdx) =>
		equityPerYear.reduce((sum, yearArray) => sum + yearArray[runIdx], 0)
	);
	const equityCDFSorted = [...totalEquityPerRun].sort((a, b) => a - b);
	const equityCDF = equityCDFSorted.map((val, idx) => ({
		x: val,
		y: (idx + 1) / totalEquityPerRun.length
	}));

	Plotly.newPlot("equityCDFChart", [{
		x: equityCDF.map(p => p.x),
		y: equityCDF.map(p => p.y),
		type: "scatter",
		mode: "lines",
		line: {
			color: "rgba(255, 99, 132, 1)"
		}
	}], {
		title: "Cumulative Distribution – Total Equity Required",
		xaxis: {
			title: "Total Equity ($)"
		},
		yaxis: {
			title: "Probability",
			range: [0, 1]
		},
		margin: {
			t: 60
		}
	});

	const totalOpsCashPerRun = opsCashUsedByYear[0].map((_, runIdx) =>
		opsCashUsedByYear.reduce((sum, yearArray) => sum + yearArray[runIdx], 0)
	);

	const sortedOps = [...totalOpsCashPerRun].sort((a, b) => a - b);
	const opsCDF = sortedOps.map((val, idx) => ({
		x: val,
		y: (idx + 1) / NUM_RUNS
	}));

	Plotly.newPlot("opsCashCDFChart", [{
		x: opsCDF.map(p => p.x),
		y: opsCDF.map(p => p.y),
		type: "scatter",
		mode: "lines",
		line: {
			color: "green"
		}
	}], {
		title: "CDF – Operations Cash Used",
		xaxis: {
			title: "Operating Cash ($)"
		},
		yaxis: {
			title: "Probability",
			range: [0, 1]
		}
	});




}
// Export function
function exportCompanyRunDataCSV(dataRows, filename = "company_run_data.csv") {
	const headers = Object.keys(dataRows[0]);
	const csvContent = [headers.join(",")].concat(dataRows.map(row => headers.map(h => row[h]).join(","))).join("\n");
	const blob = new Blob([csvContent], {
		type: 'text/csv;charset=utf-8;'
	});
	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);
	link.setAttribute("href", url);
	link.setAttribute("download", filename);
	link.style.visibility = "hidden";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

// Export function Debt
function exportDebtSchedulesCSV(sellerDebtScheduleByCompany, debtScheduleByCompany, numCompanies, years, months) {
	const rows = [];

	for (let i = 0; i < numCompanies; i++) {
		for (let y = 0; y < years; y++) {
			const year = 2025 + y;
			// SELLER FINANCING
			let sellerRow = [`Company ${i + 1}`, "SellerFin", year];
			let sellerPrincipal = 0;
			let sellerInterest = 0;

			for (let m = 0; m < months; m++) {
				const payment = sellerDebtScheduleByCompany[i][y][m] || 0;
				const principal = (sellerDebtScheduleByCompany[i].principal?.[y]?.[m]) || 0;
				const interest = (sellerDebtScheduleByCompany[i].interest?.[y]?.[m]) || 0;

				sellerRow.push(payment.toFixed(2));
				sellerPrincipal += principal;
				sellerInterest += interest;
			}

			sellerRow.push(sellerPrincipal.toFixed(2));
			sellerRow.push(sellerInterest.toFixed(2));
			rows.push(sellerRow);

			// SENIOR DEBT
			let debtRow = [`Company ${i + 1}`, "SeniorDebt", year];
			let debtPrincipal = 0;
			let debtInterest = 0;

			for (let m = 0; m < months; m++) {
				const payment = debtScheduleByCompany[i][y][m] || 0;
				const principal = (debtScheduleByCompany[i].principal?.[y]?.[m]) || 0;
				const interest = (debtScheduleByCompany[i].interest?.[y]?.[m]) || 0;

				debtRow.push(payment.toFixed(2));
				debtPrincipal += principal;
				debtInterest += interest;
			}

			debtRow.push(debtPrincipal.toFixed(2));
			debtRow.push(debtInterest.toFixed(2));
			rows.push(debtRow);

			// TOTAL
			let totalRow = [`Company ${i + 1}`, "Total", year];
			for (let m = 0; m < months; m++) {
				const sf = sellerDebtScheduleByCompany[i][y][m] || 0;
				const sd = debtScheduleByCompany[i][y][m] || 0;
				totalRow.push((sf + sd).toFixed(2));
			}
			totalRow.push((sellerPrincipal + debtPrincipal).toFixed(2));
			totalRow.push((sellerInterest + debtInterest).toFixed(2));
			rows.push(totalRow);
		}
	}

	const headers = ["Company", "Type", "Year", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Principal", "Interest"
	];

	const csvContent = [headers.join(",")]
		.concat(rows.map(r => r.join(",")))
		.join("\n");

	const blob = new Blob([csvContent], {
		type: 'text/csv;charset=utf-8;'
	});
	const link = document.createElement("a");
	link.setAttribute("href", URL.createObjectURL(blob));
	link.setAttribute("download", "debt_schedule.csv");
	link.style.visibility = "hidden";
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}


function exportKPIDataCSV(companyRunData, equityPerCompany, debtUsedByCompany, dscrByYear, numCompanies, NUM_RUNS) {
    const rows = [];

    for (let run = 0; run < NUM_RUNS; run++) {
        for (let i = 0; i < numCompanies; i++) {
            const data = companyRunData.find(d => d.run === run + 1 && d.company === i + 1);
            if (!data) continue;

            const equity = equityPerCompany[i][run] || 0;
            const debt = debtUsedByCompany[i][run] || 0;
            const ebitda = parseFloat(data.base_ebitda) || 0;
            const valuation = parseFloat(data.valuation) || 0;
            const revenue = parseFloat(data.revenue) || 0;

            const dscr = (() => {
                const yearIndex = data.acquisition_year - 2025;
                return dscrByYear?.[yearIndex]?.[run] ?? null;
            })();

            const evToRevenue = revenue > 0 ? valuation / revenue : null;
            const ebitdaMargin = revenue > 0 ? ebitda / revenue : null;
            const debtToEbitda = ebitda > 0 ? debt / ebitda : null;
            const equityPctOfEV = valuation > 0 ? equity / valuation : null;
            const netCashOutlay = equity + (parseFloat(data.cash_needed) - equity);

            rows.push({
                run: run + 1,
                company: i + 1,
                year: data.acquisition_year,
                revenue,
                base_ebitda: ebitda,
                valuation,
                multiple: data.multiple,
                ev_to_revenue: evToRevenue,
                ebitda_margin: ebitdaMargin,
                debt_used: debt,
                debt_pct: data.debt_pct,
                debt_to_ebitda: debtToEbitda,
                equity_injected: equity,
                equity_pct_of_ev: equityPctOfEV,
                ops_cash_used: parseFloat(data.cash_needed) - equity,
                net_cash_outlay: netCashOutlay,
                rollover_pct: data.rollover,
                earnout_pct: data.earnout,
                seller_pct: data.seller,
                fee_amount: data.fee_amount,
                extra_exp: data.extra_exp,
                dscr
            });
        }
    }
    
        const csvContent = [
            Object.keys(rows[0]).join(","),
            ...rows.map(row => Object.values(row).join(","))
        ].join("\n");
    
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Company_KPI_Data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
///////


function runSimulation() {
	const NUM_RUNS = 5000;
	const simulationStartYear = 2025;
	const years = 7;
	const months = 12;

	const growthEl = document.getElementById("growth");
	const inflationEl = document.getElementById("inflation");
	const costInflationEl = document.getElementById("cost_inflation");

	const growth = growthEl ? parseFloat(growthEl.value || "0") / 100 : 0;
	const priceInflation = inflationEl ? parseFloat(inflationEl.value || "0") / 100 : 0;
	const costInflation = costInflationEl ? parseFloat(costInflationEl.value || "0") / 100 : 0;

	const numCompanies = document.getElementById('companies-container').children.length;

	const revenueTotals = Array.from({
		length: years
	}, () => Array(months).fill(0));
	const costTotals = Array.from({
		length: years
	}, () => Array(months).fill(0));
	const ebitdaTotals = Array.from({
		length: years
	}, () => Array(months).fill(0));
	const revenueCount = Array.from({
		length: years
	}, () => Array(months).fill(0));
	const costCount = Array.from({
		length: years
	}, () => Array(months).fill(0));
	const ebitdaCount = Array.from({
		length: years
	}, () => Array(months).fill(0));

	const ebitdaAnnualRuns = Array.from({
		length: NUM_RUNS
	}, () => Array(years).fill(0));
	const cashRequiredRuns = [];
	const cashRequiredPerYear = Array.from({
		length: years
	}, () => []);
	const valuationRunsByYear = Array.from({
		length: years
	}, () => Array(NUM_RUNS).fill(0));

    const debtUsedByCompany = Array.from({ 
        length: numCompanies
    }, () => Array(NUM_RUNS).fill(0));




	const cashByYear = Array(years).fill(0);
	const companyRunData = [];
	const minOpCash = 0;

	const sellerDebtScheduleMonthly = Array.from({
		length: years
	}, () => Array(months).fill(0));

    const dscrByYear = Array.from({ 
        length: years
    }, () => Array(NUM_RUNS).fill(0));



	let equityPerCompany = Array.from({
		length: numCompanies
	}, () => []);
	let equityPerYear = Array.from({
		length: years
	}, () => Array(NUM_RUNS).fill(0));
	let debtUsedByYear = Array.from({
		length: years
	}, () => Array(NUM_RUNS).fill(0));
	let opsCashUsedByYear = Array.from({
		length: years
	}, () => Array(NUM_RUNS).fill(0));


	const sellerDebtScheduleByCompany = Array.from({
			length: numCompanies
		}, () =>
		Array.from({
			length: years
		}, () => Array(months).fill(0))
	);
	const debtScheduleByCompany = Array.from({
			length: numCompanies
		}, () =>
		Array.from({
			length: years
		}, () => Array(months).fill(0))
	);

	for (let run = 0; run < NUM_RUNS; run++) {
		const revenue = Array.from({
			length: years
		}, () => Array(months).fill(0));
		const cost = Array.from({
			length: years
		}, () => Array(months).fill(0));
		const ebitda = Array.from({
			length: years
		}, () => Array(months).fill(0));
		let totalCashThisRun = 0;
		let netCashFlow = Array.from({
			length: years
		}, () => Array(months).fill(0));
		let usedInitialCashBS = false;
        const initialCashBS = +document.getElementById('initial_cash').value || 0;
        let sfCapitalRemaining = +document.getElementById('sf_capital_left').value || 0;
        let rollupCashBalance = -initialCashBS + sfCapitalRemaining;


        let consolidatedEBITDAThisRun = 0;
        let annualDebtServiceSoFar = 0;

		for (let i = 0; i < numCompanies; i++) {
			const rev = sampleTriangular(+document.getElementById(`c${i}_rev_min`).value, +document.getElementById(`c${i}_rev_ml`).value, +document.getElementById(`c${i}_rev_max`).value);
			const ebitdaPct = sampleTriangular(+document.getElementById(`c${i}_ebitda_min`).value, +document.getElementById(`c${i}_ebitda_ml`).value, +document.getElementById(`c${i}_ebitda_max`).value) / 100;
            const baseAnnualEBITDA = rev * ebitdaPct;
            const baseCost = rev * (1 - ebitdaPct);
			const monthlyBaseCost = baseCost / 12;

			const acqYear = +document.getElementById(`c${i}_year`).value;
			const acqMonth = +document.getElementById(`c${i}_month`).value;
			const extraExp = +document.getElementById(`c${i}_extra_exp`).value || 0;
			const acqOffset = acqYear - simulationStartYear;
			if (acqOffset >= years || acqOffset < 0) continue;

			const compSpread = {
				personal: [+document.getElementById(`c${i}_personal_min`).value, +document.getElementById(`c${i}_personal_max`).value],
				corp: [+document.getElementById(`c${i}_corp_min`).value, +document.getElementById(`c${i}_corp_max`).value],
				rec: [+document.getElementById(`c${i}_rec_min`).value, +document.getElementById(`c${i}_rec_max`).value],
				adhoc: [+document.getElementById(`c${i}_adhoc_min`).value, +document.getElementById(`c${i}_adhoc_max`).value]
			};

			const pct = {};
			let totalPct = 0;
			for (const k in compSpread) {
				pct[k] = Math.random() * (compSpread[k][1] - compSpread[k][0]) + compSpread[k][0];
				totalPct += pct[k];
			}
			for (const k in pct) pct[k] /= totalPct;

			const revMonthly = Array(months).fill(0);
			const personalWeights = [0.10, 0.30, 0.40, 0.20];
			personalWeights.forEach((w, m) => revMonthly[m] += rev * pct.personal * w);

			const corporateWeights = [0.30, 0.40, 0.30];
			corporateWeights.forEach((w, m) => revMonthly[m] += rev * pct.corp * w);

			const recPerMonth = rev * pct.rec / months;
			for (let m = 0; m < months; m++) revMonthly[m] += recPerMonth;

			let adhocWeights = Array.from({
				length: months
			}, () => Math.random());
			const adhocSum = adhocWeights.reduce((a, b) => a + b, 0);
			adhocWeights = adhocWeights.map(w => w / adhocSum);
			for (let m = 0; m < months; m++) revMonthly[m] += rev * pct.adhoc * adhocWeights[m];

			const sumRev = revMonthly.reduce((a, b) => a + b, 0);
			const normFactor = rev / sumRev;
			for (let m = 0; m < months; m++) revMonthly[m] *= normFactor;
			const synergyPct = key => parseFloat(document.getElementById(`c${i}_${key}_avg`).value || "0") / 100;
			const synergies = {
				cross: synergyPct("cross"),
				price: synergyPct("price"),
				churn: synergyPct("churn"),
				tech: synergyPct("tech"),
				shared: synergyPct("shared"),
				facility: synergyPct("facility")
			};

			for (let y = acqOffset; y < years; y++) {
				const yearOffset = y - acqOffset;
				const revGrowthFactor = Math.pow(1 + growth + priceInflation, yearOffset);
				const costGrowthFactor = Math.pow(1 + costInflation, yearOffset);

				for (let m = 0; m < months; m++) {
					if (y === acqOffset && m < acqMonth - 1) continue;

					const baseRev = revMonthly[m] * revGrowthFactor;
					const baseCst = monthlyBaseCost * costGrowthFactor;

					const adjustedRevenue = baseRev * (1 + synergies.cross + synergies.price - synergies.churn);
					const adjustedCost = baseCst * (1 - synergies.tech - synergies.shared - synergies.facility);
					const adjustedEBITDA = adjustedRevenue - adjustedCost - extraExp;

					revenue[y][m] += adjustedRevenue;
					cost[y][m] += adjustedCost;
					ebitda[y][m] += adjustedEBITDA;
					netCashFlow[y][m] += adjustedEBITDA;

					revenueTotals[y][m] += adjustedRevenue;
					costTotals[y][m] += adjustedCost;
					ebitdaTotals[y][m] += adjustedEBITDA;

					revenueCount[y][m]++;
					costCount[y][m]++;
					ebitdaCount[y][m]++;
				}
			}

			const avgMult = +document.getElementById(`c${i}_entry_avg`).value || 0;
			const stdMult = +document.getElementById(`c${i}_entry_std`).value || 0;
			const multiple = sampleNormal(avgMult, stdMult);
			const valuation = baseAnnualEBITDA * multiple;

			// Rollover
			const rolloverMin = +document.getElementById(`c${i}_rollover_min`).value || 0;
			const rolloverML = +document.getElementById(`c${i}_rollover_ml`).value || 0;
			const rolloverMax = +document.getElementById(`c${i}_rollover_max`).value || 0;
			const rolloverPct = sampleTriangular(rolloverMin, rolloverML, rolloverMax);

			// Earnout
			const earnoutMin = +document.getElementById(`c${i}_earnout_min`).value || 0;
			const earnoutML = +document.getElementById(`c${i}_earnout_ml`).value || 0;
			const earnoutMax = +document.getElementById(`c${i}_earnout_max`).value || 0;
			const earnoutPct = sampleTriangular(earnoutMin, earnoutML, earnoutMax);
			const earnoutYears = +document.getElementById(`c${i}_earnout_years`).value || 1;
			const earnoutAmount = valuation * (earnoutPct / 100);
			const annualEarnout = earnoutAmount / earnoutYears;
			const startMonthIndex = (acqYear - simulationStartYear) * 12 + (acqMonth - 1);

			for (let y = 0; y < earnoutYears; y++) {
				const payoutMonthIndex = startMonthIndex + (y + 1) * 12; // full year after
				const payoutYear = Math.floor(payoutMonthIndex / 12);
				const payoutMonth = payoutMonthIndex % 12;

				if (payoutYear < years) {
					netCashFlow[payoutYear][payoutMonth] -= annualEarnout;
				}
			}

			// Seller Financing
			const sellerMin = +document.getElementById(`c${i}_seller_min`).value || 0;
			const sellerML = +document.getElementById(`c${i}_seller_ml`).value || 0;
			const sellerMax = +document.getElementById(`c${i}_seller_max`).value || 0;
			const sellerPct = sampleTriangular(sellerMin, sellerML, sellerMax);
			const sellerRate = +document.getElementById(`c${i}_seller_rate`).value || 0;
			const sellerAmount = valuation * (sellerPct / 100);

			// Seller Financing schedule
			const acqMonthIndex = (acqYear - simulationStartYear) * 12 + (acqMonth - 1);
			const sellerTerm = +document.getElementById(`c${i}_seller_term`).value || 60;
			const debtTerm = +document.getElementById(`fund_term_${i}`).value || 60;

			// Simulate Debt %
            const dscrMin = +document.getElementById(`fund_dscr_min_${i}`).value || 0;
            const debtMin = +document.getElementById(`fund_debt_min_${i}`).value || 0;
            const debtML  = +document.getElementById(`fund_debt_ml_${i}`).value || 0;
            const debtMax = +document.getElementById(`fund_debt_max_${i}`).value || 0;
            const debtRateAnnual = (+document.getElementById(`fund_rate_${i}`).value || 0) / 100;
            const debtTermMonths = +document.getElementById(`fund_term_${i}`).value || 60;
            
            const monthlyRateDebt = debtRateAnnual / 12;

            const debtPctSim = sampleTriangular(debtMin, debtML, debtMax);
            let proposedDebtAmount = (debtPctSim / 100) * valuation;

            const ebitdaAnnual = (i === 0)
                ? baseAnnualEBITDA
                : consolidatedEBITDAThisRun + baseAnnualEBITDA;
            const monthlyPmt = (monthlyRateDebt === 0)
                ? proposedDebtAmount / debtTermMonths
                : proposedDebtAmount * (monthlyRateDebt / (1 - Math.pow(1 + monthlyRateDebt, -debtTermMonths)));
  
            const proposedAnnualDebtService = monthlyPmt * 12;
            const totalDebtService = proposedAnnualDebtService + annualDebtServiceSoFar;

            if (dscrMin > 0 && (ebitdaAnnual / totalDebtService) < dscrMin) {
                const maxAllowedService = ebitdaAnnual / dscrMin;
                const maxServiceForNewDebt = Math.max(0, maxAllowedService - annualDebtServiceSoFar);

                proposedDebtAmount = (monthlyRateDebt === 0)
                    ? maxServiceForNewDebt * (debtTermMonths / 12)
                    : maxServiceForNewDebt / (monthlyRateDebt / (1 - Math.pow(1 + monthlyRateDebt, -debtTermMonths)));
            }

            const debtAmount = proposedDebtAmount;
            const debtPct = (debtAmount / valuation) * 100;
            const actualMonthlyPmt = (monthlyRateDebt === 0)
                ? debtAmount / debtTermMonths
                : debtAmount * (monthlyRateDebt / (1 - Math.pow(1 + monthlyRateDebt, -debtTermMonths)));

            annualDebtServiceSoFar += actualMonthlyPmt * 12;
            debtUsedByYear[acqOffset][run] += debtAmount;
            debtUsedByCompany[i][run] = debtAmount;



			// Transaction Fee (based on debt)
			const feePct = +document.getElementById(`fund_fee_${i}`).value || 0;
			const feeAmount = (feePct / 100) * debtAmount;

			let extraInitialCash = 0;
			if (!usedInitialCashBS) {
				extraInitialCash = initialCashBS;
				usedInitialCashBS = true;
			}

			const upfrontCash =
				valuation * (1 - rolloverPct / 100 - earnoutPct / 100 - sellerPct / 100 - debtPct / 100) +
				feeAmount +
				minOpCash +
				extraInitialCash;
			let equityUsedForThisAcq = upfrontCash;

			if (rollupCashBalance >= upfrontCash) {
				rollupCashBalance -= upfrontCash;
				equityUsedForThisAcq = 0;
			} else {
				equityUsedForThisAcq = upfrontCash - rollupCashBalance;
				rollupCashBalance = 0;
			}

			// Track equity needed per year and per company
			equityPerYear[acqOffset][run] += equityUsedForThisAcq;
			equityPerCompany[i][run] = equityUsedForThisAcq;

			const opsCashUsed = upfrontCash - equityUsedForThisAcq;
			opsCashUsedByYear[acqOffset][run] += opsCashUsed;

			netCashFlow[acqOffset][acqMonth - 1] -= upfrontCash;
			cashByYear[acqOffset] += upfrontCash;


			let monthlyPayment = 0;
			const monthlyRate = sellerRate / 100 / 12;
			if (monthlyRate === 0) {
				monthlyPayment = sellerAmount / sellerTerm;
			} else {
				monthlyPayment = sellerAmount * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -sellerTerm)));
			}

			let sfBalance = sellerAmount;

			for (let m = 0; m < sellerTerm; m++) {
				const globalMonth = acqMonthIndex + m;
				if (globalMonth >= years * 12) break;

				const yearIndex = Math.floor(globalMonth / 12);
				const monthIndex = globalMonth % 12;

				const sfInterest = sfBalance * monthlyRate;
				const sfPrincipal = monthlyPayment - sfInterest;
				sfBalance -= sfPrincipal;

				// Store separate amortization parts
				sellerDebtScheduleByCompany[i][yearIndex][monthIndex] += monthlyPayment;

				// Save for export (build new matrix if needed)
				if (!sellerDebtScheduleByCompany[i].interest) sellerDebtScheduleByCompany[i].interest = Array.from({
					length: years
				}, () => Array(months).fill(0));
				if (!sellerDebtScheduleByCompany[i].principal) sellerDebtScheduleByCompany[i].principal = Array.from({
					length: years
				}, () => Array(months).fill(0));

				sellerDebtScheduleByCompany[i].interest[yearIndex][monthIndex] += sfInterest;
				sellerDebtScheduleByCompany[i].principal[yearIndex][monthIndex] += sfPrincipal;
				netCashFlow[yearIndex][monthIndex] -= monthlyPayment;

			}

			//Debt calculation:
			const debtRate = +document.getElementById(`fund_rate_${i}`).value || 0;
			const monthlyDebtPayment = (debtRate / 100 / 12) * debtAmount;

			let debtBalance = debtAmount;
			const monthlyDebtRate = debtRate / 100 / 12;
			let monthlyDebtPmt = 0;

			if (monthlyDebtRate === 0) {
				monthlyDebtPmt = debtAmount / debtTerm;
			} else {
				monthlyDebtPmt = debtAmount * (monthlyDebtRate / (1 - Math.pow(1 + monthlyDebtRate, -debtTerm)));
			}

			for (let m = 0; m < debtTerm; m++) {
				const globalMonth = acqMonthIndex + m;
				if (globalMonth >= years * 12) break;

				const y = Math.floor(globalMonth / 12);
				const mo = globalMonth % 12;

				const interest = debtBalance * monthlyDebtRate;
				const principal = monthlyDebtPmt - interest;
				debtBalance -= principal;

				debtScheduleByCompany[i][y][mo] += monthlyDebtPmt;

				if (!debtScheduleByCompany[i].interest) debtScheduleByCompany[i].interest = Array.from({
					length: years
				}, () => Array(months).fill(0));
				if (!debtScheduleByCompany[i].principal) debtScheduleByCompany[i].principal = Array.from({
					length: years
				}, () => Array(months).fill(0));

				debtScheduleByCompany[i].interest[y][mo] += interest;
				debtScheduleByCompany[i].principal[y][mo] += principal;
				netCashFlow[y][mo] -= monthlyDebtPmt;

			}
			totalCashThisRun += upfrontCash;
			valuationRunsByYear[acqOffset][run] += valuation;

            

			companyRunData.push({
				run: run + 1,
				company: i + 1,
				acquisition_year: acqYear,
				acquisition_month: acqMonth,
				revenue: rev.toFixed(2),
				ebitda_pct: (ebitdaPct * 100).toFixed(2),
				cost: baseCost.toFixed(2),
				base_ebitda: baseAnnualEBITDA.toFixed(2),
				multiple: multiple.toFixed(2),
				multiple_avgMult: avgMult.toFixed(2),
				multiple_stdMult: stdMult.toFixed(2),
				valuation: valuation.toFixed(2),
				rollover: rolloverPct.toFixed(2),
				earnout: earnoutPct.toFixed(2),
				earnout_amount: earnoutAmount.toFixed(2),
				earnout_years: earnoutYears,
				seller: sellerPct.toFixed(2),
				seller_amount: sellerAmount.toFixed(2),
				seller_rate: sellerRate.toFixed(2),
				debt_pct: debtPct.toFixed(2),
				debt_amount: debtAmount.toFixed(2),
				fee_pct: feePct.toFixed(2),
				fee_amount: feeAmount.toFixed(2),
				cash_needed: upfrontCash.toFixed(2),
				...synergies
			});
            annualDebtServiceSoFar += proposedAnnualDebtService;
            consolidatedEBITDAThisRun += baseAnnualEBITDA;
		}

		for (let y = 0; y < years; y++) {
			for (let m = 0; m < months; m++) {
				ebitdaAnnualRuns[run][y] += ebitda[y][m];
			}
		}

        for (let y = 0; y < years; y++) {
            let totalEBITDA = ebitdaAnnualRuns[run][y];
            let totalDebtService = 0;
        
            for (let m = 0; m < months; m++) {
                for (let c = 0; c < numCompanies; c++) {
                    totalDebtService += 
                        (debtScheduleByCompany[c]?.[y]?.[m] || 0) + 
                        (sellerDebtScheduleByCompany[c]?.[y]?.[m] || 0);
                }
            }
        
            dscrByYear[y][run] = totalDebtService === 0 ? 99 : totalEBITDA / totalDebtService;
        }

		let totalEquityRequired = 0;
		let runningBalance = 0;

		for (let y = 0; y < years; y++) {
			let equityInjectedThisYear = 0;
			for (let m = 0; m < months; m++) {
				runningBalance += netCashFlow[y][m];

				if (runningBalance < minOpCash) {
					const shortfall = minOpCash - runningBalance;
					equityInjectedThisYear += shortfall;
					runningBalance += shortfall;
				}
			}

			cashRequiredPerYear[y].push(equityInjectedThisYear); // Used for boxplot
			equityPerYear[y][run] = equityInjectedThisYear; // Used for yearly equity chart
		}

		const totalEquityThisRun = equityPerYear.reduce(
			(sum, yearArray) => sum + (yearArray[run] || 0),
			0
		);
		cashRequiredRuns.push(totalEquityThisRun);
	}


	// Final average by dividing only by counts (not full NUM_RUNS)
	for (let y = 0; y < years; y++) {
		for (let m = 0; m < months; m++) {
			revenueTotals[y][m] /= NUM_RUNS;
			costTotals[y][m] /= NUM_RUNS;
			ebitdaTotals[y][m] /= NUM_RUNS;
		}
	}

	document.getElementById("resultsTable").innerHTML = '';
	renderTable("Revenue (Avg)", revenueTotals);
	renderTable("Cost (Avg)", costTotals);
	renderTable("EBITDA (Avg)", ebitdaTotals);

	const summary = [];
	for (let y = 0; y < years; y++) {
		const values = ebitdaAnnualRuns.map(run => run[y]);
		summary.push({
			year: y + 1,
			mean: values.reduce((a, b) => a + b, 0) / NUM_RUNS,
			p10: percentile(values, 10),
			p50: percentile(values, 50),
			p90: percentile(values, 90)
		});
	}

	const cashSummary = {
		p10: percentile(cashRequiredRuns, 10),
		p50: percentile(cashRequiredRuns, 50),
		p90: percentile(cashRequiredRuns, 90),
		mean: cashRequiredRuns.reduce((a, b) => a + b, 0) / cashRequiredRuns.length
	};

	renderMonteCarloSummary(summary);
	document.getElementById("chartsSection").style.display = "block";
	renderCharts(
		summary,
		revenueTotals,
		costTotals,
		ebitdaTotals,
		ebitdaAnnualRuns,
		valuationRunsByYear,
		cashByYear,
		companyRunData,
		sellerDebtScheduleByCompany,
		debtScheduleByCompany,
		equityPerYear,
		equityPerCompany,
		debtUsedByYear,
		opsCashUsedByYear,
		cashRequiredRuns,
		numCompanies,
        debtUsedByCompany,
        dscrByYear,
		years,
		months
	);

}


function renderTable(label, matrix) {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const wrapperId = `${label.toLowerCase()}TableWrapper`;
	const tableId = `${label.toLowerCase()}TableBody`;

	let html = `
    <div class="table-wrapper">
      <div class="toggle-btn" onclick="toggleTable('${wrapperId}')">− ${label} Table</div>
      <div id="${wrapperId}">
        <table>
          <thead>
            <tr><th>Year</th>${months.map(m => `<th>${m}</th>`).join('')}<th>Total</th></tr>
          </thead>
          <tbody id="${tableId}">
  `;

	for (let y = 0; y < 7; y++) {
		const monthly = matrix[y];
		const total = monthly.reduce((sum, val) => sum + val, 0);
		html += `<tr><td>${2025 + y}</td>` +
			monthly.map(v => `<td>${v.toFixed(0)}</td>`).join('') +
			`<td><strong>${total.toFixed(0)}</strong></td></tr>`;
	}

	html += `</tbody></table></div></div><br/>`;
	document.getElementById("resultsTable").innerHTML += html;
}

function toggleTable(id) {
	const wrapper = document.getElementById(id);
	const toggle = wrapper.previousElementSibling;
	const collapsed = wrapper.classList.toggle("collapsed");
	const label = toggle.innerText.slice(2);
	toggle.innerText = (collapsed ? '+ ' : '− ') + label;
}

function percentile(arr, p) {
	arr.sort((a, b) => a - b);
	const i = (arr.length - 1) * (p / 100);
	const lower = Math.floor(i),
		upper = Math.ceil(i);
	return lower === upper ? arr[lower] : arr[lower] + (arr[upper] - arr[lower]) * (i - lower);
}

function renderMonteCarloSummary(summary) {
	const totalMean = summary.reduce((sum, row) => sum + row.mean, 0);
	const totalP50 = summary.reduce((sum, row) => sum + row.p50, 0);

	const firstCol = totalMean <= totalP50 ? "mean" : "p50";
	const secondCol = totalMean <= totalP50 ? "p50" : "mean";

	let html = `
    <div class="table-wrapper">
      <div class="toggle-btn" onclick="toggleTable('mcSummaryTable')">− EBITDA Monte Carlo Summary</div>
      <div id="mcSummaryTable">
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>${firstCol === "mean" ? "Mean" : "Median"}</th>
              <th>${secondCol === "mean" ? "Mean" : "Median"}</th>
              <th>P10</th>
              <th>P90</th>
            </tr>
          </thead>
          <tbody>
  `;

	summary.forEach(row => {
		html += `<tr>
      <td>${2025 + row.year - 1}</td>
      <td>${(firstCol === "mean" ? row.mean : row.p50).toFixed(0)}</td>
      <td>${(secondCol === "mean" ? row.mean : row.p50).toFixed(0)}</td>
      <td>${row.p10.toFixed(0)}</td>
      <td>${row.p90.toFixed(0)}</td>
    </tr>`;
	});

	html += `</tbody></table></div></div><br/>`;
	document.getElementById("resultsTable").innerHTML += html;
}

document.addEventListener('DOMContentLoaded', () => {
	const generateBtn = document.getElementById('generateCompaniesBtn');
	if (generateBtn) {
		generateBtn.addEventListener('click', generateCompanies);
	}

	const runSimBtn = document.getElementById('runSimBtn');
	if (runSimBtn) {
		runSimBtn.addEventListener('click', runSimulation);
	}
	console.log("DOM fully loaded");
	// Global exposure (not strictly needed anymore if not using onclick="")
	window.generateCompanies = generateCompanies;
	window.runSimulation = runSimulation;
	window.toggleCompany = toggleCompany;
	window.toggleAllCompanies = toggleAllCompanies;
	window.toggleCollapsedBlock = toggleCollapsedBlock;
	window.toggleTable = toggleTable;
	window.exportCompanyRunDataCSV = exportCompanyRunDataCSV;
	window.exportDebtSchedulesCSV = exportDebtSchedulesCSV;
    window.exportKPIDataCSV = exportKPIDataCSV;
});
