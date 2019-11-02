#!/usr/bin/python3

from flask import Flask, request
from NewsTitleClassifier import *

# class MockMl:
#
#     __metaclass__ = SingletonMetaClass
#
#     def vote(self,user,title,vote):
#
#         print("User: "+user+" voted:"+vote+" on: "+title)
#         return True
#         # print("vote:"+user+" "+vote)
#
#     def getVotes(self,items):
#         for item in items:
#             print(item)
#         return True

app = Flask(__name__)

@app.route('/')
def index():
    return 'ML service'

# curl -d '{"username":"user", "title":"my title","vote":"0"}' -H "Content-Type: application/json" -X POST http://localhost:7070/api/vote
#
#  NOT USED AT THE MOMENT
#
# @app.route('/api/vote', methods=[ 'POST'])
# def add_vote():
#
#     data = request.get_json()
#
#     user = data["username"]
#     title = data["title"]
#     vote = data["vote"]
#
#     ml = MockMl()
#
#     if ml.vote(user, title, vote):
#         return "ok"
#     else:
#         return "error voting"

# curl -d '[{"username":"user", "title":"my title","id":1},{"username":"user", "title":"BITCOIN EXPLOSIVE MOVE SOON!?! FLASH CRASH & BitMEX Email LEAK! Bullish News!!","id":2}]' -H "Content-Type: application/json" -X POST http://localhost:7070/api/votes
@app.route('/api/votes', methods=[ 'POST'])
def get_classification():

    data = request.get_json()

    if len(data) < 1:
        return "no data provided"

    ntc = SingleNewsTittleClassifier()

    result = ntc.getVotes(data)

    if result != False:
        return result
    else:
        return "error getting votes"

if __name__ == '__main__':

    print("Starting the News Clasifier")
    ml = SingleNewsTittleClassifier()
    ml.reload_model()


    app.run(debug=True, host='0.0.0.0', port=7070)
    # app.run( host='0.0.0.0', port=7070)



