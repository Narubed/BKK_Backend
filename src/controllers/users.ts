import express from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
    try {
      const { page, pageSize, search } = req.query;
      const pageNumber = parseInt(page as string, 10) || 1;
      const pageSizeNumber = parseInt(pageSize as string, 10) || 10;
      const skip = (pageNumber - 1) * pageSizeNumber;
      const take = pageSizeNumber;
      const where = search
        ? {
            OR: [
              { name: { contains: search as string } },
              { email: { contains: search as string } },
              { phone: { contains: search as string } },
              { website: { contains: search as string } },
            ],
          }
        : {};
  
      const totalUsers = await prisma.user.count({ where });
      const totalPages = Math.ceil(totalUsers / pageSizeNumber);
      const results = await prisma.user.findMany({
        where,
        skip,
        take,
        include: {
          posts: true,
        },
      });
  
      res.status(200).json({
        currentPage: pageNumber,
        totalPages: totalPages,
        pageSize: pageSizeNumber,
        total: totalUsers,
        data: results,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(400).send({ error: "Cannot get users" });
    }
  };
export const getUsersByID = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(400).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(400).send({ error: "Cannot get user" });
  }
};
export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await prisma.user.create({
      data: { ...req.body },
    });
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send({ error: "Cannot create user" });
  }
};
export const updateUser = async (req: Request, res: Response) => {
  try {
    const body = req.body
    if (body.id) {
      delete body.id
    }
    const updatedUser = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.send(updatedUser);
  } catch (error) {
    res.status(400).send({ error: "Cannot update user" });
  }
};
export const patchUser = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: body,
    });
    res.send(updatedUser);
  } catch (error) {
    res.status(400).send({ error: "Cannot patch user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).send({ error: "Cannot delete user" });
  }
};
