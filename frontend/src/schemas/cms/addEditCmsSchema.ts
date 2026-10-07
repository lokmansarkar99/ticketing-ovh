import { z } from "zod";

export const addUpdateCompanySchema = z.object({
  companyName: z.string().nullish(),
  companyNameBangla: z.string().nullish(),
  companyLogo: z.string().nullish(),
  companyLogoBangla: z.string().nullish(),
  footerLogo: z.string().nullish(),
  footerLogoBangla: z.string().nullish(),
  email: z.string().nullish(),
  address: z.string().nullish(),
  addressBangla: z.string().nullish(),
  city: z.string().nullish(),
  cityBangla: z.string().nullish(),
  postalCode: z.string().nullish(),
  supportNumber1: z.string().nullish(),
  supportNumber2: z.string().nullish(),
  facebook: z.string().nullish(),
  instagram: z.string().nullish(),
  youtube: z.string().nullish(),
  twitter: z.string().nullish(),
  linkedin: z.string().nullish(),
  offeredImageOne: z.string().nullish(), // Added
  offeredImageTwo: z.string().nullish(),
  offeredImageThree: z.string().nullish(), 
  findTicketBanner: z.string().nullish(), 
  loginPageImage: z.string().nullish(), 
  homePageDescription: z.string().nullish(), // Added
  homePageDescriptionBangla: z.string().nullish(),
  aboutUsContent: z.string().nullish(),
  googleMap: z.string().nullish(),
  contactUsImage: z.string().nullish(),
  locationImage: z.string().nullish(),
  faqImage: z.string().nullish(),
  policyImage: z.string().nullish(),
  qrImage: z.string().nullish(),
  blogImage: z.string().nullish(),
});

export type AddUpdateCompanyProps = z.infer<typeof addUpdateCompanySchema>;
