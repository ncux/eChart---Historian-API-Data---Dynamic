let API = {
    access_token: "",
    tagsUrl: 'https://dev.sealu.net:4433/api/v1/forward?url=/historian-rest-api/v1/tagslist',
    dataUrl: "https://dev.sealu.net:4433/api/v1/forward?url=/historian-rest-api/v1/datapoints/calculated"
};



// user inputs 
const tagSelector = document.querySelector('#tagSelector');
const startDate = document.querySelector('#startDate');
const endDate = document.querySelector('#endDate');
const startTime = document.querySelector('#startTime');
const endTime = document.querySelector('#endTime');
const count = document.querySelector('#count');
const interval = document.querySelector('#interval');
const plotButton = document.querySelector('#plotButton');


// holds the tags
let tagsArray = [];

//  for the chart
let valuesArray = [];
let timeArray = [];
let samplesSource = tagSelector.value;
let chartType = {
    bar: 'bar',
    line: 'line'
};

// eChart parameters
const option = {
    title: {
        text: samplesSource
    },
    tooltip: {},
    legend: {
        data:[]
    },
    xAxis: {
        data: timeArray,
    },
    yAxis: {},
    series: [{
        name: samplesSource,
        type: chartType.bar,
        data: valuesArray
    }]
};


// gets tags
async function getTags() {
    try {

        let xhr = new XMLHttpRequest();
        xhr.open('GET', API.tagsUrl, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + API.access_token);

        // xhr.open('GET', `./data/tags - verbose.json`, true);

        xhr.onload = async () => {
            if(xhr.status === 200) {
                // console.log(xhr.responseText);
                let response = await JSON.parse(xhr.responseText);
                let tags = response.Tags;
                // console.log(tags);
                tags.map(tag => {
                    let allTags = tag.Tagname;
                    tagsArray.push(allTags);
                    populateTagsInput();
                });
            }
        };

        xhr.send();

    } catch (e) {
        console.log(e);
    }
}


// populates the tags dropdown menu
function populateTagsInput() {
    let tagOption = document.createElement('option');
    tagsArray.forEach(tag => {
        tagOption.textContent = tag;
        tagOption.setAttribute('value', tag);
        tagSelector.append(tagOption);
    });
}


// listen for form submit and call the function buildQueryUrl, which appends form values to the dataUrl
plotButton.addEventListener('click', buildQueryUrl);

function buildQueryUrl(e) {
    e.preventDefault();
    console.log('button clicked');

    // change interval value to milliseconds
    const milliseconds = Math.ceil((parseInt(interval.value))*1000);

    let queryUrl = `${API.dataUrl}/${tagSelector.value}/${startDate.value}T${startTime.value}/${endDate.value}T${endTime.value}/1/${count.value}/${milliseconds}`;
    console.log(queryUrl);

    try {

        let xhr = new XMLHttpRequest();
        xhr.open('GET', queryUrl, true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + API.access_token);

        // xhr.open('GET', `./data/WIN-9DBOGP80695.Simulation00052 - OG.json`, true);

        xhr.onload = async () => {
            if(xhr.status === 200) {
                // console.log(xhr.responseText);
                let historianData = await JSON.parse(xhr.responseText);
                let timeStampsAndValues = historianData['Data'][0].Samples;
                console.log(timeStampsAndValues);
                timeStampsAndValues.forEach(value => {
                    timeArray.push(simplifyTime(value.TimeStamp));
                    // valuesArray.push(Math.ceil(value.Value));
                    valuesArray.push((parseInt(value.Value)).toFixed(0));   // removes decimal fraction
                    plotChart();
                })
            }
        };

        xhr.send();

    } catch (e) {
        console.log(e);
    }

}



// trims off the milliseconds
function simplifyTime(timestamp) {
    return timestamp.slice(0, 19);
}


let plot = echarts.init(document.querySelector('#main'));


function plotChart() {
    plot.setOption(option);
}





