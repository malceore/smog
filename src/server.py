# Regular Import 
import sys

# Twisted Imports
from twisted.internet import reactor
from twisted.web.static import File
from twisted.web.server import Site

# Autoban imports
from autobahn.twisted.websocket import WebSocketServerFactory, WebSocketServerProtocol
from autobahn.twisted.resource import WebSocketResource

# Local Imports
import GameServerProtocol

# Setting up connections
factory = WebSocketServerFactory(u"ws://127.0.0.1:8080")
factory.protocol = GameServerProtocol
factory.clients = []
# self.factory.clients.append(self) << from: https://stackoverflow.com/questions/31756704/twisted-python-server-port-already-in-use
resource = WebSocketResource(factory)
# Static file server seving index.html as root
root = File(".")

# websockets resource on "/ws" path
root.putChild(u"ws", resource)
site = Site(root)
reactor.listenTCP(8080, site)

# Kick those tires and light those fires...
reactor.run()
#reactor.stop()
print("Exiting..")
reactor.stop()
