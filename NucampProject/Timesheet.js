import Freecurrencyapi from './node_modules/@everapi/freecurrencyapi-js/index.js';

//Clock In/Out History Data
const historyData = [];
let calculatedSalary; // Declare a global variable to store the calculated salary


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
    });
};


function calculateTotalWorkedHours() {
    let totalHours = 0;
    historyData.forEach(record => {
        totalHours += parseFloat(calculateTotalHours(record.clockIn, record.clockOut, parseFloat(record.lunch)));
    });
    return totalHours.toFixed(2)
};

//Event listerner for Clock In/Out form
const clockForm = document.querySelector("#clockForm");
//Updates the table for Clock IN/Out
clockForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const clockInInput = document.querySelector("#clockIn");
    const lunchInput = document.querySelector("#lunch");
    const clockOutInput = document.querySelector("#clockOut");

    const clockInValue = clockInInput.value.split("T")[1];
    const lunchDuration = parseFloat(lunchInput.value);
    const clockOutValue = clockOutInput.value.split("T")[1];

    const selectedDate = new Date(clockInInput.value);
    const formattedDate = `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}`;

    //Calculate total hours with lunch break subtracted.
    const totalHours = calculateTotalHours(clockInValue, clockOutValue, lunchDuration);

    //Update history data with new Clock In/Out record
    historyData.push({
        date: formattedDate, // Use the formatted date
        clockIn: clockInValue,
        lunch: lunchDuration.toFixed(1), 
        clockOut: clockOutValue,
    });

    //update the Clock In/Out history table
    updateHistoryTable();

    //clear form inputs
    clockInInput.value = '';
    lunchInput.value = '';
    clockOutInput.value = '';
});

const calculateSalaryButton = document.querySelector("#calculateSalaryButton");
calculateSalaryButton.addEventListener("click", function() {
    updateSalary();
});

const hourlyWageInput = document.querySelector("#hourlyWage");
hourlyWageInput.addEventListener("keyup", function(e) {
    if(e.key ==="Enter") {
        updateSalary();
    }
});

function updateSalary() {
    const hourlyWage = parseFloat(document.querySelector("#hourlyWage").value);
    const totalWorkedHours = calculateTotalWorkedHours();;

    if(!isNaN(hourlyWage) && !isNaN(totalWorkedHours)) {
        calculatedSalary = (hourlyWage * totalWorkedHours) * 52;
        const calculatedSalarySpan = document.querySelector("#totalSalary");
        const formattedSalary = calculatedSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        calculatedSalarySpan.textContent = formattedSalary;
    } else {
        console.log("Invalid Input");
        calculatedSalary = 0; // Set a default value for calculatedSalary
    }
};


const convertCurrencyButton = document.querySelector("#convertCurrencyButton");
convertCurrencyButton.addEventListener("click", function() {
    convertCurrency();
});

async function convertCurrency() {
    try{
        const apiKey = 'fca_live_eQ2KqNrvAKZPpM3GwQlvsMZjO8zhuQr6TSFL4poH';

        const freecurrencyapi = new Freecurrencyapi(apiKey);

        const response = await freecurrencyapi.latest({
            base_currency: 'USD',
            currencies: 'EUR'
        });
        
        const eurRate = response.data.EUR; // Access the EUR exchange rate from the response
        const convertedSalaryAmount = (calculatedSalary * eurRate);
        console.log(calculatedSalary)
        const convertedSalarySpan = document.querySelector("#convertedSalaryAmount");
        const formattedConvertedSalary = convertedSalaryAmount.toLocaleString("en-US", { style: "currency", currency: "EUR" });

        convertedSalarySpan.textContent = formattedConvertedSalary;



        console.log(response);
    } catch(error) {
        console.error("Error converting currency", error);
    };
};



