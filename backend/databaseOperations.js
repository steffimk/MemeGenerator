const { id } = require("monk");

const USER_COLLECTION = 'users';
const MEME_COLLECTION = 'memes';

module.exports = {
  addToDB(db, collection, data) {
    // Delete id so that db generates new unique one (prevents duplicate error)
    //delete data._id;
    collection = db.get(collection);
    collection.insert(data).then((docs) => console.log(docs));
  },

  findAllFromDB(db, collection) {
    collection = db.get(collection);
    return collection.find({});
  },

  findOneFromDB(db, collection, id) {
    collection = db.get(collection);
    collection.find(id).then((docs) => console.log(docs));
  },

  findUserWithName(db, name) {
    const collection = db.get(USER_COLLECTION);
    return collection.findOne({ name: name });
  },

  createNewUser(db, name, salt, hash) {
    const userData = { name: name, salt: salt, hash: hash };
    this.addToDB(db, USER_COLLECTION, userData);
  },

  likeMeme(db, memeId, username) {
    const collection = db.get(MEME_COLLECTION);
    collection.update({ _id: memeId}, {$addToSet: {likes: username} }).then((promise) => console.log(promise))
  },

  addCommentToMeme(db, memeId, comment) {
    const collection = db.get(MEME_COLLECTION);
    collection.update({ _id: memeId}, {$addToSet: {comments: comment} }).then((promise) => console.log(promise))
  },
};