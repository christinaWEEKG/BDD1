const express = require("express");
const movieDB = require("../model/movie");
const genreDB = require("../model/genre");
const userDB = require("../model/user");
const path = require('path');

var app = express();

app.use(express.static(path.resolve("./public")));
app.use(express.json());



// GET by movie name which begin with 'A' and ascending order by release_date
app.get("/movieNameBySubString=A", (req, res) => {
  
  movieDB.getMovieBySubString((err, result) => {
    //console.log(err, result)
  
  if (err) {
      res.status(500).send(err);
    } else
      { res.status(200).send(result); }
    })
  })

//GET Active movies
app.get("/movie=ACTIVE", (req, res) => {
    
  movieDB.getActiveMovie((err, result) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(result);
    }
  })
  });


// GET ALL movies
app.get("/movies", (req, res) => {
  
  movieDB.getAllMovie((err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      {
        res.status(200).send(result);
      }
    }
  });
});

//INSERT movie
app.post("/movie", (req, res) => {
  var {name_movie,description_movie,release_date,image_URL,genre_id,date_inserted} = req.body;

  movieDB.addMovie(name_movie, description_movie, release_date, image_URL, genre_id, date_inserted, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } 
      else {
        res.status(200).send({ message: "Movie " + result.insertId + " has been added." });
      }
    })
  });


//GET all genres
app.get("/genres", (req, res) => {
  genreDB.getAllGenre((err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      {
      res.status(200).send(result);
      }
    }
  })
})

//INSERT genres
app.post("/genre", (req, res) => {
  var {name_genre,description_genre} = req.body;

  genreDB.addGenre(name_genre,description_genre,(err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send({ message: "Genre " + result.insertId + " has been added." });
      }
    }
  );
});



// Verify admin credentials (middleware) 
// added Return to fix error[err_http_headers_sent]
app.use("/users/login",(req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  console.log(email, password)
    
  userDB.login(email, password, (err, result) => {
    
    if (err) {
      res.status(500).send(err);
    } else {
      if (result.length > 0 && result[0].role== 'admin') {
        console.log(result[0]);
        return res.send(result = { "message": "username and password checked and admin verified" })
        //req.role = result[0].role;
        next();
      }else {
        res.send({ message: "wrong username/password and/or not an admin." })
        }
      }
  })
})

// middleware to customised bad request 404 message
app.use((req, res, next) => {
  res.status(404).send({ message:'Error Occured! ' });
});



module.exports = app;
