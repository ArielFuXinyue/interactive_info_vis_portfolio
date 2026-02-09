// HW#5 A: Music Revenue by Format
registerSketch('sk15', function (p) {
    let table;

    const YEAR_MIN = 1973;
    const YEAR_MAX = 2018;

    const CHART_HEIGHT = 150; 
    const GAP = 100;          
    const MARGIN_X = 180;     
    const MARGIN_Y = 60;

    let formats = [];

    p.preload = function () {
        table = p.loadTable("data/modified_music_revenue.csv", "csv", "header");
    };

    let rows = [];
    let byFormat = {};

    p.setup = function () {
        p.createCanvas(900, 900);

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
        let totalHeight = (formats.length * (CHART_HEIGHT + GAP)) + (MARGIN_Y * 2); 
        p.createCanvas(1000, totalHeight); 
        p.noLoop();
    };

    p.draw = function () {
        p.background(255);
        const timelineWidth = p.width - MARGIN_X - 50;

        // Calculate GLOBAL Maximum Revenue
        let globalMaxRev = 0;
        formats.forEach(f => {
            let formatMax = p.max(byFormat[f].map(d => d.revenue)) || 0;
            if (formatMax > globalMaxRev) globalMaxRev = formatMax;
        });

        formats.forEach((format, index) => {
            let yOffset = MARGIN_Y + index * (CHART_HEIGHT + GAP);
            let baselineY = yOffset + CHART_HEIGHT;

            // 1. FIXED FORMAT LABEL
            p.noStroke();
            p.fill(0);
            p.textAlign(p.LEFT, p.CENTER); // Changed to LEFT
            p.textSize(14);
            p.textStyle(p.BOLD);
            // Place text in the margin area (between x=10 and x=MARGIN_X)
            p.text(format, 10, yOffset - 20); 
            p.textStyle(p.NORMAL);

            // 2. DRAW AXES
            p.stroke(0);
            p.strokeWeight(1);
            p.line(MARGIN_X, baselineY, MARGIN_X + timelineWidth, baselineY); // X-axis
            p.line(MARGIN_X, baselineY, MARGIN_X, yOffset); // Y-axis

            // 3. X-AXIS: 10-year Ticks and Labels
            for (let year = YEAR_MIN; year <= YEAR_MAX; year++) {
                let x = p.map(year, YEAR_MIN, YEAR_MAX, MARGIN_X, MARGIN_X + timelineWidth);
                if (year === 1973 || year % 10 === 0 || year === 2018) {
                    p.stroke(0);
                    p.line(x, baselineY, x, baselineY + 5); 
                    p.noStroke();
                    p.fill(100);
                    p.textSize(10);
                    p.textAlign(p.CENTER);
                    p.text(year, x, baselineY + 20);
                }
            }

            // 4. Y-AXIS: Shared Global Scale
            p.textAlign(p.RIGHT, p.CENTER);
            p.textSize(9);
            p.fill(100);
            for (let i = 0; i <= 2; i++) {
                let val = (globalMaxRev / 2) * i;
                let tickY = p.map(val, 0, globalMaxRev, baselineY, yOffset);
                p.stroke(220); 
                p.line(MARGIN_X, tickY, MARGIN_X + timelineWidth, tickY);
                p.noStroke();
                let label = val >= 1000 ? (val / 1000).toFixed(1) + "B" : Math.floor(val) + "M";
                p.text(label, MARGIN_X - 10, tickY);
            }

            // 5. DRAW BARS WITH COLOR CODING
            let data = byFormat[format];
            
            // Determine color based on is_physical property
            // We check the first entry in the data for this format
            // let isPhysical = data[0].isPhysical;
            let isPhysical = data.some(d => d.isPhysical === true); 

            if (isPhysical) {
                p.fill(100, 150, 250, 200); // Blue for Physical 
                p.stroke(50, 100, 200);
            } else {
                p.fill(100, 200, 150, 200); // Green for Digital
                p.stroke(50, 150, 100);
            }
            
            p.strokeWeight(0.5);

            data.forEach(d => {
                let barX = p.map(d.year, YEAR_MIN, YEAR_MAX, MARGIN_X, MARGIN_X + timelineWidth);
                let barH = p.map(d.revenue, 0, globalMaxRev, 0, CHART_HEIGHT);
                let barWidth = (timelineWidth / (YEAR_MAX - YEAR_MIN + 1)) * 0.9;
                p.rect(barX, baselineY, barWidth, -barH);
            });
        });
    };

    // p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
