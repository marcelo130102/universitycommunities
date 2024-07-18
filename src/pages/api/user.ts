import { prisma } from "@/utils/MyPrismaClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { first_name, username } = req.body;
    const userId = req.query.userId; // Suponiendo que tienes un middleware que agrega userId al objeto req
    const parsedId = parseInt(userId as string, 10);
    try {
      const updatedUser = await prisma.user.update({
        where: {
          user_id: parsedId,
        },
        data: {
          first_name,
          username,
        },
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    try {
      const { email } = req.query;

      const user = await prisma.user.findUnique({
        where: {
          email: email as string,
        },
      });

      res.status(200).json(user);
    } catch (error) {
      console.error("Error retrieving user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      await prisma.$disconnect();
    }
  }
  else {
    res.setHeader('Allow', ['PUT', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
