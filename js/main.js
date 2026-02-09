const width = 800;
const height = 500;
const disc_spacing = 70;
let num_discs = 5;
const centre_size_prop = 0.25;

// create a svg obj
let svg= d3.select("body").append("svg").attr("height", height).attr("width", width);
let group=svg.append("g")
let circlesGroup = group.append("g")
    .attr("class", "circles-group");

// linear scale
let pop_scale = d3.scaleLinear().domain([0, 100]).range([0, 50]);

// render the disc visualization
renderDiscs();

function renderDiscs()
{
    // initial year to render on screen
    const initial_year = 1990;
    // load the csv, convert numeric data to numbers
    d3.csv("data/energy_and_pop_data.csv", row => {
        row.Year = +row.Year;
        row["Average Popularity"] = +row["Average Popularity"];
        row["Average Energy"] = +row["Average Energy"];
        return row;
    }).then(data =>
    {
        // log the data, filter the data by the initial year
        const dataForYear = data.filter(d => d.Year === initial_year);

        // sort the genres by popularity descending
        const sortedGenres = dataForYear.sort((a, b) =>
        {return b["Average Popularity"] - a["Average Popularity"]});

        console.log(sortedGenres);
        let top_5 = sortedGenres.slice(0, num_discs);

        // base discs
        let discs = circlesGroup.selectAll(".disc")
            .data(top_5)
            .enter()
            .append("g")
            .attr("class", "disc")
            .attr("transform", (d, i) =>
                `translate(${50 + i * disc_spacing}, 100)`
            );
        discs.append("circle")
            .attr("r", d => pop_scale(d["Average Popularity"]))
            .attr("fill", "black");

        // concentric rings
        generateRings(discs)

        // center ring
        discs.append("circle").attr("r", d =>
        pop_scale(d["Average Popularity"] * centre_size_prop)).attr("fill", "red");

    })
}

// generate the rings for each vinyl disc
function generateRings(discs)
{
    discs.each(function(d)
    {
        // retrieve the disc rad
        const discRad = pop_scale(d["Average Popularity"]);

        const energy = (d["Average Energy"]);

        // eventually this is based on energy (the formula is round(energy * 10))
        const num_rings = Math.round(10 * energy);
        console.log('energy: ' + energy);
        console.log('num_rings: ' + num_rings);
        const rings = d3.range(1, num_rings + 1);

        d3.select(this)
            .selectAll(".ring")
            .data(rings)
            .enter()
            .append("circle")
            .attr("class", "ring")
            .attr("r", r => discRad * (r / (rings.length + 1)))
            .attr("fill", "none")
            .attr("stroke", "#818281")
            .attr("stroke-width", 1)
    })
}
