const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./services/movieDb'); // this is like importing and exporting

// this takes a json object and converts it into something we can use in JS
app.use(bodyParser.json());

// this defines an endpoint that the body would be able to hit
// structure it like a url
// the callback function gets two parameters: 
// the first describes the request going in, and the second describes the response

// app.get('/api/message', function(request, response) {
//     console.log("this is hit");
//     response.send("Thanks for calling");
// });

// app.post('/api/message', function (request, response) {
//     console.log(request.body);
//     response.send("Thank you for your message");
// })

//write endpoint where we get movies
app.get('/api/movies', function(req, res) {
    res.status(200).send(db.getMovies(req.query));
});

app.post('/api/movies', function(req, res) {
    // the data should be on the body of the request
    // req.body is the new movie
    // check that req.body is good
    if(req.body.name && req.body.year) {
        db.addMovie(req.body);
        var movies = db.getMovies();

        res.send(movies[movies.length-1]);
    }
    else {
        res.statusCode(400).send('Must supply name and year');
    }
});

app.put('/api/movies/vote/:id', function(req, res) { //arrow functions are OK to use 
    // this is how we access the parameters (using params) req.params.id;
    db.upvoteMovie(req.params.id);
    res.status(200).send(db.getMovie(req.params.id)); 
    // dont forget to send back a response. 
    // If you don't the browser can get hung up waiting for a response
});

app.put('/api/movies/:id', (req, res) => {
    db.updateMovie(req.params.id, req.body);
    res.status(200).send(db.getMovie(req.params.id));
});

app.listen(3000, function() { // nothing special about this port--just be careful about what port you use. Some are kind of restricted.
    console.log("listening on port 3000");
});