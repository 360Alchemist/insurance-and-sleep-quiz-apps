package com.insuranceform.dto;

import jakarta.validation.constraints.*;

public class Step4Dto {

    @NotBlank(message = "Contact name is required")
    private String contactName;

    @NotBlank(message = "Email is required")
    @Email(message = "Enter a valid email address")
    private String contactEmail;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[\\d\\s\\-\\+\\(\\)]{7,20}$", message = "Enter a valid phone number")
    private String contactPhone;

    @NotBlank(message = "Job title is required")
    private String contactTitle;

    private String additionalNotes;

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
}
