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



        // Reverse DNS Lookup
        const rdnsForm = document.getElementById("rdns-form");
        if (rdnsForm) {
            rdnsForm.addEventListener("submit", async (e) => {
                e.preventDefault();
    
                const ip = document.getElementById("rdns-ip").value;
                const resultDiv = document.getElementById("rdns-result");
    
                resultDiv.innerHTML = "<p>Resolving hostname...</p>";
    
                try {
                    const response = await fetch("/reversedns", {
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
                        resultDiv.innerHTML = `
                            <h4>Reverse DNS Result:</h4>
                            <ul>
                                <li><strong>Hostname:</strong> ${data.hostname}</li>
                                <li><strong>Aliases:</strong> ${data.aliases.join(', ')}</li>
                                <li><strong>IP Addresses:</strong> ${data.ip_addresses.join(', ')}</li>
                            </ul>
                        `;
                    }
                } catch (error) {
                    resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
                }
            });
        }
    

            // Subdomain Scanner
    const subForm = document.getElementById("subdomain-form");
    if (subForm) {
        subForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const domain = document.getElementById("domain").value;
            const subdomains = document.getElementById("subdomains").value;
            const resultDiv = document.getElementById("subdomain-result");

            resultDiv.innerHTML = "<p>Scanning for subdomains...</p>";

            try {
                const response = await fetch("/subdomain", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        domain: domain,
                        subdomains: subdomains || "www,mail,dev,ftp,api"
                      }),
                });

                const data = await response.json();

                if (data.error) {
                    resultDiv.innerHTML = `<p class="text-danger">Error: ${data.error}</p>`;
                } else if (data.length === 0) {
                    outputDiv.innerHTML = `<div class="bg-yellow-700 p-4 rounded-md">No active subdomains found for ${domain}.</div>`;
                } else {
                    let resultHTML = `<div class="bg-gray-800 p-4 rounded-md"><h2 class="text-lg font-semibold mb-2">Active Subdomains</h2><ul class="list-disc pl-5 space-y-1">`;
                    data.forEach(item => {
                      resultHTML += `<li><strong>${item.subdomain}</strong> → ${item.ip}</li>`;
                    });
                    resultHTML += "</ul></div>";
                    outputDiv.innerHTML = resultHTML;
                  }
            } catch (error) {
                resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
            }
        });
    }
    

    //Traceroute
    document.addEventListener("DOMContentLoaded", () => {
        const traceForm = document.getElementById("traceroute-form");
        if (traceForm) {
            traceForm.addEventListener("submit", async (e) => {
                e.preventDefault();
    
                const target = document.getElementById("target").value;
                const output = document.getElementById("trace-output");
    
                output.textContent = "Running traceroute...";
    
                try {
                    const res = await fetch("/traceroute", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ target }),
                    });
    
                    const data = await res.json();
                    if (data.error) {
                        output.textContent = `Error: ${data.error}`;
                    } else {
                        output.textContent = data.output;
                    }
                } catch (err) {
                    output.textContent = `Error: ${err.message}`;
                }
            });
        }
    });
    
    
});
