import threading, time
#
#   Arbiter class basically manages all the clients and their information. It takes in data from players via the websockets and 
#	collaborates their moves into updates that get sent back through the websockets in preset intervals.
#
class Arbiter():

    def __init__(self):
        self.clients = {} 
        self.interval = 2 # <-Seconds?
        self.tick = 1
        self.mainThread = threading.Thread(target=self.gameLoop)

    def run(self):
        self.mainThread.start()
        #print("Thread started.")

    def stop(self):
        self.mainThread.join()
        #print("Thread stopped...")

    def gameLoop(self):
        latestChange={'tick':0, 'changes':""}
        # Grab changes from all clients and find most recent alteration.
        for c in self.clients:
            change = self.clients[c]["object"].filterChanges()
            # could use a refactor
            if change is not None and change["tick"] > latestChange["tick"]:
                 latestChange=change
        # Figure out from pile of changes which ones to send out. Parse into another function probably..
        # passJudgement()
        # Send final changeset to be broadcast to all clients.
        self.broadcastChanges(latestChange)
        # Wait and loop, later will modify interval to consider above time taken.
        time.sleep(self.interval)
        self.gameLoop()

    def register(self, client):
        if client not in self.clients: 
            print("Registered: " + ''.join(self.clients) )
            self.clients[client.peer] = {"object": client, "id": None}

    def unregister(self, client):
        if client in self.clients: 
            print("Unregistered " + client)
            self.clients.pop(client.peer)

    def broadcastChanges(self, changes):
        print(changes)
        for c in self.clients:
            self.clients[c]["object"].sendMessage("update|" + ''.join(changes))
            self.clients[c]["object"].sendMessage("tick|" + str(self.tick))
            self.tick+=1
