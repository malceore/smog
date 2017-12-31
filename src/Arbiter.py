import threading, time
#
#   Arbiter class basically manages all the clients and their information. It takes in data from players via the websockets and 
#	collaborates their moves into updates that get sent back through the websockets in preset intervals.
#
class Arbiter():

    def __init__(self):
        self.clients = {} 
        self.interval = 0.1 # 0.5 <-Seconds?
        self.tick = 1
        self.mainThread = threading.Thread(target=self.gameLoop)

    def run(self):
        self.mainThread.start()
        #print("Thread started.")

    def stop(self):
        self.mainThread.join()
        #print("Thread stopped...")

    def gameLoop(self):
    	while 1:
	        accum = {}
	        i=1
	        # Grab changes from all clients and find most recent alteration.
	        for c in self.clients:
	            changes = self.clients[c]["object"].filterChanges()
	            if changes != {}:
	                # if i is the first then we can just make acum equal it to save time.
	                if i == 1:
	                    accum = changes
	                    i=2
	                # Otherwise behave as normal.
	                else:
	                    for key in changes.items():
	                        #print("DEBUG key >> " + str(key[0]))
	                        # If exists, check tick.
	                        if key in accum.items():
	                            if key[1][3] < acum[key][3]:
	                                accum[value] = changes[value]
	                                print("NEWER CHANGE!? " + key[1][3] + " vs " + acum[key][3])
	                        # Else it's new just add it.
	                        else:
	                            accum[key[0]]=key[1]

	        # Convert to human readable string for message passing..
	        stringAccum=""
	        if accum != {}:
	            string=""    
	            for value in accum.items():
	               for entry in value:
	                   string= "" + ''.join(entry)
	                   #print("TICK:" + str(self.tick) + "   String:" + string)
	               stringAccum = stringAccum + ":" + string  

	        # Send final changeset to be broadcast to all clients.
	        self.broadcastChanges(stringAccum)

	        # Wait and loop, later will modify interval to consider above time taken.
	        time.sleep(self.interval)
	        #self.gameLoop()

    def register(self, client):
        if client not in self.clients: 
            print("Registered: " + ''.join(self.clients) )
            self.clients[client.peer] = {"object": client, "id": None}

    def unregister(self, client):
        if client in self.clients: 
            print("Unregistered " + client)
            self.clients.pop(client.peer)

    def broadcastChanges(self, changes):
        # print("DEBUG CHANGES >>" + str(changes))
        for c in self.clients:
            self.clients[c]["object"].sendMessage("update|" + str(changes))
            self.clients[c]["object"].sendMessage("tick|" + str(self.tick))
            self.tick+=1
