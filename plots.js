// handles initial display case
function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}

init();

// handles changes on webpage, parameter chosen from dropdown
function optionChanged(newSample) {
buildMetadata(newSample);
buildCharts(newSample);
}

// dynamic retrieval of metadata, same chosen parameter as above
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0]; // fisrt item of array assigned
    var PANEL = d3.select("#sample-metadata"); // selects div of this id

    PANEL.html("");
    PANEL.append("h6").text("ID: " + result.id);
    PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
    PANEL.append("h6").text("GENDER: " + result.gender);
    PANEL.append("h6").text("AGE: " + result.age);
    PANEL.append("h6").text("LOCATION: " + result.location);
    PANEL.append("h6").text("BBTYPE: " + result.bbtype);
    PANEL.append("h6").text("WFREQ: " + result.wfreq);
  });
}

/** BUILDS BAR CHART */
function buildCharts(sample){
  d3.json("samples.json").then((data) => {
    var sampleData = data.samples;
    var resultArray = sampleData.filter(obj => obj.id == sample);
    var result = resultArray[0];
    var yAxis = result.otu_ids.slice(0,10);
    var metadata = data.metadata;
    var resultArray2 = metadata.filter(sampleObj => sampleObj.id == sample);
    var result2 = resultArray2[0]; 

    var trace1 = {
      x: result.sample_values,
      y: yAxis,
      text: result.otu_labels,
      name: "OTU",
      type: "bar",
      orientation: "h"
    };
    var inf1 = [trace1];
    var layout1 = {
      title: "OTU",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };

    var trace2 = {
      x: result.otu_ids,
      y: result.sample_values,
      mode: 'markers',
      marker: {
        color: result.otu_ids,
        size: result.sample_values
      }
    };
    var inf2 = [trace2];
    var layout2 = {
      title: 'OTU',
      showlegend: false,
      width: 1200,
      height: 600
    };

    var data3 = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: result2.wfreq,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number"
      }
    ];
    var layout3 = { width: 600, height: 500, margin: { t: 0, b: 0 } };

    Plotly.newPlot('gauge', data3, layout3);
    Plotly.newPlot("bar", inf1, layout1);
    Plotly.newPlot("bubble", inf2, layout2);
  });
}
