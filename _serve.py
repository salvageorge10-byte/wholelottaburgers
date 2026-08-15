"""Servidor de desarrollo. Manda Cache-Control: no-store en cada
respuesta para que el navegador nunca sirva un HTML/CSS/JS viejo
mezclado con archivos nuevos. Solo para probar en local — no se
sube al hosting final."""
import http.server

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()

if __name__ == '__main__':
    http.server.test(HandlerClass=NoCacheHandler, port=5173, bind='127.0.0.1')
