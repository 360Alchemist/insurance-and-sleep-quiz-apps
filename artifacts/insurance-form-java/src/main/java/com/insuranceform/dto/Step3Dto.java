package com.insuranceform.dto;

import jakarta.validation.constraints.*;

public class Step3Dto {

    @NotNull(message = "Please answer this question")
    private Boolean hasPriorClaims;

    private String priorClaimsDescription;

    @NotNull(message = "Please answer this question")
    private Boolean hasHazardousMaterials;

    @NotNull(message = "Please answer this question")
    private Boolean isHomeBasedBusiness;

    @NotNull(message = "Please answer this question")
    private Boolean operatesMultipleLocations;

    @NotNull(message = "Please answer this question")
    private Boolean hasHighValueEquipment;

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
}
