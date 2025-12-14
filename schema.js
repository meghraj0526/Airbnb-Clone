const Joi = require('joi');

const listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required
    }).required()
})