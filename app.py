from flask import Flask, request, jsonify, render_template
import socket
import subprocess
import ssl
import requests
import whois
import re
from datetime import datetime

app = Flask(__name__, template_folder='templates')

# --------------------------
# Utility Functions
# --------------------------
def is_valid_ip(ip):
    pattern = r"^(?:\d{1,3}\.){3}\d{1,3}$"
    return bool(re.match(pattern, ip))

def is_valid_domain(domain):
    pattern = r"^(?!-)([A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,6}$"
    return bool(re.match(pattern, domain))

# --------------------------
# 1. Port Scanner
# --------------------------
def scan_ports(ip, ports):
    results = {}
    for port in ports:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex((ip, port))
            sock.close()
            results[port] = "Open" if result == 0 else "Closed"
        except Exception as e:
            results[port] = str(e)
    return results

@app.route('/scan', methods=['POST'])
def scan():
    data = request.json
    ip = data.get('ip')
    ports = list(map(int, data.get('ports').split(',')))
    if not is_valid_ip(ip):
        return jsonify({"error": "Invalid IP address"}), 400
    results = scan_ports(ip, ports)
    return jsonify(results)

# --------------------------
# 2. Subdomain Scanner
# --------------------------
@app.route('/subdomain', methods=['GET', 'POST'])
def subdomain():
    if request.method == 'GET':
        return render_template('subdomain.html')
    data = request.get_json()
    domain = data.get('domain')
    subdomain_input = data.get('subdomains', "www,mail,ftp,api,dev")
    if not is_valid_domain(domain):
        return jsonify({"error": "Invalid domain"})
    sub_prefixes = [s.strip() for s in subdomain_input.split(',') if s.strip()]
    results = []
    for prefix in sub_prefixes:
        sub = f"{prefix}.{domain}"
        try:
            ip = socket.gethostbyname(sub)
            results.append({"subdomain": sub, "ip": ip, "status": "found"})
        except socket.gaierror:
            results.append({"subdomain": sub, "ip": None, "status": "not found"})
    return jsonify(results)

# --------------------------
# 3. IP & Geolocation Lookup
# --------------------------
@app.route('/geolookup', methods=['GET', 'POST'])
def geolookup():
    if request.method == 'POST':
        ip = request.json.get('ip')
        try:
            # Replace with an actual API (ipinfo.io used as an example)
            response = requests.get(f"https://ipinfo.io/{ip}/json")
            geo_info = response.json()
            return jsonify(geo_info)
        except Exception as e:
            return jsonify({"error": str(e)}), 400
    return render_template('geolookup.html')

# --------------------------
# 4. Whois Lookup
# --------------------------
@app.route('/whois', methods=['GET', 'POST'])
def whois_page():
    if request.method == 'GET':
        return render_template('whois.html')
    data = request.get_json()
    domain = data.get('domain')
    if not is_valid_domain(domain):
        return jsonify({"error": "Invalid domain"})
    try:
        w = whois.whois(domain)
        result = dict(w)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)})

# --------------------------
# 5. DNS Lookup
# --------------------------
@app.route('/dnslookup', methods=['GET', 'POST'])
def dns_lookup():
    if request.method == 'GET':
        return render_template('dnslookup.html')
    data = request.get_json()
    domain = data.get('domain')
    if not is_valid_domain(domain):
        return jsonify({"error": "Invalid domain"}), 400
    try:
        # Use socket.gethostbyname to get the primary A record.
        ip = socket.gethostbyname(domain)
        return jsonify({"domain": domain, "ip": ip})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --------------------------
# Homepage (renders index.html)
# --------------------------
@app.route('/scan')
def scan_page():
    return render_template('scan.html')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
