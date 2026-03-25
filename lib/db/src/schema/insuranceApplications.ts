import { pgTable, serial, text, integer, numeric, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const insuranceApplicationsTable = pgTable("insurance_applications", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  businessType: text("business_type").notNull(),
  industry: text("industry").notNull(),
  yearsInBusiness: integer("years_in_business").notNull(),
  annualRevenue: numeric("annual_revenue", { precision: 15, scale: 2 }).notNull(),
  numberOfEmployees: integer("number_of_employees").notNull(),
  businessAddress: text("business_address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),

  coverageTypes: jsonb("coverage_types").$type<string[]>().default([]),
  coverageLimit: text("coverage_limit"),
  deductible: text("deductible"),
  effectiveDate: text("effective_date"),

  hasPriorClaims: boolean("has_prior_claims"),
  priorClaimsDescription: text("prior_claims_description"),
  hasHazardousMaterials: boolean("has_hazardous_materials"),
  isHomeBasedBusiness: boolean("is_home_based_business"),
  operatesMultipleLocations: boolean("operates_multiple_locations"),

  contactFirstName: text("contact_first_name"),
  contactLastName: text("contact_last_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  contactTitle: text("contact_title"),
  additionalNotes: text("additional_notes"),

  currentStage: integer("current_stage").notNull().default(1),
  status: text("status").notNull().default("draft"),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertInsuranceApplicationSchema = createInsertSchema(insuranceApplicationsTable, {
  annualRevenue: z.coerce.number().min(0),
}).omit({ id: true, createdAt: true, updatedAt: true, submittedAt: true });

export type InsertInsuranceApplication = z.infer<typeof insertInsuranceApplicationSchema>;
export type InsuranceApplication = typeof insuranceApplicationsTable.$inferSelect;
