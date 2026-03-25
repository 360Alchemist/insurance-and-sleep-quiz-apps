import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { StepIndicator } from "@/components/StepIndicator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const COVERAGE_OPTIONS = [
  { id: "general_liability", label: "General Liability", description: "Protects against third-party bodily injury and property damage claims" },
  { id: "commercial_property", label: "Commercial Property", description: "Covers your business property and assets" },
  { id: "workers_compensation", label: "Workers' Compensation", description: "Required in most states for employee workplace injuries" },
  { id: "professional_liability", label: "Professional Liability (E&O)", description: "Protects against negligence claims from clients" },
  { id: "commercial_auto", label: "Commercial Auto", description: "Covers vehicles used for business purposes" },
  { id: "cyber_liability", label: "Cyber Liability", description: "Protects against data breaches and cyber attacks" },
  { id: "umbrella", label: "Umbrella / Excess Liability", description: "Additional coverage beyond your primary policies" },
];

const INDUSTRIES = [
  "Retail", "Restaurant / Food Service", "Construction", "Healthcare",
  "Technology / IT", "Professional Services", "Manufacturing", "Real Estate",
  "Transportation / Logistics", "Financial Services", "Education", "Non-profit", "Other"
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC"
];

const step1Schema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessType: z.enum(["sole_proprietorship","partnership","llc","corporation","nonprofit"], {
    required_error: "Please select a business type",
  }),
  industry: z.string().min(1, "Please select an industry"),
  industryOther: z.string().optional(),
  yearsInBusiness: z.coerce.number().min(0, "Must be 0 or more").int("Must be a whole number"),
  annualRevenue: z.coerce.number().min(0, "Must be 0 or more"),
  numberOfEmployees: z.coerce.number().min(0, "Must be 0 or more").int("Must be a whole number"),
  businessAddress: z.string().min(5, "Please enter a full address"),
  city: z.string().min(2, "Please enter a city"),
  state: z.string().min(2, "Please select a state"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
}).superRefine((data, ctx) => {
  if (data.industry === "Other" && (!data.industryOther || data.industryOther.trim().length < 2)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please describe your industry",
      path: ["industryOther"],
    });
  }
});

const step2Schema = z.object({
  coverageTypes: z.array(z.string()).min(1, "Please select at least one coverage type"),
  coverageLimit: z.string().min(1, "Please select a coverage limit"),
  deductible: z.string().min(1, "Please select a deductible"),
  effectiveDate: z.string().min(1, "Please select an effective date"),
});

const step3Schema = z.object({
  hasPriorClaims: z.enum(["true","false"], { required_error: "Please answer this question" }),
  priorClaimsDescription: z.string().optional(),
  hasHazardousMaterials: z.enum(["true","false"], { required_error: "Please answer this question" }),
  isHomeBasedBusiness: z.enum(["true","false"], { required_error: "Please answer this question" }),
  operatesMultipleLocations: z.enum(["true","false"], { required_error: "Please answer this question" }),
});

