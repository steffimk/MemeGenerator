# OMM Meme App 2021

## Usage

Start the stack by calling
```bash
docker-compose up -d
```
After some seconds the app will be available on port 3000. An admin
interface for the mongoDB will be available on port 8081.

Stop the stack by calling
```bash
docker-compose down
```

Alternatively you can also run the app locally. This requires having 
mongoDB installed and listening on the default port.
```bash
cd backend
npm start &
cd ../frontend
npm start &
```
