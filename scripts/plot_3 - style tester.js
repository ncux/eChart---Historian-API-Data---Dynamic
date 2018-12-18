let API = {
    access_token: "eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJlNTMxY2Y3ZC0wMWUyLTQ1M2QtYTY5Mi0xNjY0ZTkwNmUzMGUiLCJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjpbImNsaWVudHMucmVhZCIsImhpc3Rvcmlhbl9yZXN0X2FwaS5yZWFkIiwicGFzc3dvcmQud3JpdGUiLCJjbGllbnRzLnNlY3JldCIsImhpc3Rvcmlhbl9yZXN0X2FwaS5hZG1pbiIsImhpc3Rvcmlhbl9yZXN0X2FwaS53cml0ZSIsImNsaWVudC5hZG1pbiIsImNsaWVudHMud3JpdGUiLCJ1YWEuYWRtaW4iLCJzY2ltLndyaXRlIiwic2NpbS5yZWFkIl0sInNjb3BlIjpbImNsaWVudHMucmVhZCIsImhpc3Rvcmlhbl9yZXN0X2FwaS5yZWFkIiwicGFzc3dvcmQud3JpdGUiLCJjbGllbnRzLnNlY3JldCIsImhpc3Rvcmlhbl9yZXN0X2FwaS5hZG1pbiIsImhpc3Rvcmlhbl9yZXN0X2FwaS53cml0ZSIsImNsaWVudC5hZG1pbiIsImNsaWVudHMud3JpdGUiLCJ1YWEuYWRtaW4iLCJzY2ltLndyaXRlIiwic2NpbS5yZWFkIl0sImNsaWVudF9pZCI6ImFkbWluIiwiY2lkIjoiYWRtaW4iLCJhenAiOiJhZG1pbiIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJyZXZfc2lnIjoiNGJlMWJiYzAiLCJpYXQiOjE1NDUwOTU0MTgsImV4cCI6MTU0NTEzODYxOCwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3VhYS9vYXV0aC90b2tlbiIsInppZCI6InVhYSIsImF1ZCI6WyJhZG1pbiIsImNsaWVudHMiLCJoaXN0b3JpYW5fcmVzdF9hcGkiLCJwYXNzd29yZCIsImNsaWVudCIsInVhYSIsInNjaW0iXX0.EKiBf3upcFttiz-bHQDV21H3m-RfCn4FfRIuLtxoB95t1WJF_BDdmnYJ2nZ6kTjvHIavs9n7D0iPVu-Qibe_BwONAQpYpZxBkLXyyMAXuYu3-nezKklQQarib8WQH5-_T-g4yn6GELScTitNB8-UZfn3atF_jqYmUUSsjhHfekzYkMG4QkI-x7ikb2oGYeXjS_ztKBFCOvqqbYJZAX2qxXePMhZSYoVhRMHrLZvrH78kN5pXEqs-GY-dQx6DKUulaSAtJ9UTZTTJnrNkTGJ92dRSj7oUQk8b6VC1TDFEn4gyab4J6RmJXcTN_qlJkcLRtvsiKy__HbDplm3xpwmmzg",
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
        // category: 'time'
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
        // xhr.open('GET', API.tagsUrl, true);
        // xhr.setRequestHeader('Authorization', 'Bearer ' + API.access_token);

        xhr.open('GET', `./data/tags - verbose.json`, true);

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

    try {

        let xhr = new XMLHttpRequest();
        // xhr.open('GET', queryUrl, true);
        // xhr.setRequestHeader('Authorization', 'Bearer ' + API.access_token);

        xhr.open('GET', `./data/WIN-9DBOGP80695.Simulation00052 - OG.json`, true);

        xhr.onload = async () => {
            if(xhr.status === 200) {
                // console.log(xhr.responseText);
                let historianData = await JSON.parse(xhr.responseText);
                let timeStampsAndValues = historianData.Data[0].Samples;
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