const step4Schema = z.object({
  contactFirstName: z.string().min(1, "First name is required"),
  contactLastName: z.string().min(1, "Last name is required"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().regex(/^\+?[\d\s\-()]{10,}$/, "Please enter a valid phone number"),
  contactTitle: z.string().min(1, "Job title is required"),
  additionalNotes: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type Step4Data = z.infer<typeof step4Schema>;

const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function InsuranceForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState(1);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const form2 = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { coverageTypes: [] },
  });
  const form3 = useForm<Step3Data>({ resolver: zodResolver(step3Schema) });
  const form4 = useForm<Step4Data>({ resolver: zodResolver(step4Schema) });

  const goNext = () => {
    setDirection(1);
    setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);
    setCurrentStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setDirection(-1);
    setCurrentStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onStep1Submit = async (data: Step1Data) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        industry: data.industry === "Other" && data.industryOther
          ? `Other: ${data.industryOther}`
          : data.industry,
      };
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save application");
      }
      const app = await res.json();
      setApplicationId(app.id);
      goNext();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "An error occurred";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const onStep2Submit = async (data: Step2Data) => {
    if (!applicationId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, currentStage: 2 }),
      });
      if (!res.ok) throw new Error("Failed to save coverage information");
      goNext();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "An error occurred";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const onStep3Submit = async (data: Step3Data) => {
    if (!applicationId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hasPriorClaims: data.hasPriorClaims === "true",
          priorClaimsDescription: data.priorClaimsDescription,
          hasHazardousMaterials: data.hasHazardousMaterials === "true",
          isHomeBasedBusiness: data.isHomeBasedBusiness === "true",
          operatesMultipleLocations: data.operatesMultipleLocations === "true",
          currentStage: 3,
        }),
      });
      if (!res.ok) throw new Error("Failed to save risk information");
      goNext();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "An error occurred";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const onStep4Submit = async (data: Step4Data) => {
    if (!applicationId) return;
    setIsLoading(true);
    try {
      const patchRes = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, currentStage: 4 }),
      });
      if (!patchRes.ok) throw new Error("Failed to save contact information");

      const submitRes = await fetch(`/api/applications/${applicationId}/submit`, {
        method: "POST",
      });
      if (!submitRes.ok) throw new Error("Failed to submit application");

      navigate(`/confirmation/${applicationId}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "An error occurred";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const watchedHasPriorClaims = form3.watch("hasPriorClaims");
  const watchedIndustry = form1.watch("industry");
  const watchedCoverageTypes = form2.watch("coverageTypes") || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6 px-4 shadow-md">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">Commercial Insurance Application</h1>
              <p className="text-sm text-primary-foreground/70">Protect your business with comprehensive coverage</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />

        <AnimatePresence mode="wait" initial={false}>
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={pageVariants}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate="animate"
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Business Information</CardTitle>
                  <CardDescription>Tell us about your business so we can find the right coverage.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input id="businessName" placeholder="Acme Corp" {...form1.register("businessName")} className="mt-1" />
                        {form1.formState.errors.businessName && (
                          <p className="text-destructive text-sm mt-1">{form1.formState.errors.businessName.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>Business Type *</Label>
                        <Select onValueChange={(v) => form1.setValue("businessType", v as Step1Data["businessType"])} defaultValue={form1.getValues("businessType")}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select type..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="llc">LLC</SelectItem>
                            <SelectItem value="corporation">Corporation</SelectItem>
                            <SelectItem value="nonprofit">Non-profit</SelectItem>
                          </SelectContent>
                        </Select>
                        {form1.formState.errors.businessType && (
                          <p className="text-destructive text-sm mt-1">{form1.formState.errors.businessType.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>Industry *</Label>
                        <Select onValueChange={(v) => form1.setValue("industry", v)} defaultValue={form1.getValues("industry")}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select industry..." />
                          </SelectTrigger>
                          <SelectContent>
                            {INDUSTRIES.map((ind) => (
                              <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form1.formState.errors.industry && (
                          <p className="text-destructive text-sm mt-1">{form1.formState.errors.industry.message}</p>
                        )}
                      </div>

                      {watchedIndustry === "Other" && (
                        <div className="md:col-span-2">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor="industryOther">Please describe your industry *</Label>
                            <Input
                              id="industryOther"
                              placeholder="e.g. Specialty food manufacturing, Custom woodworking..."
                              {...form1.register("industryOther")}
                              className="mt-1"
                            />
                            {form1.formState.errors.industryOther && (
                              <p className="text-destructive text-sm mt-1">{form1.formState.errors.industryOther.message}</p>
                            )}
                          </motion.div>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                        <Input id="yearsInBusiness" type="number" min={0} placeholder="5" {...form1.register("yearsInBusiness")} className="mt-1" />
                        {form1.formState.errors.yearsInBusiness && (
                          <p className="text-destructive text-sm mt-1">{form1.formState.errors.yearsInBusiness.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="numberOfEmployees">Number of Employees *</Label>
                        <Input id="numberOfEmployees" type="number" min={0} placeholder="10" {...form1.register("numberOfEmployees")} className="mt-1" />
                        {form1.formState.errors.numberOfEmployees && (
                          <p className="text-destructive text-sm mt-1">{form1.formState.errors.numberOfEmployees.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="annualRevenue">Annual Revenue ($) *</Label>
                        <Input id="annualRevenue" type="number" min={0} placeholder="500000" {...form1.register("annualRevenue")} className="mt-1" />
                        {form1.formState.errors.annualRevenue && (
                          <p className="text-destructive text-sm mt-1">{form1.formState.errors.annualRevenue.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="businessAddress">Business Address *</Label>
                        <Input id="businessAddress" placeholder="123 Main Street" {...form1.register("businessAddress")} className="mt-1" />
                        {form1.formState.errors.businessAddress && (
                          <p className="text-destructive text-sm mt-1">{form1.formState.errors.businessAddress.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" placeholder="New York" {...form1.register("city")} className="mt-1" />
                        {form1.formState.errors.city && (
                          <p className="text-destructive text-sm mt-1">{form1.formState.errors.city.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>State *</Label>
                        <Select onValueChange={(v) => form1.setValue("state", v)} defaultValue={form1.getValues("state")}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select state..." />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form1.formState.errors.state && (
                          <p className="text-destructive text-sm mt-1">{form1.formState.errors.state.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input id="zipCode" placeholder="10001" {...form1.register("zipCode")} className="mt-1" />
                        {form1.formState.errors.zipCode && (
                          <p className="text-destructive text-sm mt-1">{form1.formState.errors.zipCode.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                      <Button type="submit" disabled={isLoading} className="min-w-32">
                        {isLoading ? "Saving..." : "Next Step →"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={pageVariants}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate="animate"
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Coverage Needs</CardTitle>
                  <CardDescription>Select the types of coverage you need and set your limits.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-6">
                    <div>
                      <Label className="text-base font-semibold">Coverage Types * (select all that apply)</Label>
                      <div className="mt-3 space-y-3">
                        {COVERAGE_OPTIONS.map((opt) => {
                          const checked = watchedCoverageTypes.includes(opt.id);
                          const toggle = () => {
                            if (checked) {
                              form2.setValue("coverageTypes", watchedCoverageTypes.filter((v) => v !== opt.id));
                            } else {
                              form2.setValue("coverageTypes", [...watchedCoverageTypes, opt.id]);
                            }
                          };
                          return (
                            <div
                              key={opt.id}
                              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                              onClick={toggle}
                            >
                              <Checkbox
                                id={opt.id}
                                checked={checked}
                                onCheckedChange={toggle}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-0.5"
                              />
                              <div>
                                <p className="font-medium text-sm">{opt.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {form2.formState.errors.coverageTypes && (
                        <p className="text-destructive text-sm mt-2">{form2.formState.errors.coverageTypes.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <Label>Coverage Limit *</Label>
                        <Select onValueChange={(v) => form2.setValue("coverageLimit", v)} defaultValue={form2.getValues("coverageLimit")}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select limit..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="500000">$500,000</SelectItem>
                            <SelectItem value="1000000">$1,000,000</SelectItem>
                            <SelectItem value="2000000">$2,000,000</SelectItem>
                            <SelectItem value="5000000">$5,000,000</SelectItem>
                          </SelectContent>
                        </Select>
                        {form2.formState.errors.coverageLimit && (
                          <p className="text-destructive text-sm mt-1">{form2.formState.errors.coverageLimit.message}</p>
                        )}
                      </div>

                      <div>
                        <Label>Deductible *</Label>
                        <Select onValueChange={(v) => form2.setValue("deductible", v)} defaultValue={form2.getValues("deductible")}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select deductible..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="500">$500</SelectItem>
                            <SelectItem value="1000">$1,000</SelectItem>
                            <SelectItem value="2500">$2,500</SelectItem>
                            <SelectItem value="5000">$5,000</SelectItem>
                          </SelectContent>
                        </Select>
                        {form2.formState.errors.deductible && (
                          <p className="text-destructive text-sm mt-1">{form2.formState.errors.deductible.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="effectiveDate">Desired Effective Date *</Label>
                        <Input
                          id="effectiveDate"
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          {...form2.register("effectiveDate")}
                          className="mt-1"
                        />
                        {form2.formState.errors.effectiveDate && (
                          <p className="text-destructive text-sm mt-1">{form2.formState.errors.effectiveDate.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <Button type="button" variant="outline" onClick={goBack}>← Back</Button>
                      <Button type="submit" disabled={isLoading} className="min-w-32">
                        {isLoading ? "Saving..." : "Next Step →"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              variants={pageVariants}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate="animate"
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Risk Assessment</CardTitle>
                  <CardDescription>Help us understand your risk profile to provide accurate quotes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form3.handleSubmit(onStep3Submit)} className="space-y-6">
                    {[
                      { name: "hasPriorClaims" as const, label: "Has your business had any insurance claims in the past 5 years?", required: true },
                    ].map(({ name, label }) => (
                      <div key={name} className="space-y-2">
                        <Label className="text-sm font-medium">{label} *</Label>
                        <RadioGroup
                          onValueChange={(v) => form3.setValue(name, v as "true" | "false")}
                          defaultValue={form3.getValues(name)}
                          className="flex gap-6"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="true" id={`${name}-yes`} />
                            <Label htmlFor={`${name}-yes`} className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="false" id={`${name}-no`} />
                            <Label htmlFor={`${name}-no`} className="cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                        {form3.formState.errors[name] && (
                          <p className="text-destructive text-sm">{form3.formState.errors[name]?.message}</p>
                        )}
                      </div>
                    ))}

                    {watchedHasPriorClaims === "true" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="priorClaimsDescription">Please describe the prior claims</Label>
                        <Textarea
                          id="priorClaimsDescription"
                          placeholder="Describe the nature of claims, dates, and amounts..."
                          {...form3.register("priorClaimsDescription")}
                          className="min-h-24"
                        />
                      </motion.div>
                    )}

                    {[
                      { name: "hasHazardousMaterials" as const, label: "Does your business work with hazardous materials or chemicals?" },
                      { name: "isHomeBasedBusiness" as const, label: "Is this a home-based business?" },
                      { name: "operatesMultipleLocations" as const, label: "Does your business operate from multiple locations?" },
                    ].map(({ name, label }) => (
                      <div key={name} className="space-y-2">
                        <Label className="text-sm font-medium">{label} *</Label>
                        <RadioGroup
                          onValueChange={(v) => form3.setValue(name, v as "true" | "false")}
                          defaultValue={form3.getValues(name)}
                          className="flex gap-6"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="true" id={`${name}-yes`} />
                            <Label htmlFor={`${name}-yes`} className="cursor-pointer">Yes</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="false" id={`${name}-no`} />
                            <Label htmlFor={`${name}-no`} className="cursor-pointer">No</Label>
                          </div>
                        </RadioGroup>
                        {form3.formState.errors[name] && (
                          <p className="text-destructive text-sm">{form3.formState.errors[name]?.message}</p>
                        )}
                      </div>
                    ))}

                    <div className="flex justify-between pt-4 border-t">
                      <Button type="button" variant="outline" onClick={goBack}>← Back</Button>
                      <Button type="submit" disabled={isLoading} className="min-w-32">
                        {isLoading ? "Saving..." : "Next Step →"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step4"
              variants={pageVariants}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate="animate"
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Contact Information</CardTitle>
                  <CardDescription>Provide your contact details so our agents can reach you with your quote.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form4.handleSubmit(onStep4Submit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="contactFirstName">First Name *</Label>
                        <Input id="contactFirstName" placeholder="Jane" {...form4.register("contactFirstName")} className="mt-1" />
                        {form4.formState.errors.contactFirstName && (
                          <p className="text-destructive text-sm mt-1">{form4.formState.errors.contactFirstName.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="contactLastName">Last Name *</Label>
                        <Input id="contactLastName" placeholder="Smith" {...form4.register("contactLastName")} className="mt-1" />
                        {form4.formState.errors.contactLastName && (
                          <p className="text-destructive text-sm mt-1">{form4.formState.errors.contactLastName.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="contactTitle">Job Title *</Label>
                        <Input id="contactTitle" placeholder="Owner / CEO" {...form4.register("contactTitle")} className="mt-1" />
                        {form4.formState.errors.contactTitle && (
                          <p className="text-destructive text-sm mt-1">{form4.formState.errors.contactTitle.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="contactPhone">Phone Number *</Label>
                        <Input id="contactPhone" type="tel" placeholder="(555) 000-0000" {...form4.register("contactPhone")} className="mt-1" />
                        {form4.formState.errors.contactPhone && (
                          <p className="text-destructive text-sm mt-1">{form4.formState.errors.contactPhone.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="contactEmail">Email Address *</Label>
                        <Input id="contactEmail" type="email" placeholder="jane@acme.com" {...form4.register("contactEmail")} className="mt-1" />
                        {form4.formState.errors.contactEmail && (
                          <p className="text-destructive text-sm mt-1">{form4.formState.errors.contactEmail.message}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                        <Textarea
                          id="additionalNotes"
                          placeholder="Any additional information you'd like us to know..."
                          {...form4.register("additionalNotes")}
                          className="mt-1 min-h-24"
                        />
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 border">
                      <p className="text-sm text-muted-foreground">
                        By submitting this application, you confirm that the information provided is accurate and complete.
                        An insurance agent will contact you within 1-2 business days with your personalized quote.
                      </p>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <Button type="button" variant="outline" onClick={goBack}>← Back</Button>
                      <Button type="submit" disabled={isLoading} className="min-w-40 bg-primary">
                        {isLoading ? "Submitting..." : "Submit Application"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
