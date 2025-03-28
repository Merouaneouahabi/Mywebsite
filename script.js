fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vR9PP2C18SawMDZ_6hbrX-DWTknEvGnJThqmQYYrLZSPqY3yd_0aTCrnkNH5wW3VW9fvDY9zEqxlSOc/pub?gid=0&single=true&output=csv")
    .then(response => response.text())
    .then(csvText => {
        const rows = csvText.split("\n").map(row => row.split(","));
        const tableHead = document.getElementById("tableHead");
        const tableBody = document.getElementById("tableBody");

        // Create table headers
        tableHead.innerHTML = rows[0].map(header => `<th>${header.trim()}</th>`).join("");

        // Create table rows
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
    })
    .catch(error => console.error("Error fetching CSV:", error));
