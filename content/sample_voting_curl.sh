#/bin/bash

echo "get Result for Trump news"
curl -d '[{"username":"user", "title":"Trump  Defense of Major Support May Fuel Price Bounce to $8,600","id":2}]' -H "Content-Type: application/json" -X POST http://localhost:7070/api/votes


echo ""
echo "upvote trump"

curl -d '{"username":"user",  "title":"Trump still divided over decision to release Ukraine","vote":"0"}' -H "Content-Type: application/json" -X POST http://localhost:7070/api/vote
echo ""
curl -d '{"username":"user",  "title":"Live updates: Trump impeachment inquiry","vote":"0"}' -H "Content-Type: application/json" -X POST http://localhost:7070/api/vote
echo ""
curl -d '{"username":"user",  "title":"Why President Trumps move from New York to Florida could","vote":"1"}' -H "Content-Type: application/json" -X POST http://localhost:7070/api/vote
echo ""



echo "get New for Trump news"
curl -d '[{"username":"user", "title":"Trump  Defense of Major Support May Fuel Price Bounce to $8,600","id":2}]' -H "Content-Type: application/json" -X POST http://localhost:7070/api/votes
echo ""
echo ""

