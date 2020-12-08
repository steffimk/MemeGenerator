var express = require('express');
var router = express.Router();

const memes = [
    {
        "id": "181913649",
        "name": "Drake Hotline Bling",
        "url": "https://i.imgflip.com/30b1gx.jpg",
        "width": 1200,
        "height": 1200,
        "box_count": 2
    },
    {
        "id": "112126428",
        "name": "Distracted Boyfriend",
        "url": "https://i.imgflip.com/1ur9b0.jpg",
        "width": 1200,
        "height": 800,
        "box_count": 3
    },
]

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json({
        "success": true,
        "data": {"memes": memes}
    })
});

router.post('/', function(req, res, next){

});

module.exports = router;
