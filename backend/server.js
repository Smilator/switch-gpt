const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const gamesRoutes = require('./routes/games');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use('/api', gamesRoutes);
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
