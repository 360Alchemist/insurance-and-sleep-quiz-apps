package com.insuranceform.dto;

import jakarta.validation.constraints.*;

public class Step1Dto {

    @NotBlank(message = "Business name is required")
    private String businessName;

    @NotBlank(message = "Business type is required")
    private String businessType;

    @NotBlank(message = "Industry is required")
    private String industry;

    private String industryOther;

    @NotBlank(message = "Annual revenue is required")
    private String annualRevenue;

    @NotNull(message = "Number of employees is required")
    @Min(value = 1, message = "Must have at least 1 employee")
    private Integer numberOfEmployees;

    @NotBlank(message = "Street address is required")
    private String streetAddress;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "ZIP code is required")
    @Pattern(regexp = "\\d{5}(-\\d{4})?", message = "Enter a valid ZIP code")
    private String zipCode;

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }
    public String getBusinessType() { return businessType; }
    public void setBusinessType(String businessType) { this.businessType = businessType; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public String getIndustryOther() { return industryOther; }
    public void setIndustryOther(String industryOther) { this.industryOther = industryOther; }
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
}
