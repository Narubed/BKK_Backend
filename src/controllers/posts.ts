import express from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { page, pageSize, search } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSizeNumber = parseInt(pageSize as string, 10) || 10;
    const skip = (pageNumber - 1) * pageSizeNumber;
    const take = pageSizeNumber;
    const where = search
      ? {
          OR: [
            {
              title: { contains: search as string },
            },
          ],
        }
      : {};

    const totalPosts = await prisma.post.count({ where });
    const totalPages = Math.ceil(totalPosts / pageSizeNumber);

    const results = await prisma.post.findMany({
      where,
      skip: skip,
      take: take,
    });

    res.status(200).json({
      currentPage: pageNumber,
      totalPages: totalPages,
      pageSize: pageSizeNumber,
      total: totalPosts,
      data: results,
    });
  } catch (error) {
    res.status(400).send({ error: "Cannot get Posts" });
  }
};

export const getPostsByID = async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (post) {
      res.status(200).send(post);
    } else {
      res.status(400).send({ error: "post not found" });
    }
  } catch (error) {
    res.status(400).send({ error: "Cannot get post" });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const newPost = await prisma.post.create({
      data: { ...req.body },
    });
    res.status(201).send(newPost);
  } catch (error) {
    res.status(400).send({ error: "Cannot create post" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const updatedPost = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.send(updatedPost);
  } catch (error) {
    res.status(400).send({ error: "Cannot update post" });
  }
};

export const patchPost = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const updatedPost = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: body,
    });
    res.send(updatedPost);
  } catch (error) {
    res.status(400).send({ error: "Cannot patch post" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    await prisma.post.delete({ where: { id: Number(req.params.id) } });
    res.send({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(400).send({ error: "Cannot delete post" });
  }
};
