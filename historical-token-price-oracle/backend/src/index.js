require('dotenv').config();
const express = require('express');
const connectMongo = require('./db/mongo');
const priceRoutes = require('./routes/priceRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
require('./jobs/worker');

const app = express();
app.use(express.json());

app.use('/price', priceRoutes);
app.use('/schedule', scheduleRoutes);

const PORT = process.env.PORT || 5000;
connectMongo().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});