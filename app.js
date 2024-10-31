const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const supabase = require('./services/supabase'); // Importa il client Supabase
const apiRoutes = require('./routes/api'); // Importa le rotte API

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/index.html'));
});

// Usa le rotte API
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});
