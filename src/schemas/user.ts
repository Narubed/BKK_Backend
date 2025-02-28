import Joi from "@hapi/joi";

export const onQueryAllUsersSchema = Joi.object({
  page: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
  search: Joi.string().optional(),
});

export const onCreateUsersSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  website: Joi.string().optional(),
  address: Joi.string().optional(),
  company: Joi.string().optional(),
});
export const onUpdateUsersSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional(),
  website: Joi.string().optional(),
  address: Joi.string().optional(),
  company: Joi.string().optional(),
});
export const onPatchUsersSchema = Joi.object({
    id: Joi.number().integer().required(),
    name: Joi.string().optional(),
    username: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    website: Joi.string().optional(),
    address: Joi.string().optional(),
    company: Joi.string().optional(),
  });
export const onRequestIDSchema = Joi.object({
  id: Joi.number().integer().required(),
});
