/**
 * Contains detailed information for each topic/slug in the Paramedic Quick Reference app.
 * Exports an object mapping each topic's slug to an object of details (indications, contraindications, doses, etc.).
 * This data is loaded when the app initializes to display comprehensive treatment info for each condition or medication.
 * Future updates will include computed fields (e.g., weight-based dosages) that react to patient info inputs.
 */
        // --- Initialization ---
        function initializeData(categoriesData, medDetails) {
            paramedicCategories = categoriesData;
            allSearchableTopics = []; 
            allDisplayableTopicsMap = {};

            // Predefined suggestion lists (can be expanded)
            const commonPmh = ["hypertension", "htn", "diabetes", "dm", "asthma", "copd", "heart failure", "hf", "cad", "coronary artery disease", "stroke", "cva", "seizure disorder", "renal insufficiency", "ckd", "hypothyroidism", "hyperthyroidism", "glaucoma", "peptic ulcer disease", "gerd", "schizophrenia", "anxiety", "depression"];
            const commonAllergies = ["penicillin", "sulfa", "aspirin", "nsaids", "morphine", "codeine", "iodine", "shellfish", "latex", "peanuts", "tree nuts"];
            const commonMedNames = ["lisinopril", "metformin", "atorvastatin", "amlodipine", "hydrochlorothiazide", "hctz", "simvastatin", "albuterol", "levothyroxine", "gabapentin", "omeprazole", "losartan", "sertraline", "furosemide", "lasix", "insulin", "warfarin", "coumadin", "aspirin", "clopidogrel", "plavix"];

            commonPmh.forEach(term => pmhSuggestions.add(term));
            commonAllergies.forEach(term => allergySuggestions.add(term));
            commonMedNames.forEach(term => medicationNameSuggestions.add(term));
            PDE5_INHIBITORS.forEach(term => medicationNameSuggestions.add(term));


            // Extract terms from medication contraindications
            Object.values(medDetails).forEach(med => {
                if (med.contraindications) {
                    med.contraindications.forEach(ci => {
                        const ciLower = ci.toLowerCase();
                        // Simple keyword extraction for PMH/Allergies/Meds
                        // This is basic and can be improved with more sophisticated NLP or tagging
                        if (ciLower.includes("hypersensitivity") || ciLower.includes("allergy to")) {
                            // Attempt to extract the substance of allergy
                            let allergen = ciLower.replace("known hypersensitivity to", "").replace("allergy to any nsaid (including asa)", "nsaid allergy").replace("allergy to", "").trim();
                            if (allergen.includes("local anesthetic allergy in the amide class")) allergen = "amide anesthetic allergy";
                            else if (allergen.includes("nsaid (including asa)")) allergen = "nsaid allergy";
                            else allergen = allergen.split('(')[0].trim(); // Remove details in parentheses
                            if (allergen && allergen.length > 2 && allergen.length < 30) allergySuggestions.add(allergen);
                        } else if (ciLower.includes("sbp <") || ciLower.includes("hr <")) {
                            pmhSuggestions.add("hypotension");
                            if(ciLower.includes("hr <")) pmhSuggestions.add("bradycardia");
                        } else if (ciLower.includes("glaucoma")) pmhSuggestions.add("glaucoma");
                        else if (ciLower.includes("renal insufficiency")) pmhSuggestions.add("renal insufficiency");
                        else if (ciLower.includes("peptic ulcer") || ciLower.includes("gi bleeding")) pmhSuggestions.add("peptic ulcer disease/gi bleed");
                        else if (ciLower.includes("asthma")) pmhSuggestions.add("asthma");
                        else if (ciLower.includes("heart failure")) pmhSuggestions.add("heart failure");
                        else if (ciLower.includes("cardiac ischemia") || ciLower.includes("infarction") || ciLower.includes("cad")) pmhSuggestions.add("cardiac ischemia/cad");
                        else if (ciLower.includes("schizophrenia")) pmhSuggestions.add("schizophrenia");
                        else if (ciLower.includes("digitalis toxicity")) medicationNameSuggestions.add("digitalis");
                        else if (ciLower.includes("phosphodiesterase")) {
                            pmhSuggestions.add("PDE5 inhibitor use"); // As a condition/history
                            PDE5_INHIBITORS.forEach(pde => medicationNameSuggestions.add(pde));
                        }
                        // Add more specific term extractions here
                    });
                }
            });


            function processItem(item, parentPath = '', parentIds = []) {
        const currentPath = parentPath ? `${parentPath} > ${item.title}` : item.title;
        const currentIds = item.type === 'category' ? [...parentIds, item.id] : parentIds;

        // This is the key change. We now use medDetails (passed in from the function argument)
        // instead of the old medicationDetailsData global variable.
        const detailsToAttach = medDetails[item.id];

        let fullItemDetails = {
            ...item,
            path: currentPath,
            details: detailsToAttach || null, // Attach details if they exist
            categoryPath: parentIds
        };

        allDisplayableTopicsMap[item.id] = fullItemDetails;

        if (item.type === 'topic') {
            allSearchableTopics.push({ id: item.id, title: item.title, path: currentPath, categoryPath: parentIds });
        }

        if (item.children) {
            item.children.forEach(child => processItem(child, currentPath, currentIds));
        }
    }

    paramedicCategories.forEach(category => processItem(category, '', []));
}