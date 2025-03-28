const loadingIndicator = document.getElementById("loading");
const errorDisplay = document.getElementById("error");
const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");

const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR9PP2C18SawMDZ_6hbrX-DWTknEvGnJThqmQYYrLZSPqY3yd_0aTCrnkNH5wW3VW9fvDY9zEqxlSOc/pub?gid=0&single=true&output=csv";

const fetchData = async () => {
    loadingIndicator.style.display = "block";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        const rows = csvText.split("\n").map(row => row.split(","));

        tableHead.innerHTML = rows[0].map(header => `<th>${header.trim()}</th>`).join("");
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
    } catch (error) {
        errorDisplay.textContent = `Error loading data: ${error.message}`;
        errorDisplay.style.display = "block";
    } finally {
        loadingIndicator.style.display = "none";
    }
};

fetchData();
