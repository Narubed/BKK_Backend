import Joi from "@hapi/joi";

export const onQueryAllPostsSchema = Joi.object({
  page: Joi.number().integer().min(1).required(),
  pageSize: Joi.number().integer().min(1).max(100).required(),
  search: Joi.string().optional(),
});

export const onCreatePostsSchema = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  userId: Joi.number().required(),
});
export const onUpdatePostsSchema = Joi.object({
  id: Joi.number().integer().required(),
  title: Joi.string().required(),
  body: Joi.string().required(),
  userId: Joi.number().integer().optional(),
});
export const onPatchPostsSchema = Joi.object({
  id: Joi.number().integer().required(),
  title: Joi.string().optional(),
  body: Joi.string().optional(),
  userId: Joi.number().integer().optional(),
  });
export const onRequestIDSchema = Joi.object({
  id: Joi.number().integer().required(),
});
