var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
const { body, validationResult } = require("express-validator");

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
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate and sanitize the name field.
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create Genre",
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) {
          return next(err);
        }

        if (found_genre) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_genre.url);
        } else {
          genre.save((err) => {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

//Display Genre delete form on GET
exports.genre_delete_get = function(req, res, next) {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      books(callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      //Success
      if (results.genre == null) {
        //No results. return to catalog/genres
        res.redirect('/catalog/genres');
      }
      //Successful. so render
      res.render('genre_delete', {
        title: 'Delete Genre',
        books: results.books,
        genre: results.genre,
      });
    }
  );
};

//Display Genre delete on POST
exports.genre_delete_post = function(req, res, next) {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.body.genreid).exec(callback);
      },
      books(callback) {
        Book.find({ genre: req.body.genreid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      //Success.check for existing books with the genre.
      if(results.books.length > 0) {
        res.render('book_delete', {
          title: 'Delete Genre',
          books: results.books,
          genre: results.genre,
        });
      }

      //Genre has no books. Delete object and redirec to list of genres.
      Genre.findByIdAndRemove(req.body.genreid, (err) => {
        if (err) {
          return next(err);
        }

        //Success. go to list of genres
        res.redirect('/catalog/genres');
      });
    }
  );
};

//Display Genre update on GET
exports.genre_update_get = function(req, res, next) {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      //check if genre exists
      if(results.genre == null) {
        const error = new Error('Genre does not exist');
        error.status = 404;
        return next(error);
      }

      res.render('genre_form', {
        title: 'Update Genre',
        genre: results.genre,
      });
    }
  );
};

//Display Genre update on POST
exports.genre_update_post = [
  //Sanitize and validate fiels
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  
  //Proccess request after sanitization and validation
  (req, res, next) => {
    //Extract errors from validation
    const errors = validationResult(req);

    //Create a Genre object.
    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      //There are errors. render again
      res.render('genre_update', {
        title: 'Update Genre',
        genre,
        errors: errors.array(),
      });
      return;
    }

    //Data is valid. Update record.
    Genre.findByIdAndUpdate(req.params.id, genre, {}, (err, thegenre) => {
      if (err) {
        return next(err);
      }

      //redirect to genre detail
      res.redirect(thegenre.url);
    });
  }
];