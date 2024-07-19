const express = require('express');
const cors = require('cors');
const albums = require('./data/albums');

const app = express();

app.use(cors());
app.use(express.json());

app.set('port', process.env.PORT || 3001);
app.locals.title = 'Taylor Swift Album Collection';

app.get('/api/v1/albums', (req, res) => {
  res.json(albums);
});

app.get('/api/v1/albums/:id', (req, res) => {
  const { id } = req.params;
  const album = albums.find(album => album.id === id);
  if (!album) {
    return res.sendStatus(404);
  }
  res.json(album);
});

app.post('/api/v1/albums', (req, res) => {
  const id = Date.now().toString();
  const { name, releaseDate, inspiration, majorAwards, image } = req.body;

  if (!name || !releaseDate || !inspiration || !majorAwards || !image) {
    return res.status(400).send('All album details are required');
  }

  const newAlbum = { id, name, releaseDate, inspiration, majorAwards, image };
  albums.push(newAlbum);
  console.log('POST action:', newAlbum);
  res.status(201).json(newAlbum);
});

app.put('/api/v1/albums/:id', (req, res) => {
  const { id } = req.params;
  const { name, releaseDate, inspiration, majorAwards, image } = req.body;
  const index = albums.findIndex(album => album.id === id);

  if (index === -1) {
    return res.sendStatus(404);
  }

  const updatedAlbum = { ...albums[index], name, releaseDate, inspiration, majorAwards, image };
  albums[index] = updatedAlbum;
  console.log('PUT action:', updatedAlbum);
  res.json(updatedAlbum);
});

app.delete('/api/v1/albums/:id', (req, res) => {
  const { id } = req.params;
  const index = albums.findIndex(album => album.id === id);

  if (index === -1) {
    return res.sendStatus(404);
  }

  const deletedAlbum = albums.splice(index, 1)[0];
  console.log('DELETE action:', deletedAlbum);
  res.sendStatus(204);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Taylor Swift Album Collection!');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});
