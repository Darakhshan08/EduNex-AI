const express = require("express");


import { deleteDataset, downloadDataset, listDatasets, uploadDataset } from '../controllers/datasetController.js';
import upload from '../middleware/upload.js';

const datasetRoutes = express.Router()

datasetRoutes.post('/upload', upload.single('file'), uploadDataset);
datasetRoutes.get('/', listDatasets);
datasetRoutes.delete('/:id', deleteDataset);
datasetRoutes.get('/:id/download', downloadDataset);

export default datasetRoutes;