# OMM Meme App 2021

[Repository](https://gitlab.lrz.de/omm2021-official/grouptask02)

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

## API

1. Create a meme (provided in a zip) with an image url and two captions.
    Insert the image URL as well as the two captions:
    http://localhost:3030/meme/create?captionTop={insertFirstCaption}&captionBottom={insertSndCaption}&imageUrl={insertImageURL}
    Blank spaces are replaced with %20.
    Example: http://localhost:3030/meme/create?captionTop=Test&captionBottom=OMM&imageUrl=https://i.imgflip.com/1ur9b0.jpg

2. Create a set of images (provided as a zip file) from one image url
    Insert the URL of the image you want to create memes of:
    http://localhost:3030/meme/createrandom?imageUrl={insertImageURL}
    Enter this URL in your Browser. A maximum of 5 memes is generated and gets downloaded as zip file. The captions are pulled from the database. This feature only works when the database is not empty.
    Again, you can use this image URL for testing: https://i.imgflip.com/1ur9b0.jpg

3. Download the 5 newest memes as zip: http://localhost:3030/meme/newest

4. Download the 5 memes with most likes as zip: http://localhost:3030/meme/mostlikes

5. Download the 5 memes with most views as zip: http://localhost:3030/meme/mostviews

6. Download a maximum of 5 memes with the same name/title as zip: http://localhost:3030/meme/name/{insertSearchedName}
    When inserting the name, replace blank spaces with %20.

7. Get any previously created image with the memeId: http://localhost:3030/meme/{insertIdOfMeme}
    This returns a json with the following structure: {"success": _true/false_, "image": _dataURL_}.
    Success is false when there is no meme with the entered ID. The field dataURL contains the dataURL of the meme in case success is true.
   
8. Create a complex meme out of multiple images and multiple captions. This requires a valid json web token.
   Example:
    ```
        curl 'http://localhost:3030/create' -H 'Authorization: <valid-jwt>' --data-raw '{"currentImage":{"id":"181913649","name":"Drake Hotline Bling","url":"https://i.imgflip.com/30b1gx.jpg","width":1200,"height":1200,"box_count":3,"source":"imgflip"},"imageInfo":{"size":"36","x":0,"y":0},"captions":["Caption 1","Caption 2","Caption 3"],"captionPositions_X":[50,50,"6"],"captionPositions_Y":[10,55,"84"],"fontSize":45,"isItalic":true,"isBold":true,"fontColor":"#51ff02","addedImages":[{"id":"112126428","name":"Distracted Boyfriend","url":"https://i.imgflip.com/1ur9b0.jpg","width":1200,"height":800,"box_count":3,"source":"imgflip"},{"id":"91538330","name":"X, X Everywhere","url":"https://i.imgflip.com/1ihzfe.jpg","width":2118,"height":1440,"box_count":2,"source":"imgflip"}],"addedImgPositions_X":["78","50"],"addedImgPositions_Y":["16","95"],"addedImgSizes":["25","16"],"canvasSize":{"width":565,"height":565}}'
    ```