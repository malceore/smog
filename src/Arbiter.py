import threading, time
#
#   Arbiter class basically manages all the clients and their information. It takes in data from players via the websockets and 
#	collaborates their moves into updates that get sent back through the websockets in preset intervals.
#
class Arbiter():

    def __init__(self):
        self.clients = {} 
        self.interval = 45 # <-Seconds?
        self.mainThread = threading.Thread(target=self.gameLoop)

    def run(self):
        self.mainThread.start()
        #print("Thread started.")

    def stop(self):
        self.mainThread.join()
        #print("Thread stopped...")

    def gameLoop(self):
        print("Game loop stub!")
        time.sleep(self.interval)
        self.gameLoop()

    def register(self, client):
        if client not in self.clients: 
            print("Registered: " + ''.join(self.clients) )
            self.clients[client.peer] = {"object": client, "id": None, "changeCache":""}

    def unregister(self, client):
        if client in self.clients: 
            print("Unregistered " + client)
            self.clients.pop(client.peer)

    # Modify client's change cache with freshest moves.
    def receiveChanges(self, client, changes):
        print("RECIEVED these changes" + ':'.join(changes) + " from " + client.peer)
        self.clients[client.peer]["changeCache"] = changes
        #self.clients[client.peer]["object"].sendMessage("hello|")

    # Package all changes not from requester and return them.
    def broadcastChanges(self, client):
        acum = ""
        for c in self.clients:
            if c != client.peer:
                acum = self.clients[c]["changeCache"]
        return acum
