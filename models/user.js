const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

//! === Mongoose schema ===

const userSchema = new Schema(
  {
    password: {
      type: String,
      minLength: 6,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: String,
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

//! === Joi schema ===

const userJoiSchema = Joi.object({
  password: Joi.string()
    .required()
    .messages({ "any.required": "Set password for user" }),
  email: Joi.string()
    .pattern(emailRegexp) // замість стандартного - '.email()'
    .required()
    .messages({ "any.required": "Email is required" }),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
});

const schemas = {
  userJoiSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
