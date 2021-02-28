module.exports = {

  USER_COLLECTION: 'users',
  MEME_COLLECTION: 'memes',
  TEMPLATE_COLLECTION: 'templates',

  MAX_FILES_IN_ZIP: 5,

  /**
   * Saves the data in the specified collection of the database
   * @param {*} db - database reference
   * @param {*} collection - name of a collection of the db 
   * @param {*} data - data to be saved
   */
  addToDB(db, collection, data) {
    collection = db.get(collection);
    collection.insert(data).then();
  },

  /**
   * Returns all entries in the specified collection
   * @param {*} db  - database reference
   * @param {*} collection - name of a collection of the db
   */
  findAllFromDB(db, collection) {
    collection = db.get(collection);
    return collection.find({});
  },

  /**
   * Returns the entry with the passed in id
   * @param {*} db - database reference 
   * @param {*} collection - name of a collection of the db
   * @param {*} id - id of the searched entry
   */
  findOneFromDB(db, collection, id) {
    collection = db.get(collection);
    return collection.findOne({ _id: id})
  },

  /**
   * Returns the user with the passed in name
   * @param {*} db - database reference 
   * @param {*} name - name of the searched user
   */
  findUserWithName(db, name) {
    const collection = db.get(this.USER_COLLECTION);
    return collection.findOne({ name: name });
  },

  /**
   * Creates a new user
   * @param {*} db - database reference 
   * @param {*} name - username
   * @param {*} salt - salt user to generate the hash
   * @param {*} hash - hash generated from password and salt
   */
  createNewUser(db, name, salt, hash) {
    const userData = { name: name, salt: salt, hash: hash };
    this.addToDB(db, this.USER_COLLECTION, userData);
  },

  /**
   * Returns all entries with this username
   * @param {*} db - database reference 
   * @param {*} collection - name of a collection of the db
   * @param {*} username - the username the entries are searched with
   */
  findAllOfUser(db, collection, username) {
    collection = db.get(collection);
    return collection.find({ username: username });
  },

  /**
   * Returns all entries with this privacy label
   * @param {*} db - database reference 
   * @param {*} collection - name of a collection of the db
   * @param {*} privacyLabel - the privacy label the entries are searched with
   */
  findAllWithPrivacyLabel(db, collection, privacyLabel) {
    collection = db.get(collection);
    return collection.find({ privacyLabel: privacyLabel });
  },

  /***
  * Meme got liked: add username in column likes, add to likeLogs, increment likeCount
  * @param db Database
  * @param memeId id of the liked meme
  * @param username username of user how liked the meme
  * @param date date on which the meme was liked
  */
  likeMeme(db, memeId, username, date) {
    const collection = db.get(this.MEME_COLLECTION);
    collection.update({ _id: memeId},
        {
          $addToSet: {likes: username, likeLogs: {username: username, date: date, isDislike: false}},
          $inc: {likeCount: 1 }
        }).then((promise) => console.log(promise))
  },

  /***
  * meme got disliked remove username in column likes, add to likeLogs, decrement likeCount
  * @param db Database
  * @param memeId id of the disliked meme
  * @param username username of user how disliked the meme
  * @param date date on which the meme was disliked
  */
  dislikeMeme(db, memeId, username, date) {
    const collection = db.get(this.MEME_COLLECTION);
    collection.update({ _id: memeId},
        {
          $pull: {likes: username},
          $addToSet: {likeLogs: {username: username, date: date, isDislike: true}},
          $inc: {likeCount: -1 }
        }).then((promise) => console.log(promise))
  },

  /**
   * Meme got viewed add date of view to views, increment view count
   * @param db Database
   * @param memeId id of meme
   * @param date date of view
   */
  viewMeme(db, memeId, date) {
    const collection = db.get(this.MEME_COLLECTION);
    collection.update({ _id: memeId}, {$addToSet: {views: date}, $inc: {viewCount: 1}}).then((promise) => console.log(promise))
  },

  /**
   * Comment was added to meme, add comment to comments set
   * @param db Database
   * @param memeId id of meme
   * @param comment comment
   */
  addCommentToMeme(db, memeId, comment) {
    const collection = db.get(this.MEME_COLLECTION);
    collection.update({ _id: memeId}, {$addToSet: {comments: comment} }).then((promise) => console.log(promise))
  },

  /**
   * Find most liked memes
   * @param db Database
   * @param collection meme collection
   * @returns {*} most liked memes
   */
  findMostLikes(db, collection) {
    collection = db.get(collection);
    return collection.find({}, { limit: this.MAX_FILES_IN_ZIP, sort: {likeCount: -1} })
  },

  /**
   * Find most viewed memes
   * @param db Database
   * @param collection meme collection
   * @returns {*} most viewed memes
   */
  findMostViews(db, collection) {
    collection = db.get(collection);
    return collection.find({}, { limit: this.MAX_FILES_IN_ZIP, sort: {viewCount: -1} })
  },

  /**
   * find newest meme
   * @param db Database
   * @param collection meme collection
   * @returns {*} newest memes
   */
  findNewest(db, collection) {
    collection = db.get(collection)
    return collection.find({}, { limit: this.MAX_FILES_IN_ZIP, sort: {creation_time: -1} })
  },

  /**
   * Find memes with given name
   * @param db Database
   * @param collection meme collection
   * @param name name for which is searched
   * @returns {*} memes that have this name
   */
  findWithName(db, collection, name) {
    collection = db.get(collection);
    return collection.find({name: name}, { limit: this.MAX_FILES_IN_ZIP })
  },

  /**
  * find memes that have this template url
  * @param db Database
  * @param collection meme collection
  * @param template_url url of the template
  * @returns {*} Memes with this template
  */
  findWithTemplateUrl(db, collection, template_url) {
    collection = db.get(collection);
    return collection.find({template_url: template_url})
  },

  /**
  * find memes that have this template id
  * @param db Database
  * @param collection meme collection
  * @param id id of the template
  * @returns {*} Memes with this template
  */
  findWithTemplateId(db, collection, id) {
    collection = db.get(collection);
    return collection.find({template_id: id})
  },

  getCaptions(db) {
    const collection = db.get(this.MEME_COLLECTION);
    return collection.find({}, 'captions', { limit: this.MAX_FILES_IN_ZIP*3 }) // Should get at least 10 captions
  }

};