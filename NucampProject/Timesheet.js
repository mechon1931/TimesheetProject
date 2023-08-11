//Clock In/Out History Data
const historyData = [];

//Calculate Total Work hours
function calculateTotalHours(clockIn, clockOut, lunchDuration) {
    const startTime = new Date(`2023-08-10T${clockIn}:00`);
    const endTime = new Date(`2023-08-10T${clockOut}:00`);
    const timeDiff = endTime - startTime - (lunchDuration * 60 * 60 * 1000); // Subtract lunch break
    const hours = timeDiff / (1000 * 60 * 60);

    return hours.toFixed(2)
};

//Update ClockIn/ClockOut history table
function updateHistoryTable() {
    const historyTable = document.querySelector("#historyTableBody"); 
    const totalWorkedHoursCell = document.querySelector("#totalWorkedHours");

    //Clear existing rows.
    historyTable.innerHTML = '';

    //Populate table with history
    historyData.forEach(record => {
        const newRow = historyTable.insertRow();

        const dateCell = newRow.insertCell(0);
        const clockInCell = newRow.insertCell(1);
        const lunchCell = newRow.insertCell(2);
        const clockOutCell = newRow.insertCell(3);
        const totalHoursCell = newRow.insertCell(4);

        dateCell.textContent = record.date;
        clockInCell.textContent = record.clockIn;
        lunchCell.textContent = record.lunch;
        clockOutCell.textContent = record.clockOut;
        totalHoursCell.textContent = calculateTotalHours(record.clockIn, record.clockOut, parseFloat(record.lunch));
        totalWorkedHoursCell.textContent = calculateTotalWorkedHours();

        if(occupationData) {
            const occupationCell = newRow.insertCell(5);
            const employmentCell = newRow.insertCell(6);
            const medianWageCell = newRow.insertCell(7);
            
            occupationCell.textContent = occupationData.occupationTitle;
            employmentCell.textContent = occupationData.employmentEstimate;
            medianWageCell.textContent = occupationData.medianHourlyWage;     
        }
    });
};

function calculateTotalWorkedHours() {
    let totalHours = 0;
    historyData.forEach(record => {
        totalHours += parseFloat(calculateTotalHours(record.clockIn, record.clockOut, parseFloat(record.lunch)));
    });
    return totalHours.toFixed(2)
};

async function fetchOccupationData(seriesID) {
    const apiUrl = 'http://api.bls.gov/publicAPI/v2/timeseries/data/';

    const requestOptions = {
        method: 'GET'
    };

    try {
        const response = await fetch(`${apiUrl}${seriesID}`, requestOptions);
        const data = await response.json();
        // Handle the retrieved data here
        console.log(data);

        const fetchedDataElement = document.getElementById('fetchedData');
        fetchedDataElement.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Error:', error);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const fetchDataButton = document.getElementById('fetchDataButton');
    const updateTableButton = document.getElementById('updateTableButton');
    const occupationSelect = document.getElementById('occupation');


    fetchDataButton.addEventListener('click', function () {
        const selectedOccupation = occupationSelect.value; // Get the selected occupation's value
        fetchOccupationData(selectedOccupation);
    });

    updateTableButton.addEventListener('click', updateHistoryTable);  
});

// Call the fetchTaxData function
fetchOccupationData();
updateHistoryTable();
