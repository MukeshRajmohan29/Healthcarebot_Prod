const express = require('express');
const cors = require('cors');
require('dotenv').config();

const chatRoutes = require('./routes/chat');
const chatlogRoutes = require('./routes/chatlog');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes);
app.use('/api/chatlog', chatlogRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
