function initializeData(categoriesData, medDetails) {
    // Ensure the data passed is valid, otherwise use empty arrays/objects.
    paramedicCategories = categoriesData || [];
    // Allow medDetails to be provided as an array or an object
    // If an array is given (the format used by MedicationDetailsData.js),
    // convert it to an id -> object map for easier lookup.
    const medicationData = Array.isArray(medDetails)
        ? Object.fromEntries(medDetails.map(m => [m.id, m]))
        : (medDetails || {});

    allSearchableTopics = [];
    allDisplayableTopicsMap = {};

    // --- Predefined suggestion lists ---
    const commonPmh = ["hypertension", "htn", "diabetes", "dm", "asthma", "copd", "heart failure", "hf", "cad", "coronary artery disease", "stroke", "cva", "seizure disorder", "renal insufficiency", "ckd", "hypothyroidism", "hyperthyroidism", "glaucoma", "peptic ulcer disease", "gerd", "schizophrenia", "anxiety", "depression"];
    const commonAllergies = ["penicillin", "sulfa", "aspirin", "nsaids", "morphine", "codeine", "iodine", "shellfish", "latex", "peanuts", "tree nuts"];
    const commonMedNames = ["lisinopril", "metformin", "atorvastatin", "amlodipine", "hydrochlorothiazide", "hctz", "simvastatin", "albuterol", "levothyroxine", "gabapentin", "omeprazole", "losartan", "sertraline", "furosemide", "lasix", "insulin", "warfarin", "coumadin", "aspirin", "clopidogrel", "plavix"];

    commonPmh.forEach(term => pmhSuggestions.add(term));
    commonAllergies.forEach(term => allergySuggestions.add(term));
    commonMedNames.forEach(term => medicationNameSuggestions.add(term));
    PDE5_INHIBITORS.forEach(term => medicationNameSuggestions.add(term));


    // --- Extract terms from medication contraindications ---
    Object.values(medicationData).forEach(med => {
        if (med.contraindications && Array.isArray(med.contraindications)) {
            med.contraindications.forEach(ci => {
                const ciLower = ci.toLowerCase();
                // (Your existing logic for suggestions)
                if (ciLower.includes("hypersensitivity") || ciLower.includes("allergy to")) {
                    let allergen = ciLower.replace("known hypersensitivity to", "").replace("allergy to any nsaid (including asa)", "nsaid allergy").replace("allergy to", "").trim();
                    if (allergen.includes("local anesthetic allergy in the amide class")) allergen = "amide anesthetic allergy";
                    else if (allergen.includes("nsaid (including asa)")) allergen = "nsaid allergy";
                    else allergen = allergen.split('(')[0].trim();
                    if (allergen && allergen.length > 2 && allergen.length < 30) allergySuggestions.add(allergen);
                }
            });
        }
    });

    // --- Recursive function to process all items and attach details ---
    function processItem(item, parentPath = '', parentIds = []) {
        const currentPath = parentPath ? `${parentPath} > ${item.title}` : item.title;
        const currentIds = item.type === 'category' ? [...parentIds, item.id] : parentIds;

        // Attach the details from our medication data object
        const detailsToAttach = medicationData[item.id];

        let fullItemDetails = {
            ...item,
            path: currentPath,
            details: detailsToAttach || null, // Attach details if they exist for this ID
            categoryPath: parentIds
        };

        allDisplayableTopicsMap[item.id] = fullItemDetails;

        if (item.type === 'topic') {
            allSearchableTopics.push({ id: item.id, title: item.title, path: currentPath, categoryPath: parentIds });
        }

        if (item.children) {
            item.children.forEach(child => processItem(child, currentPath, currentIds));
        }
    };
    paramedicCategories.forEach(category => processItem(category, '', []));}