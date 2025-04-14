// Port Scanner
document.getElementById('scanform').addEventListener('submit', async (e) => {
    e.preventDefault();

    const ip = document.getElementById('ip').value;
    const ports = document.getElementById('ports').value;
    const outputSection = document.getElementById('outputSection');
    const resultBox = document.getElementById('scanResult');
    const spinner = document.getElementById('spinner');
    const submitBtn = document.getElementById('submitBtn');

    resultBox.innerHTML = '';
    outputSection.classList.add('hidden');
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
        const res = await fetch('/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ip, ports }),
        });

        const data = await res.json();
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
        outputSection.classList.remove('hidden');

        if (data.error) {
            resultBox.innerHTML = `<div class="bg-red-600 text-white p-3 rounded-md">${data.error}</div>`;
            return;
        }

        let resultHtml = '';
        for (const port in data) {
            resultHtml += `
                <div class="bg-gray-800 text-white p-3 rounded-md shadow">
                    <strong>Port ${port}:</strong> ${data[port]}
                </div>
            `;
        }
        resultBox.innerHTML = resultHtml || `<div class="text-gray-300">No open ports found.</div>`;
    } catch (err) {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
        resultBox.innerHTML = `<div class="bg-red-600 text-white p-3 rounded-md">An error occurred. Please try again.</div>`;
        outputSection.classList.remove('hidden');
    }
});

// Domain Reputation Checker
// Domain Reputation Checker
document.getElementById('reputation-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const domain = document.getElementById('domain').value;
    const outputSection = document.getElementById('outputSection');
    const resultBox = document.getElementById('reputationResult');
    const spinner = document.getElementById('spinner');
    const submitBtn = document.getElementById('submitBtn');

    resultBox.innerHTML = '';
    outputSection.classList.add('hidden');
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
        const res = await fetch('/reputation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain }),
        });

        // Check if the response is OK
        if (!res.ok) {
            throw new Error(`Error: ${res.statusText}`);
        }

        const data = await res.json();
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
        outputSection.classList.remove('hidden');

        if (data.error) {
            resultBox.innerHTML = `<div class="bg-red-600 text-white p-3 rounded-md">${data.error}</div>`;
        } else {
            let resultHtml = `
                <div class="bg-gray-800 text-white p-3 rounded-md shadow">
                    <strong>Reputation Score:</strong> ${data.reputation_score || 'N/A'}
                </div>
                <div class="bg-gray-800 text-white p-3 rounded-md shadow">
                    <strong>Status:</strong> ${data.status || 'Unknown'}
                </div>
            `;
            resultBox.innerHTML = resultHtml || `<div class="text-gray-300">No reputation information available.</div>`;
        }
    } catch (err) {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
        resultBox.innerHTML = `<div class="bg-red-600 text-white p-3 rounded-md">${err.message}</div>`;
        outputSection.classList.remove('hidden');
    }
});

// Whois Lookup
document.getElementById('whois-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const domain = document.getElementById('domain').value;
    const outputSection = document.getElementById('outputSection');
    const resultBox = document.getElementById('whoisResult');
    const spinner = document.getElementById('spinner');
    const submitBtn = document.getElementById('submitBtn');

    resultBox.innerHTML = '';
    outputSection.classList.add('hidden');
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
        const res = await fetch('/whois', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain }),
        });

        const data = await res.json();
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
        outputSection.classList.remove('hidden');

        if (data.error) {
            resultBox.innerHTML = `<div class="bg-red-600 text-white p-3 rounded-md">${data.error}</div>`;
            return;
        }

        let resultHtml = `<div class="bg-gray-800 text-white p-3 rounded-md shadow">`;
        for (const key in data) {
            resultHtml += `<p><strong>${key}:</strong> ${data[key]}</p>`;
        }
        resultHtml += `</div>`;
        resultBox.innerHTML = resultHtml || `<div class="text-gray-300">No Whois information found.</div>`;
    } catch (err) {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
        resultBox.innerHTML = `<div class="bg-red-600 text-white p-3 rounded-md">An error occurred. Please try again.</div>`;
        outputSection.classList.remove('hidden');
    }
});

// Subdomain Scanner
document.getElementById('subdomain-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const domain = document.getElementById('domain').value;
    const subdomains = document.getElementById('subdomains').value;
    const outputSection = document.getElementById('outputSection');
    const resultBox = document.getElementById('subdomainResult');
    const spinner = document.getElementById('spinner');
    const submitBtn = document.getElementById('submitBtn');

    resultBox.innerHTML = '';
    outputSection.classList.add('hidden');
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
        const res = await fetch('/subdomain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain, subdomains }),
        });

        const data = await res.json();
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
        outputSection.classList.remove('hidden');

        if (data.error) {
            resultBox.innerHTML = `<div class="bg-red-600 text-white p-3 rounded-md">${data.error}</div>`;
            return;
        }

        let resultHtml = '';
        data.forEach(subdomain => {
            resultHtml += `
                <div class="bg-gray-800 text-white p-3 rounded-md shadow">
                    <strong>${subdomain.subdomain}:</strong> ${subdomain.status === 'found' ? subdomain.ip : 'Not Found'}
                </div>
            `;
        });
        resultBox.innerHTML = resultHtml || `<div class="text-gray-300">No subdomains found.</div>`;
    } catch (err) {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
        resultBox.innerHTML = `<div class="bg-red-600 text-white p-3 rounded-md">An error occurred. Please try again.</div>`;
        outputSection.classList.remove('hidden');
    }
});

// SSL Certificate Inspector
document.getElementById('ssl-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const domain = document.getElementById('domain').value;
    const outputSection = document.getElementById('outputSection');
    const resultBox = document.getElementById('sslResult');
    const spinner = document.getElementById('spinner');
    const submitBtn = document.getElementById('submitBtn');

    resultBox.innerHTML = '';
    outputSection.classList.add('hidden');
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
        const res = await fetch('/ssl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain }),
        });

        const data = await res.json();
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
        outputSection.classList.remove('hidden');

        if (data.error) {
            resultBox.innerHTML = `<div class="bg-red-600 text-white p-3 rounded-md">${data.error}</div>`;
            return;
        }

        let resultHtml = `
            <div class="bg-gray-800 text-white p-3 rounded-md shadow">
                <strong>Subject:</strong> ${data.Subject}
            </div>
            <div class="bg-gray-800 text-white p-3 rounded-md shadow">
                <strong>Issuer:</strong> ${data.Issuer}
            </div>
            <div class="bg-gray-800 text-white p-3 rounded-md shadow">
                <strong>Valid From:</strong> ${data["Valid From"]}
            </div>
            <div class="bg-gray-800 text-white p-3 rounded-md shadow">
                <strong>Valid To:</strong> ${data["Valid To"]}
            </div>
        `;
        resultBox.innerHTML = resultHtml || `<div class="text-gray-300">No SSL certificate information available.</div>`;
    } catch (err) {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
        resultBox.innerHTML = `<div class="bg-red-600 text-white p-3 rounded-md">An error occurred. Please try again.</div>`;
        outputSection.classList.remove('hidden');
    }
});
