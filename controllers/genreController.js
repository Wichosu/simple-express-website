var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');

//Display list of all GENRE
exports.genre_list = function(req, res, next) {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, genre_list) {
      if (err) { return next(err) }
      //Successful, so render
      res.render('genre_list', { title: 'Genre List', genre_list: genre_list});
    });
};

//Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {
  
  async.parallel({
    genre(callback) {
      Genre.findById(req.params.id)
        .exec(callback);
    },

    genre_books(callback) {
      Book.find({ 'genre': req.params.id })
        .exec(callback);
    },

  }, 
  
  function (err, results) {
    if (err) { return next(err); }
    if (results.genre==null) { // No results.
      var err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }

    //Successful, so render
    res.render('genre_detail', {
      title: 'Genre Detail',
      genre: results.genre,
      genre_books: results.genre_books,
    });
  });
  
};

//Display Genre create form on GET
exports.genre_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre create GET');
};

//Display Genre create on POST
exports.genre_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre create POST');
};

//Display Genre delete form on GET
exports.genre_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre delete GET');
};

//Display Genre delete on POST
exports.genre_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

//Display Genre update on GET
exports.genre_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

//Display Genre update on POST
exports.genre_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};