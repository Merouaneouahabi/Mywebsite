// Google Sheets CSV URL
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR9PP2C18SawMDZ_6hbrX-DWTknEvGnJThqmQYYrLZSPqY3yd_0aTCrnkNH5wW3VW9fvDY9zEqxlSOc/pub?gid=0&single=true&output=csv";

// Elements
const loadingMessage = document.getElementById("loadingMessage");
const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");
const dataTable = document.getElementById("dataTable");

// Fetching data from the Google Sheet
const fetchData = async () => {
    try {
        loadingMessage.style.display = "block"; // Show loading message

        const response = await fetch(sheetUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch data.");
        }
        const csvText = await response.text();
        const rows = csvText.split("\n").map(row => row.split(","));

        // Fill table head
        tableHead.innerHTML = rows[0].map(header => `<th>${header.trim()}</th>`).join("");

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

        loadingMessage.style.display = "none"; // Hide loading message
        dataTable.style.display = "table"; // Show table
    } catch (error) {
        loadingMessage.textContent = `Error loading data: ${error.message}`;
    }
};

// Load the data when the page is ready
fetchData();
