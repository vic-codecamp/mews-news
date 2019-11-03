#/bin/bash

TEST="Trump absent, ASEAN charts path for trade bloc led by China"

echo "get Result for Trump news"
curl -d '[{"username":"user", "title":"'"$TEST"'","id":2}]' -H "Content-Type: application/json" -X POST http://localhost:7070/api/votes




echo ""
echo "downvote trump"

VOTE=0
VOTE_TEXT="Trump still divided over decision to release Ukraine"


curl -d '{"username":"user",  "title":"'"$VOTE_TEXT"'","vote":'$VOTE'}' -H "Content-Type: application/json" -X POST http://localhost:7070/api/vote
echo ""

VOTE_TEXT="Internet mocks Trump's 'Great Wall of Colorado"
curl -d '{"username":"user",  "title":"'"$VOTE_TEXT"'","vote":'$VOTE'}' -H "Content-Type: application/json" -X POST http://localhost:7070/api/vote
echo ""

VOTE_TEXT="President Trump condemns open border policies as 'cruel and evil' at UN General Assembly - CNN Video"
curl -d '{"username":"user",  "title":"'"$VOTE_TEXT"'","vote":'$VOTE'}' -H "Content-Type: application/json" -X POST http://localhost:7070/api/vote
echo ""

curl -d '{"username":"user",  "title":"'"$TEST"'","vote":'$VOTE'}' -H "Content-Type: application/json" -X POST http://localhost:7070/api/vote
echo ""


VOTE=2
VOTE_TEXT="California earthquake: Deadly fault line threatens epic quake"
curl -d '{"username":"user",  "title":"'"$VOTE_TEXT"'","vote":'$VOTE'}' -H "Content-Type: application/json" -X POST http://localhost:7070/api/vote
echo ""
VOTE_TEXT="Brazil Amazo n forest defender shot dead by illegal loggers"
curl -d '{"username":"user",  "title":"'"$VOTE_TEXT"'","vote":'$VOTE'}' -H "Content-Type: application/json" -X POST http://localhost:7070/api/vote
echo ""



echo "get New for Trump news"
curl -d '[{"username":"user", "title":"'"$TEST"'","id":2},{"username":"foo","title":"Canelo stops Kovalev in 11th to win historic title"}]' -H "Content-Type: application/json" -X POST http://localhost:7070/api/votes



echo ""
echo ""

