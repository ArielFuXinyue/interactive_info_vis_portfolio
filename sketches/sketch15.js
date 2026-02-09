// HW#5 A: Music Revenue by Format
registerSketch('sk15', function (p) {
    let table;

    const YEAR_MIN = 1973;
    const YEAR_MAX = 2018;

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

                let isPhysicalStr = table.getString(r, "is_physical");
                let isPhysical = isPhysicalStr === "TRUE";

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

        // Set canvas height based on number of formats to show
        let totalHeight = (formats.length * 120) + 100; 
        p.createCanvas(900, totalHeight);
        
        p.noLoop();

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
    };

    p.draw = function () {
        p.background(255);
        
        const marginX = 80;  // Space for format labels on the left
        const marginY = 60;  // Top margin
        const chartHeight = 80; // Height of each individual histogram
        const gap = 40;      // Space between histograms
        const timelineWidth = p.width - marginX - 50;

        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(12);

        formats.forEach((format, index) => {
            // Calculate vertical position for this specific format
            let yOffset = marginY + index * (chartHeight + gap);
            let baselineY = yOffset + chartHeight;

            // 1. Draw Format Label (e.g., "Vinyl Single", "8-Track")
            p.noStroke();
            p.fill(0);
            p.text(format, 10, baselineY - chartHeight / 2);

            // 2. Draw the Timeline Axis (1973 - 2018)
            p.stroke(150);
            p.line(marginX, baselineY, marginX + timelineWidth, baselineY);
            
            // Draw year markers as seen in sketch (1973, 2000, 2018)
            p.noStroke();
            p.fill(100);
            p.textSize(10);
            p.text("1973", marginX, baselineY + 15);
            p.text("2000", marginX + p.map(2000, 1973, 2018, 0, timelineWidth), baselineY + 15);
            p.text("2018", marginX + timelineWidth - 25, baselineY + 15);

            // 3. Draw the Histogram Bars
            let data = byFormat[format];
            // Find max revenue for this specific format to scale bars
            let maxRev = p.max(data.map(d => d.revenue)) || 1;

            p.fill(100, 150, 250, 150); // Semi-transparent blue
            p.stroke(50, 100, 200);

            data.forEach(d => {
                let barX = p.map(d.year, 1973, 2018, marginX, marginX + timelineWidth);
                let barH = p.map(d.revenue, 0, maxRev, 0, chartHeight);
                
                // Draw bar growing upwards from the baseline
                let barWidth = timelineWidth / (2018 - 1973);
                p.rect(barX, baselineY, barWidth, -barH);
            });
        });
        
        p.noLoop();
    };

    // p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
