#
# Main class, run uses this and sets up server for game. Should be able to resolve
#	localhost:8080/index.html and see the game in the browser. 
#
# Regular Import 
import sys

# Twisted Imports
from twisted.internet import reactor
from twisted.web.static import File
from twisted.web.server import Site
from twisted.python import log

# Autoban imports
from autobahn.twisted.websocket import WebSocketServerFactory
from autobahn.twisted.resource import WebSocketResource

# Local Imports FECK
from GameServerProtocol import *
from Arbiter import *

# Logging
# log.startLogging(sys.stdout)

# Setting up connections
factory = WebSocketServerFactory(u"ws://127.0.0.1:8080")
factory.protocol = GameServerProtocol

# Setting up arbiter who basically runs the show within it's gameLoop.
factory.arbiter = Arbiter()
factory.arbiter.run()

# Websocket and webserver setup.
resource = WebSocketResource(factory)
root = File(".")
root.putChild(u"ws", resource)
site = Site(root)
reactor.listenTCP(8080, site)

# Kick those tires and light those fires...
reactor.run()
print("Exiting..")
