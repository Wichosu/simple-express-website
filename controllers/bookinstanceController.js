var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
const { body, validationResult } = require('express-validator');
const async = require('async');

//Display list of all BookInstances
exports.bookinstance_list = function(req, res, next) {
  
  BookInstance.find()
    .populate('book')
    .exec(function (err, list_bookinstances) {
      if (err) { return next(err); }
      //Succesful, so render
      res.render('bookinstance_list',
        {title: 'Book Instance List', bookinstance_list: list_bookinstances});
    });
};

//Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res) {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec((err, bookinstance) => {
      if (err) {
        return next(err);
      }
      if (bookinstance == null) { // No results.
        const err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }
      //Successful, so render.
      res.render('bookinstance_detail', {
        title: `Copy: ${bookinstance.book.title}`,
        bookinstance,
      });
    });
};

//Display BookInstance create form on GET
exports.bookinstance_create_get = function(req, res, next) {
  //Get all books to add a copy of one of them.
  async.parallel(
    {
      books(callback) {
        Book.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('bookinstance_form', {
        title: 'Create Book Instance',
        books: results.books,
      });
    }
  );
};

//Display BookInstance create on POST
exports.bookinstance_create_post = [
  //Validate and sanitize field
  body('book', 'Book must not be empty.')
    .escape(),
  body('imprint', 'Imprint must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status',' Status must not be empty.')
    .trim()
    .isLength({ min: 1})
    .escape(),
  body('due_back', 'Due back must not be empty.')
    .optional({ checkFalsy: true }).isISO8601().toDate(),
  
  //Proccess request after sanitization and validation
  (req, res, next) => {
    //Extract the validation errors from a request
    const errors = validationResult(req);

    //Create BookInstance object with escaped and trim data (sanitized)
    const bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    })

    if(!errors.isEmpty()) {
      //There are errors. Render form again with sanitized values/error messages

      //Get all books from form
      async.parallel(
        {
          books(callback) {
            Book.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.render('bookinstance_form', {
            title: 'Create Book Instance',
            books: results.books,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    //Data from form is valid. Save BookInstance
    bookinstance.save((err) => {
      if (err) {
        return next(err);
      }

      //Successful, redirect to new book instance.
      res.redirect(bookinstance.url);
    });
  },
];

//Display BookInstance delete form on GET
exports.bookinstance_delete_get = function(req, res, next) {
  async.parallel(
    {
      instance(callback) {
        BookInstance.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results == null) {
        //No results.
        res.redirect('/catalog/bookinstances');
      }
      //Successful. so render.
      res.render('bookinstance_delete', {
        title: 'Book Instance Delete',
        instance: results.instance,
      });
    }
  );
};

//Display BookInstance delete on POST
exports.bookinstance_delete_post = function(req, res, next) {
  async.parallel(
    {
      instance(callback) {
        BookInstance.findById(req.body.instanceid).exec(callback);
      },
    },
    (err) => {
      if (err) {
        return next(err);
      }
      //Success. Delete object and redirect to list of instances.
      BookInstance.findByIdAndRemove(req.body.instanceid, (err) => {
        if (err) {
          return next(err);
        }
        //Succes. go to list of instances
        res.redirect('/catalog/bookinstances');
      });
    }
  );
};

//Display BookInstance update form on GET
exports.bookinstance_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
};

//Display BookInstance update on POST
exports.bookinstance_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};