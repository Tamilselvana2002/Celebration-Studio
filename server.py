"""
Celebration Studio — Zero-Dependency Local Static Server
Serves Pure HTML/CSS/JS with automatic clean URL mapping, query parameter preservation,
and proper MIME types.
"""

import http.server
import socketserver
import os
import sys
import urllib.parse

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

CLEAN_ROUTES = {
    '': '/index.html',
    '/': '/index.html',
    '/create': '/create.html',
    '/dashboard': '/dashboard.html',
    '/templates': '/templates.html',
    '/editor': '/editor.html',
    '/preview': '/preview.html',
    '/recipients': '/recipients.html',
    '/media-vault': '/media-vault.html',
    '/profile': '/profile.html',
    '/login': '/login.html',
    '/register': '/register.html',
}

class CelebrationHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')
        
        # Check if the path matches a clean route
        if path in CLEAN_ROUTES:
            rewritten_path = CLEAN_ROUTES[path]
            if parsed.query:
                self.path = f"{rewritten_path}?{parsed.query}"
            else:
                self.path = rewritten_path
                
        return super().do_GET()

    def end_headers(self):
        # Enable CORS and caching headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    # Allow socket address reuse to prevent "Address already in use" errors on restart
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), CelebrationHandler) as httpd:
        print("=" * 60)
        print(f"✨ Celebration Studio is running at: http://localhost:{port}/")
        print(f"✨ Direct clean URLs supported:")
        print(f"   • http://localhost:{port}/create/?template=golden_cinema")
        print(f"   • http://localhost:{port}/dashboard/")
        print(f"   • http://localhost:{port}/templates/")
        print(f"   • http://localhost:{port}/editor/")
        print(f"   • http://localhost:{port}/preview/")
        print("=" * 60)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
