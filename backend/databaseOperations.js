const userCollection = 'users';

module.exports = {

  addToDB(db, collection, data) {
    // Delete id so that db generates new unique one (prevents duplicate error)
    //delete data._id;
    collection = db.get(collection);
    collection.insert(data).then((docs) => console.log(docs));
  },

  findAllFromDB(db,collection) {
    collection = db.get(collection);
    return collection.find({});
  },

  findOneFromDB(db, collection, id) {
    collection = db.get(collection);
    collection.find(id).then((docs) => console.log(docs));
  },

  findUserWithName(db, name) {
    const collection = db.get(userCollection);
    return collection.findOne({ name: name });
  },

  createNewUser(db, name, salt, hash) {
    const userData = { name: name, salt: salt, hash: hash }
    this.addToDB(db, userCollection, userData)
  },

  findAllOfUser(db, collection, username) {
    collection = db.get(collection);
    return collection.find({ username: username });
  }

}