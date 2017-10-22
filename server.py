import sys

# Twisted Imports
from twisted.internet import reactor
from twisted.web.static import File
from twisted.web.server import Site

# Autoban imports
from autobahn.twisted.websocket import WebSocketServerFactory, WebSocketServerProtocol
from autobahn.twisted.resource import WebSocketResource

#Globals
DEBUG=False
def dbprint(self, contents):
	if DEBUG:
		print(contents)

#
#   Main Server Loop
#
class GameServerProtocol(WebSocketServerProtocol):
    def onConnect(self, request):
        print("Client connecting: {}".format(request.peer))

    def onOpen(self):
        print("WebSocket connection open.")

    def onMessage(self, payload, isBinary):
        if isBinary:
            print("Binary message received: {} bytes".format(len(payload)))
        else:
            print("Text message received: {}".format(payload.decode('utf8')))

        # echo back message verbatim
        self.sendMessage(payload, isBinary)

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {}".format(reason))

#
#  Actually calling and running the above functions and network boiler plate.
#
factory = WebSocketServerFactory(u"ws://127.0.0.1:8080")
factory.protocol = GameServerProtocol
resource = WebSocketResource(factory)

# static file server seving index.html as root
root = File(".")
# websockets resource on "/ws" path
root.putChild(u"ws", resource)
site = Site(root)
reactor.listenTCP(8080, site)

# Kick those tires and light those fires...
reactor.run()