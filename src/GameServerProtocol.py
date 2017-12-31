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
        # empty strings return false, pass on items inside
        if 1:
            changes = self.changeCache.split(":")
            #print("DEBUG changeCache: " + self.changeCache)
            # Reset cache..
            self.changeCache = ""
            acum = {}
            for entries in changes:
                # tick | x | y | entity 
                list = entries.split(",")
                if len(list) > 3: 
                    # That list isn't empty (or later, malformed) We build a map 
                    #	with the name as the key.
                    #acum[list[4]]=list
                    #print("DEBUGG >> " + str(list) + ", " + str(entries))
                    acum[list[4]]=entries   
            return acum
        return None

    def onConnect(self, request):
        print("Client connecting: {}".format(request.peer))
        self.factory.arbiter.register(self)

    def onOpen(self):
        MISSION = '''mission|{"name":"Test","entities":[{"type":"cube","x":6,"y":10,"z":-65},{"type":"cube","x":10,"y":10,"z":145}],"height_map":"61.png"}'''
        self.sendMessage(MISSION)
        print("WebSocket connection open")

    def onMessage(self, payload, isBinary):
        if isBinary:
            print("Binary message received: {} bytes".format(len(payload)))
        else:
            input = payload.decode('utf8')
            # Changes were received from a player.
            #if 1 < len(input.split('|')):
            # Put them on oldest first so we can just skip older changes that have been
            # overwritten.
            self.changeCache = input + self.changeCache

    def onClose(self, wasClean, code, reason):
        print("WebSocket connection closed: {}".format(reason))
        self.factory.arbiter.unregister(self)
