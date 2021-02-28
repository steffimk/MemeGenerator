FROM mongo
 COPY . .
 CMD mongoimport --collection memes --file memes.json --jsonArray --uri "mongodb://mongo:27017/ommOfficialDB"