import { Joi, validate } from "express-validation";

const cmsValidation = {
    body: Joi.object({
        googleMap: Joi.string().allow(null, "").optional(),
        loginPageImage: Joi.string().allow(null, "").optional(),
        aboutUsContent: Joi.string().allow(null, "").optional(),
        contactUsImage: Joi.string().allow(null, "").optional(),
        locationImage: Joi.string().allow(null, "").optional(),
        faqImage: Joi.string().allow(null, "").optional(),
        policyImage: Joi.string().allow(null, "").optional(),
        companyName: Joi.string().allow(null, "").optional(),
        email: Joi.string().allow(null, "").optional(),
        companyNameBangla: Joi.string().allow(null, "").optional(),
        companyLogo: Joi.string().allow(null, "").optional(),
        companyLogoBangla: Joi.string().allow(null, "").optional(),
        footerLogo: Joi.string().allow(null, "").optional(),
        footerLogoBangla: Joi.string().allow(null, "").optional(),
        address: Joi.string().allow(null, "").optional(),
        addressBangla: Joi.string().allow(null, "").optional(),
        city: Joi.string().allow(null, "").optional(),
        cityBangla: Joi.string().allow(null, "").optional(),
        postalCode: Joi.string().allow(null, "").optional(),
        supportNumber1: Joi.string().allow(null, "").optional(),
        supportNumber2: Joi.string().allow(null, "").optional(),
        offeredImageOne: Joi.string().allow(null, "").optional(),
        offeredImageTwo: Joi.string().allow(null, "").optional(),
        offeredImageThree: Joi.string().allow(null, "").optional(),
        findTicketBanner: Joi.string().allow(null, "").optional(),
        homePageDescription: Joi.string().allow(null, "").optional(),
        homePageDescriptionBangla: Joi.string().allow(null, "").optional(),
        facebook: Joi.string().allow(null, "").optional(),
        instagram: Joi.string().allow(null, "").optional(),
        twitter: Joi.string().allow(null, "").optional(),
        linkedin: Joi.string().allow(null, "").optional(),
        youtube: Joi.string().allow(null, "").optional(),
        qrImage: Joi.string().allow(null, "").optional(),
        blogImage: Joi.string().allow(null, "").optional(),
    })
}

export const verifyCMS = validate(cmsValidation, {}, {})

