# Regular Import 
import sys, json, threading, time

# Twisted Imports
from twisted.internet import reactor
from twisted.web.static import File
from twisted.web.server import Site

# Autoban imports
from autobahn.twisted.websocket import WebSocketServerFactory, WebSocketServerProtocol
from autobahn.twisted.resource import WebSocketResource

#Globals
#THREAD = threadObject()
DEBUG = False
def dbPrint(self, contents):
    if DEBUG:
        print(contents)
#
#   Main Server Loop
#
class GameServerProtocol(WebSocketServerProtocol):
    INTERVAL = 5.0
    changeCache = ""
    # Save only new changes and send them up to the arbiter.
    def filterChanges(self):
        changes = self.changeCache.split("|")
        # Reset cache..
        self.changeCache = ""
        acum = []
        for values in changes:
            temp = values.split()
            if len(temp) >= 3:
                if temp[2] not in acum:
                    #print("Already exists... skipping.")
                    #else:
                    #dbPrint("That's new to me!")
                    acum = acum + temp
        print acum
        #self.sendMessage("update|", acum)
        # Send what actually changed since last update.
        self.factory.arbiter.receiveChanges(self, acum)
        # Broadcast out reply from arbiter.
        self.sendMessage("update|" + self.factory.arbiter.broadcastChanges(self) )
        # Sleep interval and loop.
        time.sleep(self.INTERVAL)
        self.hello()

    # Says hello to client, will later act as semaphore and preloader until players a ready.
    #def hello(self):
        #self.testThread = threading.Thread(target=self.filterChanges).start()
        #self.sendMessage("hello|")

    def onConnect(self, request):
        #threading.Timer(1.0, update()).start()
        print("Client connecting: {}".format(request.peer))
        self.factory.arbiter.register(self)
        #self.hello()

    def onOpen(self):
        #self.sendMessage(
        MISSION = '''mission|{"name":"Test","entities":[{"type":"cube","x":6,"y":10,"z":-65},{"type":"cube","x":10,"y":10,"z":145}],"height_map":"61.png"}'''
        self.sendMessage(MISSION)
        print("WebSocket connection open")

    # Here where the business happens...
    def onMessage(self, payload, isBinary):
        if isBinary:
            print("Binary message received: {} bytes".format(len(payload)))
        else:
            input = payload.decode('utf8')
            # Changes were received from a player.
            if 1 < len(input.split('|')):
                #print("Something Changed : " + input)
                # Put them on oldest first so we can just skip older changes that have been
                # overwritten.
                self.changeCache = input + self.changeCache

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {}".format(reason))
        self.factory.arbiter.unregister(self)
