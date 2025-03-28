/* futuristic-script.js */
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR9PP2C18SawMDZ_6hbrX-DWTknEvGnJThqmQYYrLZSPqY3yd_0aTCrnkNH5wW3VW9fvDY9zEqxlSOc/pub?gid=0&single=true&output=csv';
const dataContainer = document.getElementById('data-container');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMessage = document.getElementById('error-message');
const dataTable = document.getElementById('data-table');

function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(value => value.trim());
        if (values.length === headers.length) {
            const row = {};
            for (let j = 0; j < headers.length; j++) {
                row[headers[j]] = values[j];
            }
            data.push(row);
        }
    }
    return { headers, data };
}

function createTable(headers, data) {
    let tableHTML = '<thead><tr>';
    headers.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';

    data.forEach(row => {
        tableHTML += '<tr>';
        headers.forEach(header => {
            let cellData = row[header];
            let displayData = cellData;

            if (cellData.includes('@') && cellData.includes('.')) {
                displayData = `<a href="mailto:${cellData}" class="action-button">Email</a>`;
            } else if (cellData.startsWith('http')) {
                displayData = `<a href="${cellData}" target="_blank" class="action-button">Link</a>`;
            }

            tableHTML += `<td data-label="${header}">${displayData}</td>`;
        });
        tableHTML += '</tr>';
    });
    tableHTML += '</tbody>';
    dataTable.innerHTML = tableHTML;
}

fetch(csvUrl)
    .then(response => response.text())
    .then(csvData => {
        loadingIndicator.style.display = 'none';
        const { headers, data } = parseCSV(csvData);
        createTable(headers, data);
    })
    .catch(error => {
        loadingIndicator.style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Failed to fetch data. Please try again later.';
        console.error('Error fetching data:', error);
    });
