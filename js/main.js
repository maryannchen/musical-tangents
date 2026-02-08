// render the disc visualization
renderDiscs();

function renderDiscs()
{
    // initial year to render on screen
    const initial_year = 2000;
    // load the csv, convert numeric data to numbers
    d3.csv("data/energy_and_pop_data.csv", row => {
        row.Year = +row.Year;
        row["Average Popularity"] = +row["Average Popularity"];
        row["Average Energy"] = +row["Average Energy"];
        return row;
    }).then(data =>
    {
        // log the data, filter the data by the initial year
        console.log('data row: ', data);
        const dataForYear = data.filter(d => d.Year === initial_year);
        console.log(dataForYear);
    })
}
