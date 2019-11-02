import requests

url = ('https://newsapi.org/v2/top-headlines?'
       'country=us&'
       'apiKey=aeba79676d064e08a9c687c0d988115f')
response = requests.get(url)
print response.json()