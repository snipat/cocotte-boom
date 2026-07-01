import http.server, os
os.chdir('/Users/patricksebe/Documents/GitHub/cocotte-boom')
http.server.test(HandlerClass=http.server.SimpleHTTPRequestHandler, port=5173, bind='127.0.0.1')
