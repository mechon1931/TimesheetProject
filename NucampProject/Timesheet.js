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
    const historyTable = document.querySelector("#historyTableBody")
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

//Event Listener for Clock In/Out form
const clockForm = document.querySelector("#clockForm");

clockForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const clockInInput = document.querySelector("#clockIn");
    const lunchInput = document.querySelector("#lunch");
    const clockOutInput = document.querySelector("#clockOut");

    const clockInValue = clockInInput.value.split("T")[1];
    const lunchDuration = parseFloat(lunchInput.value);
    const clockOutValue = clockOutInput.value.split("T")[1];
    

    //Calculate total hours with lunch break subtracted.
    const totalHours = calculateTotalHours(clockInValue, clockOutValue, lunchDuration);

    //Update history data with new Clock In/Out record
    historyData.push({
        date: new Date().toISOString().split("T")[0], 
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

function calculateTotalWorkedHours() {
    let totalHours = 0;
    historyData.forEach(record => {
        totalHours += parseFloat(calculateTotalHours(record.clockIn, record.clockOut, parseFloat(record.lunch)));
    });
    return totalHours.toFixed(2)
}

updateHistoryTable();