d3.json("samples.json").then(function(data){
    firstPerson = data.metadata[0];
    Object.entries(firstPerson).forEach(([key, value]) => 
    console.log(key + ': ' + value));
});

function init(){

    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        
        sampleNames.forEach(sample => {
            selector.append("option").text(sample).property("value", sample);
        });
    })}

function optionChanged(newSample){
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample){
    d3.json("sample.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    PANEL.html("");
    PANEL.append("h6").text(result.location);
});
}


init();