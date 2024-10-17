import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { schoolId } = req.query; // Obtener el schoolId de la query
    console.log("schoolId:", schoolId);
    try {
      const events = await prisma.event.findMany({
        where: {
          school_id: parseInt(schoolId),
        },
      });
      console.log("events:", events);
      res.status(200).json({ events });
    } catch (error) {
      res.status(500).json({ error: "Error fetching events" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body; // Obtener el ID del estudiante
    console.log("id:", id);
    try {
      await prisma.event.delete({
        where: { id: Number(id) },
      });
      res.status(200).json({ message: "Evento eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar evento" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
