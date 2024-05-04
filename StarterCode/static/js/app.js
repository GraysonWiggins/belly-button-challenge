// // URL for the samples.json file
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
// Use D3 library to read the JSON file from the URL
d3.json(url).then(function(data) {
    console.log(data);
  });
  
// Function to populate the dropdown menu with test subject IDs
function populateDropdown() {
    // Use D3 to import data and populate the dropdown menu
    d3.json(url).then(function(data) {
        // Extract test subject IDs from the fetched data
        let names = data.names;

        // D3 to select the drop-down menu in your HTML
        let dropdown = d3.select("#selDataset");

        // Clear existing dropdown options
        dropdown.selectAll("option").remove();

        // Populate the drop-down menu with the test subject IDs
        dropdown.selectAll("option")
            .data(names)
            .enter()
            .append("option")
            .text(function(d) { return d; });

        // Select the first test subject ID as the default option
        dropdown.property("value", names[0]);

        // Create the initial dashboard
        optionChanged(names[0], data);
    });
}

// Function to update the dashboard when a sample is changed
function optionChanged(value) {
  d3.json(url).then(function(data) {  
    // Log the new value
    console.log(value);

    // Call functions to update the dashboard
    buildBarChart(value, data);
    buildBubbleChart(value, data);
    buildMetadata(value, data);
});
}

// Function to build the bar chart
function buildBarChart(value, data) {
    // Find the index of the selected individual ID
    let index = data.names.indexOf(value);

    // Extract the top 10 OTUs data for the selected individual
    let sampleValues = data.samples[index].sample_values.slice(0, 10).reverse();
    let otuIds = data.samples[index].otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    let otuLabels = data.samples[index].otu_labels.slice(0, 10).reverse();

    // Create the trace for the bar chart
    let trace1 = {
        x: sampleValues,
        y: otuIds,
        text: otuLabels,
        type: "bar",
        orientation: "h"
    };

    // Define the data array for the plot
    let plotData = [trace1];

    // Define the layout for the plot
    let layout = {
        title: `Top 10 OTUs Found for ${value}`,
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
    };

    // Plot the horizontal bar chart using Plotly
    Plotly.newPlot("bar", plotData, layout);
}


// Function to build the bubble chart
function buildBubbleChart(value, data) {
    // Find the index of the selected individual ID
    const index = data.names.indexOf(value);

    // Extract data for the bubble chart
    const otuIds = data.samples[index].otu_ids;
    const sampleValues = data.samples[index].sample_values;
    const otuLabels = data.samples[index].otu_labels;

    // Create the trace for the bubble chart
    let trace1 = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
            size: sampleValues,
            color: otuIds,
            colorscale: 'Earth', // You can choose a different colorscale
            colorbar: {
                title: 'OTU ID'
            }
        }
    };

    // Define the data array for the plot
    let plotData = [trace1];

    // Define the layout for the plot
    let layout = {
        title: `Bubble Chart for Sample ${value}`,
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Values" }
    };

    // Plot the bubble chart using Plotly
    Plotly.newPlot("bubble", plotData, layout);
}

// Function to build the metadata display
function buildMetadata(value, data) {
    // Find the index of the selected individual ID
    const index = data.names.indexOf(value);

    // Select the metadata panel in your HTML
    let metadataPanel = d3.select("#sample-metadata");

    // Clear existing metadata
    metadataPanel.html("");

    // Extract metadata for the selected individual
    const metadata = data.metadata[index];

    // Display the metadata information
    Object.entries(metadata).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
    });
}
// Initialize the dashboard
function init() {
    populateDropdown();
}

// Call the init function to initialize the dashboard
init();
