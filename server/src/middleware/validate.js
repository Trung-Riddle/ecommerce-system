const joi = require("joi");


exports.validate = (joiSchema) => (req, res, next) => {
    const { error } = joiSchema.validate(req.body);
    if (error) throw new Error(error.detail[0].message?.replaceAll('\"', ''))
    next()
}

exports.email = joi
  .string()
  .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
  .required();
exports.emailNotRequired = joi
  .string()
  .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
  .allow("", null);
exports.password = joi.string().required().min(6);
exports.name = joi.string().required();
exports.avatar = joi.string().uri().allow("", null);
exports.role = joi.string().allow("", null);
exports.code = joi.string().required();
exports.image = joi.string().required();

// FORM COMMON
exports.arrayRequired = joi.array().required();
exports.array = joi.array().allow(null, "");
exports.stringRequired = joi.string().required();
exports.string = joi.string().allow(null, "");
exports.number = joi.number().allow(null, "");
exports.numberRequired = joi.number().required();
exports.date = joi.date().allow(null, "");
exports.dateRequired = joi.date().required();