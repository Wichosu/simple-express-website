var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var genreSchema = new Schema (
  {
    name: { type: String, required: true, maxLenght: 100, minLenght: 3},
  }
);

//Virtual for genreSchema's URL
genreSchema
.virtual('url')
.get(function () {
  return '/catalog/genre/' + this._id;
});

//Export model
module.exports = mongoose.model('genreInstance', genreSchema);