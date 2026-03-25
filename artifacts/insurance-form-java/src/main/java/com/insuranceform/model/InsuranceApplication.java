package com.insuranceform.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "java_insurance_applications")
public class InsuranceApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "business_name")
    private String businessName;

    @Column(name = "business_type")
    private String businessType;

    @Column(name = "industry")
    private String industry;

    @Column(name = "annual_revenue")
    private String annualRevenue;

    @Column(name = "number_of_employees")
    private Integer numberOfEmployees;

    @Column(name = "street_address")
    private String streetAddress;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "zip_code")
    private String zipCode;

    @Column(name = "coverage_types", length = 1000)
    private String coverageTypes;

    @Column(name = "coverage_limit")
    private String coverageLimit;

    @Column(name = "deductible")
    private String deductible;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    @Column(name = "has_prior_claims")
    private Boolean hasPriorClaims;

    @Column(name = "prior_claims_description", length = 2000)
    private String priorClaimsDescription;

    @Column(name = "has_hazardous_materials")
    private Boolean hasHazardousMaterials;

    @Column(name = "is_home_based_business")
    private Boolean isHomeBasedBusiness;

    @Column(name = "operates_multiple_locations")
    private Boolean operatesMultipleLocations;

    @Column(name = "has_high_value_equipment")
    private Boolean hasHighValueEquipment;

    @Column(name = "contact_name")
    private String contactName;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "contact_title")
    private String contactTitle;

    @Column(name = "additional_notes", length = 2000)
    private String additionalNotes;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = "DRAFT";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }
    public String getBusinessType() { return businessType; }
    public void setBusinessType(String businessType) { this.businessType = businessType; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public String getAnnualRevenue() { return annualRevenue; }
    public void setAnnualRevenue(String annualRevenue) { this.annualRevenue = annualRevenue; }
    public Integer getNumberOfEmployees() { return numberOfEmployees; }
    public void setNumberOfEmployees(Integer numberOfEmployees) { this.numberOfEmployees = numberOfEmployees; }
    public String getStreetAddress() { return streetAddress; }
    public void setStreetAddress(String streetAddress) { this.streetAddress = streetAddress; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    public String getCoverageTypes() { return coverageTypes; }
    public void setCoverageTypes(String coverageTypes) { this.coverageTypes = coverageTypes; }
    public String getCoverageLimit() { return coverageLimit; }
    public void setCoverageLimit(String coverageLimit) { this.coverageLimit = coverageLimit; }
    public String getDeductible() { return deductible; }
    public void setDeductible(String deductible) { this.deductible = deductible; }
    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }
    public Boolean getHasPriorClaims() { return hasPriorClaims; }
    public void setHasPriorClaims(Boolean hasPriorClaims) { this.hasPriorClaims = hasPriorClaims; }
    public String getPriorClaimsDescription() { return priorClaimsDescription; }
    public void setPriorClaimsDescription(String priorClaimsDescription) { this.priorClaimsDescription = priorClaimsDescription; }
    public Boolean getHasHazardousMaterials() { return hasHazardousMaterials; }
    public void setHasHazardousMaterials(Boolean hasHazardousMaterials) { this.hasHazardousMaterials = hasHazardousMaterials; }
    public Boolean getIsHomeBasedBusiness() { return isHomeBasedBusiness; }
    public void setIsHomeBasedBusiness(Boolean isHomeBasedBusiness) { this.isHomeBasedBusiness = isHomeBasedBusiness; }
    public Boolean getOperatesMultipleLocations() { return operatesMultipleLocations; }
    public void setOperatesMultipleLocations(Boolean operatesMultipleLocations) { this.operatesMultipleLocations = operatesMultipleLocations; }
    public Boolean getHasHighValueEquipment() { return hasHighValueEquipment; }
    public void setHasHighValueEquipment(Boolean hasHighValueEquipment) { this.hasHighValueEquipment = hasHighValueEquipment; }
    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getContactTitle() { return contactTitle; }
    public void setContactTitle(String contactTitle) { this.contactTitle = contactTitle; }
    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
