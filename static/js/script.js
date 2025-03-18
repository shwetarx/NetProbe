document.addEventListener("DOMContentLoaded", () => {
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
});
