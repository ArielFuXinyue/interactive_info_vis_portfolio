// HW#5 A: Music Revenue by Format
registerSketch('sk15', function (p) {
    let table;

    const YEAR_MIN = 1973;
    const YEAR_MAX = 2018;

    const CHART_HEIGHT = 150; 
    const GAP = 100;          
    const MARGIN_X = 150;     
    const MARGIN_Y = 60;
    
    // Layout Constants
    const GLOBAL_WIDTH = 500;
    const LOCAL_WIDTH = 500;
    const LOCAL_OFFSET = 800; // Starting X for the right-side chart

    let formats = [];

    p.preload = function () {
        table = p.loadTable("data/modified_music_revenue.csv", "csv", "header");
    };

    let rows = [];
    let byFormat = {};

    p.setup = function () {
        console.log("sk15 setup running ✅");
        console.log("columns:", table.columns);     // column headers
        console.log("rows:", table.getRowCount());  // number of rows

        // Process data into accessibel structures
        console.log("about to parse rows...");

        for (let r = 0; r < table.getRowCount(); r++) {
            try {
                let format = table.getString(r, "Format");
                let year = table.getNum(r, "Year");

                // Units might be blank and crash getNum, so read as string first
                let unitsStr = table.getString(r, "Units");
                let units = unitsStr === "" ? 0 : Number(unitsStr);

                let revenueAdjStr = table.getString(r, "Revenue (Inflation Adjusted)");
                let revenueAdj = revenueAdjStr === "" ? 0 : Number(revenueAdjStr);

                let rawIsPhysical = table.getString(r, "is_physical");
                // Trim whitespace and convert to uppercase to ensure a match
                let isPhysical = rawIsPhysical && rawIsPhysical.trim().toUpperCase() === "TRUE";

                if (!format || !Number.isFinite(year)) continue;

                rows.push({ format, year, units, revenue: revenueAdj, isPhysical });

            } catch (e) {
                console.error("crashed at row:", r, "error:", e);
            }
        }
        console.log("finished parsing ✅", rows.length);
        console.log("row 1:", rows[0]);

        for (let d of rows) {
            if (!byFormat[d.format]) {
                byFormat[d.format] = [];
            }
            byFormat[d.format].push(d);
        }
        formats = Object.keys(byFormat);
        console.log("Formats:", formats);
        console.log("Formats row 1:", Object.values(byFormat)[0]);

        // 1. Calculate the earliest year for each format
        let formatStartYears = formats.map(f => {
            // Filter for rows where revenue is actually greater than 0
            let activeYears = byFormat[f]
                .filter(d => d.revenue > 0)
                .map(d => d.year);
            
            // If no revenue found, default to a very late year
            let firstYear = activeYears.length > 0 ? Math.min(...activeYears) : 9999;
            
            return { name: f, firstYear: firstYear };
        });

        // 2. Sort formats based on that year (Ascending)
        formatStartYears.sort((a, b) => a.firstYear - b.firstYear);

        // 3. Update the formats array with the sorted names
        formats = formatStartYears.map(obj => obj.name);

        console.log("Sorted Formats:", formats);

        // cavas size
        // Calculate total canvas height: Top Margin + Sum Chart + Headers + (Formats * Chart Space)
        let totalHeight = MARGIN_Y + 300 + 100 + (formats.length * (CHART_HEIGHT + GAP)) + 100;
        p.createCanvas(1400, totalHeight);
    };

    function formatCurrency(val) {
        return val >= 1000 ? (val / 1000).toFixed(2) + "B" : Math.floor(val) + "M";
    }

    p.draw = function () {
        p.background(255);
        // const timelineWidth = p.width - MARGIN_X - 50;
        let currentY = MARGIN_Y;
        
        // We will store the data of the bar we are touching in this variable
        let hoveredData = null;

        // 1. Overall Title
        p.fill(0); p.noStroke(); p.textSize(28); p.textStyle(p.BOLD); p.textAlign(p.CENTER, p.TOP);
        p.text("US Recorded Music Revenue By Format From 1973-2018", p.width / 2, currentY);
        
        currentY += 80;

        // --- 2. TOTAL SUM STACKED HISTOGRAM ---
        const SUM_CHART_HEIGHT = 200;
        const SUM_CHART_WIDTH = 1150; 
        const SUM_BASELINE = currentY + SUM_CHART_HEIGHT;
        
        let yearlyTotals = {};
        for (let yr = YEAR_MIN; yr <= YEAR_MAX; yr++) yearlyTotals[yr] = { physical: 0, digital: 0 };
        rows.forEach(r => {
            if (r.isPhysical) yearlyTotals[r.year].physical += r.revenue;
            else yearlyTotals[r.year].digital += r.revenue;
        });

        let totalMax = 0;
        Object.values(yearlyTotals).forEach(v => {
            let sum = v.physical + v.digital;
            if (sum > totalMax) totalMax = sum;
        });

        p.textAlign(p.LEFT, p.BOTTOM); p.textSize(16); p.text("Total Industry Revenue", MARGIN_X, currentY - 10);
        
        // Helper for generic axes (used for Sum Chart)
        const drawGenericAxes = (startX, baselineY, width, height, maxVal) => {
            p.stroke(200); p.line(startX, baselineY, startX + width, baselineY);
            p.line(startX, baselineY, startX, baselineY - height);
            for (let yr = YEAR_MIN; yr <= YEAR_MAX; yr++) {
                if (yr === 1973 || yr % 5 === 0 || yr === 2018) {
                    let tx = p.map(yr, YEAR_MIN, YEAR_MAX, startX, startX + width);
                    p.stroke(200); p.line(tx, baselineY, tx, baselineY + 5);
                    p.noStroke(); p.fill(150); p.textSize(9); p.textAlign(p.CENTER, p.TOP);
                    p.text(yr, tx, baselineY + 8);
                }
            }
            for (let i = 0; i <= 4; i++) {
                let val = (maxVal / 4) * i;
                let ty = p.map(val, 0, maxVal, baselineY, baselineY - height);
                p.stroke(240); p.line(startX, ty, startX + width, ty);
                p.noStroke(); p.fill(150); p.textAlign(p.RIGHT, p.CENTER);
                p.text(formatCurrency(val), startX - 10, ty);
            }
        };

        drawGenericAxes(MARGIN_X, SUM_BASELINE, SUM_CHART_WIDTH, SUM_CHART_HEIGHT, totalMax);

        for (let yr = YEAR_MIN; yr <= YEAR_MAX; yr++) {
            let x = p.map(yr, YEAR_MIN, YEAR_MAX, MARGIN_X, MARGIN_X + SUM_CHART_WIDTH);
            let w = (SUM_CHART_WIDTH / (YEAR_MAX - YEAR_MIN + 1)) * 0.8;
            let hPhys = p.map(yearlyTotals[yr].physical, 0, totalMax, 0, SUM_CHART_HEIGHT);
            let hDigi = p.map(yearlyTotals[yr].digital, 0, totalMax, 0, SUM_CHART_HEIGHT);
            p.noStroke();
            p.fill(100, 150, 250, 200); p.rect(x, SUM_BASELINE, w, -hPhys);
            p.fill(100, 200, 150, 200); p.rect(x, SUM_BASELINE - hPhys, w, -hDigi);
        }

        // --- NEW: RED DASHED LINE FOR NAPSTER (YEAR 2000) ---
        let napsterYear = 1999;
        let nx = p.map(napsterYear, YEAR_MIN, YEAR_MAX, MARGIN_X, MARGIN_X + SUM_CHART_WIDTH);
        
        p.push();
        p.stroke(255, 0, 0); // Red color
        p.strokeWeight(3);
        
        // Enable dashed lines using the native HTML5 Canvas context
        p.drawingContext.setLineDash([5, 5]); 
        p.line(nx, SUM_BASELINE, nx, SUM_BASELINE - SUM_CHART_HEIGHT);
        
        // Reset dash so other lines stay solid
        p.drawingContext.setLineDash([]);
        
        // Add Label for the line
        p.noStroke();
        p.fill(255, 0, 0);
        p.textSize(12);
        p.textStyle(p.BOLD);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text("1999: Napster Launch", nx, SUM_BASELINE - SUM_CHART_HEIGHT - 5);
        p.pop();

        // --- NEW: RED DASHED LINE FOR NAPSTER (YEAR 2000) ---
        let spotifyYear = 2006;
        nx = p.map(spotifyYear, YEAR_MIN, YEAR_MAX, MARGIN_X, MARGIN_X + SUM_CHART_WIDTH);
        
        p.push();
        p.stroke(255, 0, 0); // Red color
        p.strokeWeight(3);
        
        // Enable dashed lines using the native HTML5 Canvas context
        p.drawingContext.setLineDash([5, 5]); 
        p.line(nx, SUM_BASELINE, nx, SUM_BASELINE - SUM_CHART_HEIGHT);
        
        // Reset dash so other lines stay solid
        p.drawingContext.setLineDash([]);
        
        // Add Label for the line
        p.noStroke();
        p.fill(255, 0, 0);
        p.textSize(12);
        p.textStyle(p.BOLD);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text("2006: Spotify Founded", nx, SUM_BASELINE - SUM_CHART_HEIGHT - 5);
        p.pop();

        currentY = SUM_BASELINE + 120; // Move pointer below sum chart

        // --- 3. LOWER SECTION HEADERS ---
        p.textSize(18); p.fill(0); p.textAlign(p.LEFT);
        p.text("Global Scale (All Formats Compared)", MARGIN_X, currentY - 40);
        p.text("Local Distribution (Scaled to Format Peak)", LOCAL_OFFSET, currentY - 40);
        p.drawLegend(p, LOCAL_OFFSET - 140, currentY - 55);

        let globalMaxRev = p.max(rows.map(d => d.revenue));

        // --- 4. INDIVIDUAL FORMAT LOOP ---
        formats.forEach((format, index) => {
            let sectionY = currentY + index * (CHART_HEIGHT + GAP);
            let baselineY = sectionY + CHART_HEIGHT;
            let data = byFormat[format];
            let isPhysical = data.some(d => d.isPhysical);
            let localMax = p.max(data.map(d => d.revenue)) || 1;

            p.fill(0); p.noStroke(); p.textAlign(p.LEFT, p.BOTTOM); p.textSize(14); p.textStyle(p.BOLD);
            p.text(format, 10, sectionY - 10); 

            // Inner drawing helper
            const drawLocalAxes = (startX, width, maxVal) => {
                p.stroke(200); p.line(startX, baselineY, startX + width, baselineY);
                p.line(startX, baselineY, startX, baselineY - CHART_HEIGHT);
                for (let yr = YEAR_MIN; yr <= YEAR_MAX; yr++) {
                    if (yr === 1973 || yr % 5 === 0 || yr === 2018) {
                        let tx = p.map(yr, YEAR_MIN, YEAR_MAX, startX, startX + width);
                        p.stroke(200); p.line(tx, baselineY, tx, baselineY + 5);
                        p.noStroke(); p.fill(150); p.textSize(9); p.textAlign(p.CENTER, p.TOP);
                        p.text(yr, tx, baselineY + 8);
                    }
                }
                for (let i = 0; i <= 3; i++) {
                    let val = (maxVal / 3) * i;
                    let ty = p.map(val, 0, maxVal, baselineY, baselineY - CHART_HEIGHT);
                    p.stroke(245); p.line(startX, ty, startX + width, ty);
                    p.noStroke(); p.fill(150); p.textAlign(p.RIGHT, p.CENTER);
                    p.text(formatCurrency(val), startX - 8, ty);
                }
            };

            drawLocalAxes(MARGIN_X, GLOBAL_WIDTH, globalMaxRev);
            drawLocalAxes(LOCAL_OFFSET, LOCAL_WIDTH, localMax);

            // Draw Bars
            data.forEach(d => {
                let barW = (GLOBAL_WIDTH / (YEAR_MAX - YEAR_MIN + 1)) * 0.8;
                // Global Chart
                let gx = p.map(d.year, YEAR_MIN, YEAR_MAX, MARGIN_X, MARGIN_X + GLOBAL_WIDTH);
                let gh = p.map(d.revenue, 0, globalMaxRev, 0, CHART_HEIGHT);
                if (p.mouseX >= gx && p.mouseX <= gx + barW && p.mouseY >= baselineY - gh && p.mouseY <= baselineY) {
                    p.fill(255, 204, 0); hoveredData = { ...d, x: p.mouseX, y: p.mouseY };
                } else {
                    isPhysical ? p.fill(100, 150, 250, 200) : p.fill(100, 200, 150, 200);
                }
                p.noStroke(); p.rect(gx, baselineY, barW, -gh);

                // Local Chart (Gray)
                let lx = p.map(d.year, YEAR_MIN, YEAR_MAX, LOCAL_OFFSET, LOCAL_OFFSET + LOCAL_WIDTH);
                let lh = p.map(d.revenue, 0, localMax, 0, CHART_HEIGHT);
                p.fill(220); p.rect(lx, baselineY, barW, -lh);
            });
        });

        // 6. DRAW TOOLTIP (Moved outside the loops so it's always on top)
        if (hoveredData) {
            let formatData = byFormat[hoveredData.format];
            let activeYears = formatData.filter(d => d.revenue > 0).map(d => d.year);
            let start = Math.min(...activeYears);
            let end = Math.max(...activeYears);
            
            // Local Scale: find max revenue JUST for this format
            let localMax = p.max(formatData.map(d => d.revenue)) || 0;
            let maxRow = formatData.reduce((prev, curr) => (prev.revenue > curr.revenue) ? prev : curr);

            p.push();
            let boxW = 240;
            let boxH = 160; // Increased height to fit the mini-chart
            let tx = hoveredData.x + 15;
            let ty = hoveredData.y - boxH - 10;
            
            // Boundary check
            if (tx + boxW > p.width) tx -= (boxW + 30);
            if (ty < 0) ty = hoveredData.y + 20;

            // Tooltip Background
            p.fill(255, 250);
            p.stroke(0);
            p.strokeWeight(1);
            p.rect(tx, ty, boxW, boxH, 8);
            
            // Text Info
            p.fill(0);
            p.noStroke();
            p.textSize(12);
            p.textAlign(p.LEFT, p.TOP);
            p.textStyle(p.BOLD);
            p.text(`${hoveredData.format} (${hoveredData.year})`, tx + 10, ty + 10);
            p.textStyle(p.NORMAL);
            p.textSize(11);
            p.text("Current: " + formatCurrency(hoveredData.revenue), tx + 10, ty + 28);
            p.text("Active: " + start + "-" + end, tx + 10, ty + 43);
            p.text(`Peak: ${formatCurrency(maxRow.revenue)} (${maxRow.year})`, tx + 10, ty + 58);

            // --- MINI ADAPTED HISTOGRAM ---
            let chartX = tx + 10;
            let chartY = ty + 145; // Baseline of mini chart
            let chartW = boxW - 20;
            let chartH = 60; // Max height of mini chart bars

            // Mini Axis
            p.stroke(200);
            p.line(chartX, chartY, chartX + chartW, chartY);

            formatData.forEach(d => {
                let x = p.map(d.year, YEAR_MIN, YEAR_MAX, chartX, chartX + chartW);
                let h = p.map(d.revenue, 0, localMax, 0, chartH);
                let w = chartW / (YEAR_MAX - YEAR_MIN + 1);

                if (d.year === hoveredData.year) {
                    p.fill(255, 204, 0); // Highlight current year in yellow
                } else {
                    p.fill(150, 150, 150, 150); // Gray for the rest of the distribution
                }
                p.noStroke();
                p.rect(x, chartY, w, -h);
            });

            // Local Scale Label
            p.fill(150);
            p.textSize(9);
            p.textAlign(p.RIGHT);
            p.text("Local Scale Max: " + formatCurrency(localMax), tx + boxW - 10, ty + 75);
            
            p.pop();
        }
    };

    // helper function to draw the legend
    p.drawLegend = function(p, x, y) {
        const boxSize = 12;
        p.push();
        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(11);
        p.fill(100, 150, 250); p.rect(x, y, boxSize, boxSize);
        p.fill(0); p.text("Physical", x + 20, y + boxSize/2);
        p.fill(100, 200, 150); p.rect(x, y + 20, boxSize, boxSize);
        p.fill(0); p.text("Digital", x + 20, y + 20 + boxSize/2);
        p.pop();
    }

    // p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});

