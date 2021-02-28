module.exports = {

  USER_COLLECTION: 'users',
  MEME_COLLECTION: 'memes',
  TEMPLATE_COLLECTION: 'templates',

  MAX_FILES_IN_ZIP: 5,

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

  likeMeme(db, memeId, username, date) {
    const collection = db.get(this.MEME_COLLECTION);
    collection.update({ _id: memeId},
        {
          $addToSet: {likes: username, likeLogs: {username: username, date: date, isDislike: false}},
          $inc: {likeCount: 1 }
        }).then((promise) => console.log(promise))
  },

  dislikeMeme(db, memeId, username, date) {
    const collection = db.get(this.MEME_COLLECTION);
    collection.update({ _id: memeId},
        {
          $pull: {likes: username},
          $addToSet: {likeLogs: {username: username, date: date, isDislike: true}},
          $inc: {likeCount: -1 }
        }).then((promise) => console.log(promise))
  },

  viewMeme(db, memeId, date) {
    const collection = db.get(this.MEME_COLLECTION);
    collection.update({ _id: memeId}, {$addToSet: {views: date}, $inc: {viewCount: 1}}).then((promise) => console.log(promise))
  },

  addCommentToMeme(db, memeId, comment) {
    const collection = db.get(this.MEME_COLLECTION);
    collection.update({ _id: memeId}, {$addToSet: {comments: comment} }).then((promise) => console.log(promise))
  },

  findMostLikes(db, collection) {
    collection = db.get(collection);
    return collection.find({}, { limit: this.MAX_FILES_IN_ZIP, sort: {likeCount: -1} })
  },

  findMostViews(db, collection) {
    collection = db.get(collection);
    return collection.find({}, { limit: this.MAX_FILES_IN_ZIP, sort: {viewCount: -1} })
  },

  findNewest(db, collection) {
    collection = db.get(collection)
    return collection.find({}, { limit: this.MAX_FILES_IN_ZIP, sort: {creation_time: -1} })
  },

  findWithName(db, collection, name) {
    collection = db.get(collection);
    return collection.find({name: name}, { limit: this.MAX_FILES_IN_ZIP })
  },

  getCaptions(db) {
    const collection = db.get(this.MEME_COLLECTION);
    return collection.find({}, 'captions', { limit: this.MAX_FILES_IN_ZIP*3 }) // Should get at least 10 captions
  }

};