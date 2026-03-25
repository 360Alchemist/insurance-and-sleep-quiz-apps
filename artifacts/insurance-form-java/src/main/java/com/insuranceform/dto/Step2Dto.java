package com.insuranceform.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.List;

public class Step2Dto {

    @NotEmpty(message = "Select at least one coverage type")
    private List<String> coverageTypes;

    @NotBlank(message = "Coverage limit is required")
    private String coverageLimit;

    @NotBlank(message = "Deductible is required")
    private String deductible;

    @NotNull(message = "Effective date is required")
    @FutureOrPresent(message = "Effective date must be today or in the future")
    private LocalDate effectiveDate;

    public List<String> getCoverageTypes() { return coverageTypes; }
    public void setCoverageTypes(List<String> coverageTypes) { this.coverageTypes = coverageTypes; }
    public String getCoverageLimit() { return coverageLimit; }
    public void setCoverageLimit(String coverageLimit) { this.coverageLimit = coverageLimit; }
    public String getDeductible() { return deductible; }
    public void setDeductible(String deductible) { this.deductible = deductible; }
    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }
}
