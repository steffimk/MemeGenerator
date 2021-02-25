const { id } = require("monk");

module.exports = {

  USER_COLLECTION: 'users',
  MEME_COLLECTION: 'memes',
  TEMPLATE_COLLECTION: 'templates',

  addToDB(db, collection, data) {
    // Delete id so that db generates new unique one (prevents duplicate error)
    //delete data._id;
    collection = db.get(collection);
    collection.insert(data).then(); //(docs) => console.log(docs));
  },

  findAllFromDB(db, collection) {
    collection = db.get(collection);
    return collection.find({});
  },

  findOneFromDB(db, collection, id) {
    collection = db.get(collection);
    return collection.findOne({ _id: id})
  },

  findUserWithName(db, name) {
    const collection = db.get(this.USER_COLLECTION);
    return collection.findOne({ name: name });
  },

  createNewUser(db, name, salt, hash) {
    const userData = { name: name, salt: salt, hash: hash };
    this.addToDB(db, this.USER_COLLECTION, userData);
  },

  findAllOfUser(db, collection, username) {
    collection = db.get(collection);
    return collection.find({ username: username });
  },

  findAllWithPrivacyLabel(db, collection, privacyLabel) {
    collection = db.get(collection);
    return collection.find({ privacyLabel: privacyLabel });
  },

  likeMeme(db, memeId, like) {
    const collection = db.get(this.MEME_COLLECTION);
    collection.update({ _id: memeId}, {$addToSet: {likes: like}}).then((promise) => console.log(promise))
  },

  viewMeme(db, memeId) {
    const collection = db.get(this.MEME_COLLECTION);
    collection.update({ _id: memeId}, {$inc: {views: 1} }).then((promise) => console.log(promise))
  },

  addCommentToMeme(db, memeId, comment) {
    const collection = db.get(this.MEME_COLLECTION);
    collection.update({ _id: memeId}, {$addToSet: {comments: comment} }).then((promise) => console.log(promise))
  },
};