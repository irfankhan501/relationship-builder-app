const mongoose = require("mongoose");
const Joi = require("joi");

const relationShipSchema = new mongoose.Schema({
    first_person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Person"
    },
    relation: {
        type: String,
        required: true
    },
    second_person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Person"
    }
}) 

const RelationShip = mongoose.model("RelationShip", relationShipSchema);

function validateRelationShip(rel) {
    const schema = Joi.object({
      first_person: Joi.string().min(3).max(255).required(),
      relation: Joi.string().required(),
      second_person: Joi.string().min(3).max(255).required(),
    });
  
    return schema.validate(rel);
  }

exports.RelationShip = RelationShip;
exports.validate = validateRelationShip;