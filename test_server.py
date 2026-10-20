import urllib.request
import threading
import time
import socketserver
from server import CelebrationHandler

PORT = 8765

def run_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), CelebrationHandler) as httpd:
        httpd.serve_forever()

t = threading.Thread(target=run_server, daemon=True)
t.start()
time.sleep(1)

routes = [
    f"http://localhost:{PORT}/",
    f"http://localhost:{PORT}/create/?template=golden_cinema",
    f"http://localhost:{PORT}/dashboard/",
    f"http://localhost:{PORT}/templates/",
    f"http://localhost:{PORT}/editor/",
    f"http://localhost:{PORT}/preview/",
    f"http://localhost:{PORT}/recipients/",
    f"http://localhost:{PORT}/media-vault/",
    f"http://localhost:{PORT}/profile/",
    f"http://localhost:{PORT}/login/",
    f"http://localhost:{PORT}/register/",
    f"http://localhost:{PORT}/create/index.html",
    f"http://localhost:{PORT}/create.html?template=golden_cinema"
]

print("--- Testing Routes ---")
all_ok = True
for url in routes:
    try:
        req = urllib.request.urlopen(url)
        print(f"PASS: {url} -> {req.status}")
    except Exception as e:
        print(f"FAIL: {url} -> {e}")
        all_ok = False

if all_ok:
    print("ALL ROUTES VERIFIED SUCCESSFULLY (200 OK)")
else:
    print("SOME ROUTES FAILED")
