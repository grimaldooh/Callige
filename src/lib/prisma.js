// lib/prisma.js

import { PrismaClient } from '@prisma/client';
require('dotenv').config(); // Asegúrate de cargar las variables de entorno


let prisma;
console.log('Connecting to database at:', process.env.DATABASE_URL1);

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
