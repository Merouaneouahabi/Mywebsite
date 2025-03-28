// Google Sheets CSV URL
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR9PP2C18SawMDZ_6hbrX-DWTknEvGnJThqmQYYrLZSPqY3yd_0aTCrnkNH5wW3VW9fvDY9zEqxlSOc/pub?gid=0&single=true&output=csv";

// Elements
const loadingMessage = document.getElementById("loadingMessage");
const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");
const dataTable = document.getElementById("dataTable");
const errorMessage = document.getElementById("errorMessage");
const searchInput = document.getElementById("searchInput");

let allRows = []; // Store all rows for searching and sorting

// Function to clear the table
const clearTable = () => {
    tableHead.innerHTML = "";
    tableBody.innerHTML = "";
};

// Function to display error message
const displayError = (message) => {
    loadingMessage.style.display = "none";
    dataTable.style.display = "none";
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
};

// Function to build the table
const buildTable = (rows) => {
    clearTable();  // Clear existing table

    if (rows.length === 0) {
        displayError("No data found.");
        return;
    }

    // Fill table head
    const headers = rows[0];
    tableHead.innerHTML = headers.map((header, index) => `<th data-index="${index}">${header.trim()} <i class="fas fa-sort"></i></th>`).join("");

    // Add click event to sort headers
    tableHead.querySelectorAll("th").forEach(th => {
        th.addEventListener("click", () => {
            const index = parseInt(th.dataset.index);
            sortTable(index);
        });
    });

    // Fill table body
    rows.slice(1).forEach(row => {
        const rowHTML = row.map(cell => {
            cell = cell.trim();
            if (cell.startsWith("http")) {
                return `<td><a href="${cell}" target="_blank">${cell}</a></td>`;
            } else if (cell.includes("@")) {
                return `<td><a href="mailto:${cell}">${cell}</a></td>`;
            } else {
                return `<td>${cell}</td>`;
            }
        }).join("");

        tableBody.innerHTML += `<tr>${rowHTML}</tr>`;
    });
};

// Function to sort table
const sortTable = (columnIndex) => {
    const sortedRows = [...allRows.slice(1)].sort((a, b) => {
        const cellA = a[columnIndex] || ""; // Handle undefined cells
        const cellB = b[columnIndex] || "";

        return cellA.localeCompare(cellB, undefined, { numeric: true, sensitivity: 'base' }); // Natural sorting
    });
    buildTable([allRows[0], ...sortedRows]); // Rebuild table with sorted data
};

// Function to filter data
const filterData = (searchTerm) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filteredRows = allRows.filter(row => {
        return row.some(cell => {
            if (cell === null || cell === undefined) return false; // Handle null/undefined values

            return cell.toLowerCase().includes(lowerSearchTerm);
        });
    });

    if (filteredRows.length > 0) {
      buildTable(filteredRows);
    } else {
        clearTable();
        displayError("No matching data found."); //Show error
    }
};

// Fetching data from the Google Sheet
const fetchData = async () => {
    try {
        loadingMessage.style.display = "block";
        errorMessage.style.display = "none";
        dataTable.style.display = "none";

        const response = await fetch(sheetUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        const csvText = await response.text();
        allRows = csvText.split("\n").map(row => row.split(","));

        buildTable(allRows);

        loadingMessage.style.display = "none";
        dataTable.style.display = "table";
    } catch (error) {
        displayError(`Error loading data: ${error.message}`);
    }
};

// Event listeners
searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value;
    filterData(searchTerm);
});

// Load the data when the page is ready
fetchData();
