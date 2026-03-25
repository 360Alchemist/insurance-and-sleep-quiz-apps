import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { CheckCircle, Building2, Shield, Calendar, User, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const COVERAGE_LABELS: Record<string, string> = {
  general_liability: "General Liability",
  commercial_property: "Commercial Property",
  workers_compensation: "Workers' Compensation",
  professional_liability: "Professional Liability (E&O)",
  commercial_auto: "Commercial Auto",
  cyber_liability: "Cyber Liability",
  umbrella: "Umbrella / Excess Liability",
};

interface Application {
  id: number;
  businessName: string;
  businessType: string;
  industry: string;
  city: string;
  state: string;
  coverageTypes: string[];
  coverageLimit: string | null;
  deductible: string | null;
  effectiveDate: string | null;
  contactFirstName: string | null;
  contactLastName: string | null;
  contactEmail: string | null;
  status: string;
}

export default function Confirmation() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/applications/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setApplication(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">Loading confirmation...</div>
      </div>
    );
  }

  const formatCurrency = (val: string | null) => {
    if (!val) return "—";
    return `$${Number(val).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-6 px-4 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Commercial Insurance Application</h1>
            <p className="text-sm text-primary-foreground/70">Application submitted successfully</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground text-lg">
              Thank you. Your application <span className="font-semibold text-foreground">#{params.id}</span> has been received.
            </p>
            <p className="text-muted-foreground mt-1">
              An insurance specialist will contact you within <strong>1–2 business days</strong> with your personalized quote.
            </p>
          </div>

          {application && (
            <div className="space-y-4">
              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">Business Summary</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Business Name</p>
                      <p className="font-medium">{application.businessName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Industry</p>
                      <p className="font-medium">{application.industry}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">{application.city}, {application.state}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Business Type</p>
                      <p className="font-medium capitalize">{application.businessType.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">Coverage Selected</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(application.coverageTypes || []).map((ct) => (
                      <span key={ct} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {COVERAGE_LABELS[ct] || ct}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Coverage Limit</p>
                      <p className="font-medium">{formatCurrency(application.coverageLimit)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Deductible</p>
                      <p className="font-medium">{formatCurrency(application.deductible)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {application.effectiveDate && (
                <Card className="shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg">Requested Effective Date</h3>
                    </div>
                    <p className="text-sm font-medium">
                      {new Date(application.effectiveDate + "T00:00:00").toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric"
                      })}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">Contact Information</h3>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{application.contactFirstName} {application.contactLastName}</p>
                    <p className="text-muted-foreground">{application.contactEmail}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="gap-2"
            >
              Start New Application <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
