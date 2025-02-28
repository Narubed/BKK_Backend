"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    const data = Object.assign(Object.assign(Object.assign({}, req.body), req.query), req.params); // ✅ รวมทั้ง req.body และ req.query
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
        res.status(400).json({
            message: "Validation error",
            details: error.details.map((err) => err.message), // ✅ แสดง error ทั้งหมด
        });
        return;
    }
    next(); // ✅ Validation ผ่านให้ไปต่อ
};
exports.validate = validate;
