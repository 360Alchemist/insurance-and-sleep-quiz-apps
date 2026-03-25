import { Router, type IRouter } from "express";
import { db, insuranceApplicationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/", async (req, res) => {
  try {
    const {
      businessName,
      businessType,
      industry,
      yearsInBusiness,
      annualRevenue,
      numberOfEmployees,
      businessAddress,
      city,
      state,
      zipCode,
    } = req.body;

    if (!businessName || !businessType || !industry || yearsInBusiness === undefined ||
        annualRevenue === undefined || numberOfEmployees === undefined ||
        !businessAddress || !city || !state || !zipCode) {
      res.status(400).json({ error: "Missing required fields for stage 1" });
      return;
    }

    const [app] = await db.insert(insuranceApplicationsTable).values({
      businessName,
      businessType,
      industry,
      yearsInBusiness: Number(yearsInBusiness),
      annualRevenue: String(annualRevenue),
      numberOfEmployees: Number(numberOfEmployees),
      businessAddress,
      city,
      state,
      zipCode,
      currentStage: 1,
      status: "draft",
    }).returning();

    res.status(201).json(formatApp(app));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create application" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid application ID" });
      return;
    }

    const [app] = await db.select().from(insuranceApplicationsTable).where(eq(insuranceApplicationsTable.id, id));
    if (!app) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    res.json(formatApp(app));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch application" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid application ID" });
      return;
    }

    const [existing] = await db.select().from(insuranceApplicationsTable).where(eq(insuranceApplicationsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    if (existing.status === "submitted") {
      res.status(400).json({ error: "Cannot update a submitted application" });
      return;
    }

    const {
      coverageTypes,
      coverageLimit,
      deductible,
      effectiveDate,
      hasPriorClaims,
      priorClaimsDescription,
      hasHazardousMaterials,
      isHomeBasedBusiness,
      operatesMultipleLocations,
      contactFirstName,
      contactLastName,
      contactEmail,
      contactPhone,
      contactTitle,
      additionalNotes,
      currentStage,
    } = req.body;

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (coverageTypes !== undefined) updateData.coverageTypes = coverageTypes;
    if (coverageLimit !== undefined) updateData.coverageLimit = coverageLimit;
    if (deductible !== undefined) updateData.deductible = deductible;
    if (effectiveDate !== undefined) updateData.effectiveDate = effectiveDate;
    if (hasPriorClaims !== undefined) updateData.hasPriorClaims = hasPriorClaims;
    if (priorClaimsDescription !== undefined) updateData.priorClaimsDescription = priorClaimsDescription;
    if (hasHazardousMaterials !== undefined) updateData.hasHazardousMaterials = hasHazardousMaterials;
    if (isHomeBasedBusiness !== undefined) updateData.isHomeBasedBusiness = isHomeBasedBusiness;
    if (operatesMultipleLocations !== undefined) updateData.operatesMultipleLocations = operatesMultipleLocations;
    if (contactFirstName !== undefined) updateData.contactFirstName = contactFirstName;
    if (contactLastName !== undefined) updateData.contactLastName = contactLastName;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
    if (contactTitle !== undefined) updateData.contactTitle = contactTitle;
    if (additionalNotes !== undefined) updateData.additionalNotes = additionalNotes;
    if (currentStage !== undefined) updateData.currentStage = Number(currentStage);

    const [app] = await db.update(insuranceApplicationsTable)
      .set(updateData as Parameters<typeof db.update>[0] extends infer T ? T : never)
      .where(eq(insuranceApplicationsTable.id, id))
      .returning();

    res.json(formatApp(app));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update application" });
  }
});

router.post("/:id/submit", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid application ID" });
      return;
    }

    const [existing] = await db.select().from(insuranceApplicationsTable).where(eq(insuranceApplicationsTable.id, id));
    if (!existing) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    if (existing.status === "submitted") {
      res.status(400).json({ error: "Application already submitted" });
      return;
    }

    if (!existing.contactFirstName || !existing.contactLastName || !existing.contactEmail) {
      res.status(400).json({ error: "Application is incomplete. Please fill all required fields." });
      return;
    }

    const [app] = await db.update(insuranceApplicationsTable)
      .set({ status: "submitted", submittedAt: new Date(), updatedAt: new Date() } as Parameters<typeof db.update>[0] extends infer T ? T : never)
      .where(eq(insuranceApplicationsTable.id, id))
      .returning();

    res.json(formatApp(app));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

function formatApp(app: typeof insuranceApplicationsTable.$inferSelect) {
  return {
    id: app.id,
    businessName: app.businessName,
    businessType: app.businessType,
    industry: app.industry,
    yearsInBusiness: app.yearsInBusiness,
    annualRevenue: Number(app.annualRevenue),
    numberOfEmployees: app.numberOfEmployees,
    businessAddress: app.businessAddress,
    city: app.city,
    state: app.state,
    zipCode: app.zipCode,
    coverageTypes: (app.coverageTypes as string[]) ?? [],
    coverageLimit: app.coverageLimit ?? null,
    deductible: app.deductible ?? null,
    effectiveDate: app.effectiveDate ?? null,
    hasPriorClaims: app.hasPriorClaims ?? null,
    priorClaimsDescription: app.priorClaimsDescription ?? null,
    hasHazardousMaterials: app.hasHazardousMaterials ?? null,
    isHomeBasedBusiness: app.isHomeBasedBusiness ?? null,
    operatesMultipleLocations: app.operatesMultipleLocations ?? null,
    contactFirstName: app.contactFirstName ?? null,
    contactLastName: app.contactLastName ?? null,
    contactEmail: app.contactEmail ?? null,
    contactPhone: app.contactPhone ?? null,
    contactTitle: app.contactTitle ?? null,
    additionalNotes: app.additionalNotes ?? null,
    currentStage: app.currentStage,
    status: app.status,
    submittedAt: app.submittedAt?.toISOString() ?? null,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  };
}

export default router;
