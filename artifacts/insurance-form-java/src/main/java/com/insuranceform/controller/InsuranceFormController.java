package com.insuranceform.controller;

import com.insuranceform.dto.*;
import com.insuranceform.model.InsuranceApplication;
import com.insuranceform.repository.InsuranceApplicationRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
public class InsuranceFormController {

    @Autowired
    private InsuranceApplicationRepository repository;

    // ─── Step 1: Business Information ───────────────────────────────────────

    @GetMapping("/")
    public String step1Get(HttpSession session, Model model) {
        Step1Dto dto = (Step1Dto) session.getAttribute("step1");
        if (dto == null) dto = new Step1Dto();
        model.addAttribute("step1", dto);
        model.addAttribute("currentStep", 1);
        return "step1";
    }

    @PostMapping("/step1")
    public String step1Post(@Valid @ModelAttribute("step1") Step1Dto dto,
                            BindingResult result, HttpSession session, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("currentStep", 1);
            return "step1";
        }
        if ("Other".equals(dto.getIndustry()) && (dto.getIndustryOther() == null || dto.getIndustryOther().isBlank())) {
            result.rejectValue("industryOther", "required", "Please describe your industry");
            model.addAttribute("currentStep", 1);
            return "step1";
        }
        session.setAttribute("step1", dto);
        return "redirect:/step2";
    }

    // ─── Step 2: Coverage Needs ──────────────────────────────────────────────

    @GetMapping("/step2")
    public String step2Get(HttpSession session, Model model) {
        if (session.getAttribute("step1") == null) return "redirect:/";
        Step2Dto dto = (Step2Dto) session.getAttribute("step2");
        if (dto == null) dto = new Step2Dto();
        model.addAttribute("step2", dto);
        model.addAttribute("currentStep", 2);
        return "step2";
    }

    @PostMapping("/step2")
    public String step2Post(@Valid @ModelAttribute("step2") Step2Dto dto,
                            BindingResult result, HttpSession session, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("currentStep", 2);
            return "step2";
        }
        session.setAttribute("step2", dto);
        return "redirect:/step3";
    }

    // ─── Step 3: Risk Assessment ─────────────────────────────────────────────

    @GetMapping("/step3")
    public String step3Get(HttpSession session, Model model) {
        if (session.getAttribute("step2") == null) return "redirect:/step2";
        Step3Dto dto = (Step3Dto) session.getAttribute("step3");
        if (dto == null) dto = new Step3Dto();
        model.addAttribute("step3", dto);
        model.addAttribute("currentStep", 3);
        return "step3";
    }

    @PostMapping("/step3")
    public String step3Post(@Valid @ModelAttribute("step3") Step3Dto dto,
                            BindingResult result, HttpSession session, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("currentStep", 3);
            return "step3";
        }
        session.setAttribute("step3", dto);
        return "redirect:/step4";
    }

    // ─── Step 4: Contact Information ─────────────────────────────────────────

    @GetMapping("/step4")
    public String step4Get(HttpSession session, Model model) {
        if (session.getAttribute("step3") == null) return "redirect:/step3";
        Step4Dto dto = (Step4Dto) session.getAttribute("step4");
        if (dto == null) dto = new Step4Dto();
        model.addAttribute("step4", dto);
        model.addAttribute("currentStep", 4);
        return "step4";
    }

    @PostMapping("/step4")
    public String step4Post(@Valid @ModelAttribute("step4") Step4Dto dto,
                            BindingResult result, HttpSession session, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("currentStep", 4);
            return "step4";
        }

        Step1Dto step1 = (Step1Dto) session.getAttribute("step1");
        Step2Dto step2 = (Step2Dto) session.getAttribute("step2");
        Step3Dto step3 = (Step3Dto) session.getAttribute("step3");

        InsuranceApplication app = new InsuranceApplication();

        // Step 1 data
        app.setBusinessName(step1.getBusinessName());
        app.setBusinessType(step1.getBusinessType());
        String industry = "Other".equals(step1.getIndustry()) && step1.getIndustryOther() != null
                ? "Other: " + step1.getIndustryOther()
                : step1.getIndustry();
        app.setIndustry(industry);
        app.setAnnualRevenue(step1.getAnnualRevenue());
        app.setNumberOfEmployees(step1.getNumberOfEmployees());
        app.setStreetAddress(step1.getStreetAddress());
        app.setCity(step1.getCity());
        app.setState(step1.getState());
        app.setZipCode(step1.getZipCode());

        // Step 2 data
        app.setCoverageTypes(String.join(", ", step2.getCoverageTypes()));
        app.setCoverageLimit(step2.getCoverageLimit());
        app.setDeductible(step2.getDeductible());
        app.setEffectiveDate(step2.getEffectiveDate());

        // Step 3 data
        app.setHasPriorClaims(step3.getHasPriorClaims());
        app.setPriorClaimsDescription(step3.getPriorClaimsDescription());
        app.setHasHazardousMaterials(step3.getHasHazardousMaterials());
        app.setIsHomeBasedBusiness(step3.getIsHomeBasedBusiness());
        app.setOperatesMultipleLocations(step3.getOperatesMultipleLocations());
        app.setHasHighValueEquipment(step3.getHasHighValueEquipment());

        // Step 4 data
        app.setContactName(dto.getContactName());
        app.setContactEmail(dto.getContactEmail());
        app.setContactPhone(dto.getContactPhone());
        app.setContactTitle(dto.getContactTitle());
        app.setAdditionalNotes(dto.getAdditionalNotes());
        app.setStatus("SUBMITTED");

        InsuranceApplication saved = repository.save(app);

        session.removeAttribute("step1");
        session.removeAttribute("step2");
        session.removeAttribute("step3");
        session.removeAttribute("step4");

        return "redirect:/confirmation/" + saved.getId();
    }

    // ─── Confirmation ─────────────────────────────────────────────────────────

    @GetMapping("/confirmation/{id}")
    public String confirmation(@PathVariable Long id, Model model) {
        Optional<InsuranceApplication> app = repository.findById(id);
        if (app.isEmpty()) return "redirect:/";
        model.addAttribute("submission", app.get());
        return "confirmation";
    }

    // ─── Back navigation ──────────────────────────────────────────────────────

    @GetMapping("/back/step2")
    public String backToStep1() { return "redirect:/"; }

    @GetMapping("/back/step3")
    public String backToStep2() { return "redirect:/step2"; }

    @GetMapping("/back/step4")
    public String backToStep3() { return "redirect:/step3"; }
}
