document.addEventListener("DOMContentLoaded", () => {
    // Existing Port Scanner logic
    const scanForm = document.getElementById("scan-form");
    if (scanForm) {
        scanForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const ip = document.getElementById("ip").value;
            const ports = document.getElementById("ports").value;
            const resultDiv = document.getElementById("result");

            resultDiv.innerHTML = "<p>Scanning...</p>";

            try {
                const response = await fetch("/scan", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ip, ports }),
                });

                const data = await response.json();
                let resultHtml = "<h4>Scan Results:</h4><ul>";
                for (const [port, status] of Object.entries(data)) {
                    resultHtml += `<li>Port ${port}: ${status}</li>`;
                }
                resultHtml += "</ul>";
                resultDiv.innerHTML = resultHtml;
            } catch (error) {
                resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
            }
        });
    }

    // Whois Form Logic
    const whoisForm = document.getElementById("whois-form");
    if (whoisForm) {
        whoisForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const domain = document.getElementById("domain").value;
            const resultDiv = document.getElementById("whois-result");

            resultDiv.innerHTML = "<p>Looking up domain...</p>";

            try {
                const response = await fetch("/whois", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ domain }),
                });

                const data = await response.json();

                if (data.error) {
                    resultDiv.innerHTML = `<p class="text-danger">Error: ${data.error}</p>`;
                } else {
                    let resultHtml = "<h4>Whois Information:</h4><ul>";
                    for (const [key, value] of Object.entries(data)) {
                        resultHtml += `<li><strong>${key}:</strong> ${value}</li>`;
                    }
                    resultHtml += "</ul>";
                    resultDiv.innerHTML = resultHtml;
                }
            } catch (error) {
                resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
            }
        });
    }

        // Geo Lookup Logic
    const geoForm = document.getElementById("geo-form");
    if (geoForm) {
        geoForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const ip = document.getElementById("geo-ip").value;
            const resultDiv = document.getElementById("geo-result");

            resultDiv.innerHTML = "<p>Looking up location...</p>";

            try {
                const response = await fetch("/geolookup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ip }),
                });

                const data = await response.json();

                if (data.error) {
                    resultDiv.innerHTML = `<p class="text-danger">Error: ${data.error}</p>`;
                } else {
                    let html = `<h4>Geolocation Info:</h4><ul>`;
                    for (const [key, value] of Object.entries(data)) {
                        html += `<li><strong>${key}:</strong> ${value}</li>`;
                    }
                    html += "</ul>";
                    resultDiv.innerHTML = html;
                }
            } catch (error) {
                resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
            }
        });
    }
    

});
