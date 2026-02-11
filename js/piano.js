
const tickInterval = 10;
const keyWidth = 40;
const keyHeight = 200;
const axisHeight = 30;
const pianoPattern = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];

const yearPositions = new Map();

d3.csv("data/energy_and_pop_data.csv", row => {
    row.Year = +row.Year;
    return row;
}).then(data => {

    let startYear = d3.min(data, d => d.Year);
    let endYear = d3.max(data, d => d.Year);
    while (pianoPattern[(endYear - startYear) % 12] === 1) {endYear++;}
    const years = d3.range(startYear, endYear);

    const whiteCount = years.filter((_, i) => pianoPattern[i % 12] === 0).length;
    const pianoContainer = d3.select("body")
        .append("div")
        .attr("id", "piano-container");
    const pianoSvg = pianoContainer.append("svg")
        .attr("width", whiteCount * keyWidth)
        .attr("height", keyHeight + axisHeight);

    const axisGroup = pianoSvg.append("g")
    const pianoKeys = pianoSvg.append("g")
        .attr("transform", `translate(0, ${axisHeight})`);
    
    // Big keys
    let keyIndex = 0;
    years.forEach((year, i) => {
        if (pianoPattern[i % 12] === 0) {
            pianoKeys.append("rect")
                .attr("x", keyIndex * keyWidth)
                .attr("y", 0)
                .attr("width", keyWidth)
                .attr("height", keyHeight)
                .attr("fill", "white")
                .attr("stroke", "#bbb");
            yearPositions.set(year, keyIndex * keyWidth + (keyWidth / 2));
            keyIndex++;
        }
    });

    // Small keys
    keyIndex = 0;
    years.forEach((year, i) => {
        if (pianoPattern[i % 12] === 0) {
            if (pianoPattern[(i + 1) % 12] === 1 && (i + 1) < years.length) {
                pianoKeys.append("rect")
                    .attr("x", (keyIndex + 1) * keyWidth - ((keyWidth * 0.7) / 2))
                    .attr("y", 0)
                    .attr("width", keyWidth * 0.7)
                    .attr("height", keyHeight * 0.7)
                    .attr("fill", "#333");
                
                yearPositions.set(year + 1, (keyIndex + 1) * keyWidth);
            }
            keyIndex++;
        }
    });

    // Axis
    years.forEach((year) => {
        if (year % tickInterval === 0 && yearPositions.has(year)) {
            axisGroup.append("text")
                .attr("x",  yearPositions.get(year))
                .attr("y", 20) 
                .attr("text-anchor", "middle")
                .style("font-family", "Arial, sans-serif")
                .style("font-size", "12px")
                .style("font-weight", "bold")
                .text(year);
            axisGroup.append("line")
                .attr("x1", yearPositions.get(year)).attr("x2",  yearPositions.get(year))
                .attr("y1", 25).attr("y2", axisHeight)
                .attr("stroke", "#888")
                .attr("stroke-width", 1);
        }
    });
});
