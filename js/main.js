const width = 800;
const height = 500;
const disc_spacing = 70;
let num_discs = 5;

// create a svg obj
let svg= d3.select("body").append("svg").attr("height", height).attr("width", width);
let group=svg.append("g")

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

        // draw the circles for top 5 genres
        let circles = group.selectAll("circle")
            .data(top_5)
            .enter()
            .append("circle")
            .attr("r", d =>
            {
                return pop_scale(d["Average Popularity"]);
            })
            .attr("cx", (d, i) =>
                {return 50 + i * disc_spacing;}
            )
            .attr("cy", 100)
            .attr("fill", "black")

    })
}
