const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config(); // Cargar variables de entorno desde .env

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error("Azure Storage Connection string no está configurada");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

const containerName = "images";
const containerClient = blobServiceClient.getContainerClient(containerName);

async function uploadImage(file) {
  const blobName = file.originalname; // Nombre del archivo
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    const uploadBlobResponse = await blockBlobClient.uploadData(file.buffer);
    console.log(`Imagen subida satisfactoriamente: ${blobName}`, uploadBlobResponse);
    return blockBlobClient.url; // Retorna la URL de la imagen subida
  } catch (err) {
    console.error('Error subiendo la imagen:', err.message);
  }
}

module.exports = { uploadImage };