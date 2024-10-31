import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { schoolId } = req.query; // Obtener el schoolId de la query
    console.log("schoolId:", schoolId);
    try {
      const groups = await prisma.group.findMany({
        where: {
          school_id: parseInt(schoolId),
        },
      });
      console.log("groups:", groups);
      res.status(200).json({ groups });
    } catch (error) {
      res.status(500).json({ error: "Error fetching groups" });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body; // Obtener el ID del estudiante
    console.log("id:", id);
    try {
      await prisma.group.delete({
        where: { id: Number(id) },
      });
      res.status(200).json({ message: "Grupo eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar grupo" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader("Allow", ['GET', "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
