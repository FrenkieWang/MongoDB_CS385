const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
require('dotenv').config();
const ATLAS_URI = process.env.ATLAS_URI;

mongoose.connect(ATLAS_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(() => console.log('MongoDB failed to connect'));

// Define Collection Schema
const ModuleSchema = new mongoose.Schema({
  code: String,
  moduleName: String
}, { collection: 'Module' });
const Module = mongoose.model('Module', ModuleSchema);

// [Path 1 - Get] -- Get all Modules
app.get('/modules/get', (request, response) => {
  Module.find()
    .then(data => response.json(data))
    .catch(error => response.status(500).json(error));
});

// [Path 2 - POST] -- Create a Module
app.post('/modules/create', (request, response) => {
  const newModule = new Module(request.body);  
  newModule.save()
    .then(data => response.json(data))
    .catch(error => response.status(500).json(error));
});

// [Path 3 - GET] -- Get a Module
app.get('/modules/get/:id', (request, response) => {
  Module.findById(request.params.id)
    .then(data => response.json(data))
    .catch(error => response.status(500).json(error));
});

// [Path 4 - PUT] -- Update a Module
app.put('/modules/update/:id', (request, response) => {
  Module.findByIdAndUpdate(request.params.id, 
    request.body, { new: true, runValidators: true })
      .then(data => response.json(data))
      .catch(error => response.status(500).json(error));
});

// [Path 5 -- DELETE] -- Delete a Module
app.delete('/modules/delete/:id', (request, response) => {
  Module.findByIdAndDelete(request.params.id)
    .then(data => response.json(data))
    .catch(error => response.status(500).json(error));
});

// Other Path - Not Found
app.use((request, response) => {
  response.status(404).send('Path not found.');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});