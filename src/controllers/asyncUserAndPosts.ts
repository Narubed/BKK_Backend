import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { Response, Request } from "express";
const prisma = new PrismaClient();

async function asyncUsersAndPosts(req: Request, res: Response) {
  try {
    const users = await axios.get("https://jsonplaceholder.typicode.com/users");
    for (const user of users.data) {
      await prisma.user.create({
        data: {
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          website: user.website,
        },
      });
    }
    const posts = await axios.get("https://jsonplaceholder.typicode.com/posts");

    for (const post of posts.data) {
      await prisma.post.create({
        data: {
          title: post.title,
          body: post.body,
          userId: post.userId, // ใช้ FK อ้างถึง User
        },
      });
    }

    console.log("end process success");
    res.send({ success: true, message: 'async data is successfully'})
  } catch (error) {
    console.error("error catch", error);
  } finally {
    console.log("debug asyncUserAndPosts finally process")
    await prisma.$disconnect();
  }
}

// รันฟังก์ชัน
export { asyncUsersAndPosts };
