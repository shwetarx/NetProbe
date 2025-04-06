from flask import Flask, request, jsonify, render_template
import socket
import subprocess
import ssl
import requests
import whois
import re

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
        return jsonify({"error": "Invalid IP address"})
    results = scan_ports(ip, ports)
    return jsonify(results)


# --------------------------
# 2. Subdomain Scanner
# --------------------------
@app.route('/subdomain', methods=['POST'])
def subdomain():
    data = request.json
    domain = data.get('domain')
    if not is_valid_domain(domain):
        return jsonify({"error": "Invalid domain"})
    subdomains = data.get('subdomains', "www,mail,dev,ftp,api").split(',')
    found = []
    for sub in subdomains:
        subdomain = f"{sub.strip()}.{domain}"
        try:
            ip = socket.gethostbyname(subdomain)
            found.append({"subdomain": subdomain, "ip": ip})
        except socket.gaierror:
            continue
    return jsonify(found)


# --------------------------
# 3. IP & Geolocation Lookup
# --------------------------
@app.route('/geolookup', methods=['GET', 'POST'])
def geolookup():
    if request.method == 'GET':
        return render_template('geolookup.html')
    else:
        data = request.json
        ip = data.get('ip')
        if not is_valid_ip(ip):
            return jsonify({"error": "Invalid IP address"})
        try:
            response = requests.get(f"http://ip-api.com/json/{ip}")
            response.raise_for_status()
            return jsonify(response.json())
        except Exception as e:
            return jsonify({"error": str(e)})



# --------------------------
# 4. Reverse DNS Lookup
# --------------------------
@app.route('/reversedns', methods=['POST'])
def reversedns():
    data = request.json
    ip = data.get('ip')
    if not is_valid_ip(ip):
        return jsonify({"error": "Invalid IP address"})
    try:
        hostname, aliaslist, ipaddrlist = socket.gethostbyaddr(ip)
        return jsonify({"hostname": hostname, "aliases": aliaslist, "ip_addresses": ipaddrlist})
    except Exception as e:
        return jsonify({"error": str(e)})

# --------------------------
# 5. Whois Lookup
# --------------------------
@app.route('/whois', methods=['GET', 'POST'])
def whois_page():
    if request.method == 'GET':
        return render_template('whois.html')
    else:
        data = request.json
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
# Homepage (renders index.html)
# --------------------------
import os

@app.route('/scan')
def scan_page():
    return render_template('scan.html')


@app.route('/')
def index():
    print("Homepage route is working!")
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
