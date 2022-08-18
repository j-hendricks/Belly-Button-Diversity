function init() {

  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {

    console.log("THE DATA:", data);

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

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples;
    console.log("SAMPLE ARRAY:", sampleArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var targetSample = sampleArray.filter(samp => samp.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = targetSample[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;

    console.log("OTU IDS:", otu_ids);
    console.log("OTU LABELS:", otu_labels);
    console.log("SAMPLE VALUES:", sample_values);
    
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaArray = data.metadata;
    var targetMeta = metaArray.filter(x => x.id == sample);
  
 

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstSampleMeta = targetMeta[0];

    console.log("HERE IS THE METADATA FOR THE FIRST SAMP:", firstSampleMeta)


    // 3. Create a variable that holds the washing frequency.
    var wfrq = firstSampleMeta.wfreq;

    console.log("HERE IS THE WASHING FREQ:", wfrq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    // var topTen = sample_values.sort((a,b) => b.sample_values = a.sample_values).slice(0,10);

    var yticks = otu_ids.map(id => "OTU " + id.toString()).slice(0,10).reverse();

    console.log("HERE ARE THE Y TICKS:", yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      type: 'bar',
      orientation: 'h'
  }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Title",
      height: 400,
      width: 350
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      size: sample_values,
      marker: {size: sample_values, sizeref: 1.5,
        colorscale: [
          [0.000, "rgb(68, 1, 84)"],
          [0.111, "rgb(72, 40, 120)"],
          [0.222, "rgb(62, 74, 137)"],
          [0.333, "rgb(49, 104, 142)"],
          [0.444, "rgb(38, 130, 142)"],
          [0.556, "rgb(31, 158, 137)"],
          [0.667, "rgb(53, 183, 121)"],
          [0.778, "rgb(109, 205, 89)"],
          [0.889, "rgb(180, 222, 44)"],
          [1.000, "rgb(253, 231, 37)"]
        ],
        color: otu_ids
      }
  }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Culture Per Sample",
      xaxis: {title: "OTU ID"},
      height: 400,
      width: 1050,
      hovermode: 'closest'
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
     value: wfrq,
     gauge: {
      axis: { range: [null, 10], tickwidth: 1},
      bar: {color: "black"},
      bgcolor: "white",
      borderwidth: 2,
      bordercolor: "black",
      steps: [
        {range: [0,2], color: "red"},
        {range: [2,4], color: "orange"},
        {range: [4,6], color: "yellow"},
        {range: [6,8], color: "green"},
        {range: [8,10], color: "darkgreen"}
      ]
     },
     type: "indicator",
     mode: "gauge+number",
     title: {text : "Belly Button Washing Frequency"}


  }];
        
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
         width: 500, 
         height: 400
    };
    
    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  });

}
