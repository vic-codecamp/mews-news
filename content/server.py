#!/usr/bin/python3

from flask import Flask, request


class SingletonMetaClass(type):
    def __init__(cls,name,bases,dict):
        super(SingletonMetaClass,cls) \
            .__init__(name,bases,dict)
        original_new = cls.__new__
        def my_new(cls,*args,**kwds):
            if cls.instance == None:
                cls.instance = \
                    original_new(cls,*args,**kwds)
            return cls.instance
        cls.instance = None
        cls.__new__ = staticmethod(my_new)


class MockMl:

    __metaclass__ = SingletonMetaClass

    def vote(self,user,title,vote):

        print("User: "+user+" voted:"+vote+" on: "+title)
        return True
        # print("vote:"+user+" "+vote)

    def getVotes(self,items):
        for item in items:
            print(item)
        return True

app = Flask(__name__)

@app.route('/')
def index():
    return 'ML service'

# curl -d '{"username":"user", "title":"my title","vote":"0"}' -H "Content-Type: application/json" -X POST http://localhost:7070/api/vote
@app.route('/api/vote', methods=[ 'POST'])
def add_vote():

    data = request.get_json()

    user = data["username"]
    title = data["title"]
    vote = data["vote"]

    ml = MockMl()

    if ml.vote(user, title, vote):
        return "ok"
    else:
        return "error voting"

# curl -d '[{"username":"user", "title":"my title","id":1},{"username":"user", "title":"my title2","id":2}]' -H "Content-Type: application/json" -X POST http://localhost:7070/api/votes
@app.route('/api/votes', methods=[ 'POST'])
def get_labels():

    data = request.get_json()

    if len(data) < 1:
        return "no data provided"

    ml = MockMl()
    if ml.getVotes(data):
        return "ok"
    else:
        return "error getting votes"


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=7070)



