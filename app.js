require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error)); 


// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('home');
})

app.get('/artist-search', (req, res, next) => {
    spotifyApi.searchArtists(req.query.artist)
        .then(data => {
            const results = {artists: data.body.artists.items}
            res.render('artist', results);
        })
        .catch(err => console.log('The error occured while searching artists: ', err))

})

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums(req.params.artistId, { limit: 10, offset: 20 })
        .then(data => {
            const results = {albums: data.body.items}
            res.render('albums', results)
        })
        .catch(err => console.log('The error occured while searching albums: ', err))

})

app.get('/tracks/:albumId', (req, res, next) => {
    spotifyApi.getAlbumTracks(req.params.albumId)
        .then(data => {
            console.log(data.body.items[0].artists)
            const results = {tracks: data.body.items}
            res.render('tracks', results)
        })
        .catch(err => console.log('The error occured while searching tracks: ', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
