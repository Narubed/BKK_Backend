import { Request, Response, NextFunction } from "express";
import { Schema, ValidationResult } from "@hapi/joi";

export const validate =
  (schema: Schema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const data = { ...req.body, ...req.query, ...req.params }; // ✅ รวมทั้ง req.body และ req.query
    const { error }: ValidationResult = schema.validate(data, { abortEarly: false });

    if (error) {
      res.status(400).json({
        message: "Validation error",
        details: error.details.map((err) => err.message), // ✅ แสดง error ทั้งหมด
      });
      return;
    }

    next(); // ✅ Validation ผ่านให้ไปต่อ
  };
