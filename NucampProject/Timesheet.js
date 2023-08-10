//Clock In/Out History Data
const historyData = [
    { date: '2023-08-10',
      clockIn: '08:00',
      lunch: '12:00 PM',
      clockOut: '16:30',
    },
];




//Calculate Total Work hours
function calculateTotalHours(clockIn, clockOut) {
    const startTime = new Date(clockIn);
    const endTime = new Date(clockOut);
    const timeDiff = endTime - startTime;
    const hours = timeDiff / (1000 * 60 * 60);

    return hours.toFixed(2)
};

//Update ClockIn/ClockOut history table
function updateHistoryTable() {
    const historyTable = document.querySelector("#historyTableBody")

    //Clear existing rows.
    historyTable.innerHTML = '';

    //Populate table with history
    historyData.forEach(record => {
        const newRow = historyTable.insertRow();

        const dateCell = newRow.insertCell(0);
        const clockInCell = newRow.insertCell(1);
        const lunch = newRow.insertCell(2);
        const clockOutCell = newRow.insertCell(3);
        const totalHoursCell = newRow.insertCell(4);

        dateCell.textContent = record.date;
        clockInCell.textContent = record.clockIn;
        lunch.textContent = record.lunch;
        clockOutCell.textContent = record.clockOut;
        totalHoursCell.textContent = calculateTotalHours(record.clockIn, record.clockOut);
    });
};

//Event Listener for Clock In/Out form
const clockForm = document.querySelector("#clockForm");

clockForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const clockInInput = document.querySelector("#clockIn");
    const clockOutInput = document.querySelector("#clockOut");

    const clockInValue = clockInInput.value;
    const clockOutValue = clockOutInput.value;

    //Update history data with new Clock In/Out record
    historyData.push({
        date: new Date().toISOString().split("T")[0], 
        clockIn: clockInValue.split("T")[1], 
        clockOut: clockOutValue.split("T")[1],
    });

    //update the Clock In/Out history table
    updateHistoryTable();

    //clear form inputs
    clockInInput.value = '';
    clockOutInput.value = '';
});

updateHistoryTable();