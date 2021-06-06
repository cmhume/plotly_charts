function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var samplesArray = data.samples;  
    // Create a variable that filters the samples for the object with the desired sample number.
    var sampleData = samplesArray.filter(sampleObj => sampleObj.id == sample);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var resultsArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var sampleObject = sampleData[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var results = resultsArray[0]

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = sampleObject.otu_ids;
   
    var otuLabels = sampleObject.otu_labels;
 
    var sampleValues = sampleObject.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var wfreq = parseFloat(results.wfreq);
    // Create the yticks for the bar chart.
    var yticks= otuIds.slice(0,10).map(x =>`OTU ID ${x}`).reverse();
    var xticks= sampleValues.slice(0,10).reverse();
    var textLabels= otuLabels.slice(0,10).reverse();
    console.log(yticks);
    console.log(xticks);
    console.log(textLabels);
    // // Use Plotly to plot the bar data and layout.
    var trace = {
      type: "bar",
      x: xticks,
      y: yticks,
      text: textLabels,
      orientation: "h"
    };
    var barData = [trace];
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Belly Button Biodiversity Dashboard",
      xaxis: { title: "Sample Values" },
      yaxis: { 
        ticktext: yticks
      },
      paper_bgcolor:'rgba(0,0,0,0)',
      plot_bgcolor:'rgba(0,0,0,0)'
    };
    
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    
    // Use Plotly to plot the bubble data and layout.
    var trace1 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker:{
        color:otuIds,
        size:sampleValues,
        colorscale:"Earth"
      },
      
     };
    var bubbleData =[trace1];
      
     // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis:{title: "OTU ID"},
      showlegend: false,
      paper_bgcolor:'rgba(0,0,0,0)',
      plot_bgcolor:'rgba(0,0,0,0)'
       
    };
    
    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
   
    
// 4. Create the trace for the gauge chart.
  var gaugeData = [
  {
    value: wfreq,
    title:{text:"Belly Button Washing Frequency"},
    type:"indicator",
    mode:"gauge+number",
    gauge: {
     axis: { range: [null, 10], tickwidth: 2, tickcolor: "black" },
     bar: { color: "black" },
     bgcolor: 'white',
     borderwidth: 2,
     bordercolor: "black",
     steps: [
       { range: [0, 2], color: "red" },
       { range: [2, 4], color: "orange" },
       { range: [4, 6], color: "yellow" },
       { range: [6, 8], color: "green" },
       { range: [8, 10], color: "darkgreen" },
       
     ]
   }
  }
  
  ];
 
// 5. Create the layout for the gauge chart.
var gaugeLayout = { 
  width: 600,
  height: 500,
  margin:{t: 0, b:0},
  paper_bgcolor:'rgba(0,0,0,0)',
  plot_bgcolor:'rgba(0,0,0,0)'
  
};

//6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot("gauge", gaugeData, gaugeLayout);
});
}

