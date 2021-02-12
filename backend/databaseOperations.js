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

  createNewUser(db, name, password) {
    const userData = { name: name, password: password }
    this.addToDB(db, userCollection, userData)
  }



}