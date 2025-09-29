// Structured content for surgical and pediatric cricothyrotomy workflows
// Aligns with the custom detail renderer (title banner, workflow, toggles, media)

export const CricothyrotomyContent = {
  references: {
    "abbott-ems-cricothyrotomy-2025": {
      label: "Abbott EMS Protocols (2025) – Airway & Breathing: Cricothyrotomy",
      href: null,
      type: "primary"
    },
    "statpearls-cricothyroidotomy-2025": {
      label: "Raimonde AJ, Westhoven N, Winters R. Cricothyroidotomy. StatPearls Publishing; 2025.",
      href: "https://www.ncbi.nlm.nih.gov/books/NBK430685/",
      type: "reference"
    },
    "deployed-medicine-143": {
      label: "Defense Health Agency. Surgical Cricothyrotomy (Scalpel-Finger-Bougie). Deployed Medicine.",
      href: "https://deployedmedicine.com/market/143",
      type: "reference"
    }
  },
  equipmentCatalog: {
    scalpel: {
      name: "#20 scalpel",
      image: {
        src: "Assets/Cricothyrotomy/scalpel-photo.jpg",
        alt: "Sterile #20 scalpel resting on blue drape",
        caption: "#20 scalpel loaded for vertical neck incision",
        credit: "Abbott EMS Simulation Studio (2025)",
        sourceNote: "Internal training render"
      }
    },
    backhausClamp: {
      name: "Backhaus towel clamp",
      image: {
        src: "Assets/Cricothyrotomy/backhaus-clamp-photo.jpg",
        alt: "Pair of Backhaus towel clamps on sterile field",
        caption: "Backhaus clamp for traction during blunt dissection",
        credit: "Abbott EMS Simulation Studio (2025)",
        sourceNote: "Internal training render"
      }
    },
    scissors: {
      name: "Metzenbaum scissors",
      image: {
        src: "Assets/Cricothyrotomy/scissors-photo.jpg",
        alt: "Metzenbaum scissors partially open",
        caption: "Metzenbaum scissors used to extend the vertical skin incision",
        credit: "Abbott EMS Simulation Studio (2025)",
        sourceNote: "Internal training render"
      }
    },
    bougie: {
      name: "Airway bougie",
      image: {
        src: "Assets/Cricothyrotomy/bougie-photo.jpg",
        alt: "Pocket bougie airway introducer on drape",
        caption: "Bougie advanced through the tracheal opening",
        credit: "Abbott EMS Simulation Studio (2025)",
        sourceNote: "Internal training render"
      }
    },
    tracheostomyTube: {
      name: "Cuffed tracheostomy / 6.0 ETT",
      image: {
        src: "Assets/Cricothyrotomy/tracheostomy-tube-photo.jpg",
        alt: "Cuffed tracheostomy tube with obturator",
        caption: "6.0 cuffed tracheostomy tube for adult placement",
        credit: "Abbott EMS Simulation Studio (2025)",
        sourceNote: "Internal training render"
      }
    },
    syringe10: {
      name: "10 mL syringe",
      image: {
        src: "Assets/Cricothyrotomy/syringe-photo.jpg",
        alt: "10 mL syringe prepared for cuff inflation",
        caption: "10 mL syringe attached for cuff inflation and jet ventilation",
        credit: "Abbott EMS Simulation Studio (2025)",
        sourceNote: "Internal training render"
      }
    },
    yankauer: {
      name: "Yankauer suction",
      image: {
        src: "Assets/Cricothyrotomy/yankauer-photo.jpg",
        alt: "Yankauer suction tip with tubing",
        caption: "Yankauer suction clears the stoma before tube placement",
        credit: "Abbott EMS Simulation Studio (2025)",
        sourceNote: "Internal training render"
      }
    },
    bvm: {
      name: "Bag-valve mask with EtCO2",
      image: {
        src: "Assets/Cricothyrotomy/bvm-photo.png",
        alt: "Bag-valve mask connected to EtCO2 adapter",
        caption: "BVM provides immediate ventilation after tube placement",
        credit: "Abbott EMS Simulation Studio (2025)",
        sourceNote: "Internal training render"
      }
    },
    tubeSecurement: {
      name: "Tube securement device",
      image: {
        src: "Assets/Cricothyrotomy/tube-securement-photo.jpg",
        alt: "Commercial tube holder securing an airway",
        caption: "Commercial securement keeps the surgical airway stable",
        credit: "Abbott EMS Simulation Studio (2025)",
        sourceNote: "Internal training render"
      }
    }
  },
  variants: [
    {
      id: "adult",
      title: "Surgical Cricothyrotomy (Adult)",
      ageRange: "Adults and adolescents >= 12 years",
      banner: {
        headline: "Cannot intubate, cannot oxygenate pathway",
        summary: [
          "No foreign body obstruction and positive-pressure ventilation fails despite optimized positioning.",
          "Unable to place or maintain a rescue airway device by any method.",
          "Proceed after at least two unsuccessful endotracheal attempts or when intubation is impossible."
        ],
        caution: "Consult OLMC and the receiving facility once the airway is secured; anticipate bleeding and the need for immediate suction.",
        citations: ["abbott-ems-cricothyrotomy-2025"]
      },
      equipment: [
        "scalpel",
        "backhausClamp",
        "scissors",
        "bougie",
        "tracheostomyTube",
        "syringe10",
        "yankauer",
        "bvm",
        "tubeSecurement"
      ],
      toggles: [
        {
          id: "sedation-plan",
          label: "Sedation and analgesia options",
          color: "green",
          options: [
            {
              id: "dissociative",
              label: "Rapid dissociative sequence",
              description: "Ketamine 1-2 mg/kg IV (or 4 mg/kg IM) with opioid adjunct when the patient is combative yet perfusing; maintain BVM support between doses.",
              citations: ["statpearls-cricothyroidotomy-2025"]
            },
            {
              id: "awake-local",
              label: "Awake/local infiltration",
              description: "Infiltrate 3-5 mL of 1% lidocaine with epinephrine along the planned incision for a cooperative patient while continuing high-flow oxygen.",
              citations: ["statpearls-cricothyroidotomy-2025"]
            }
          ]
        },
        {
          id: "post-placement",
          label: "Post-placement ventilation",
          color: "green",
          options: [
            {
              id: "bvm",
              label: "Bag-valve-mask with EtCO2",
              description: "Provide immediate manual ventilation with waveform capnography, auscultation, and chest rise confirmation.",
              citations: ["abbott-ems-cricothyrotomy-2025", "statpearls-cricothyroidotomy-2025"]
            },
            {
              id: "transport-vent",
              label: "Transition to transport ventilator",
              description: "Once stable, connect to a transport ventilator using the cuffed tube adapter and verify pressures and alarms before leaving the scene.",
              citations: ["statpearls-cricothyroidotomy-2025"]
            }
          ]
        }
      ],
      workflow: [
        {
          step: 1,
          title: "Declare CICO and mobilize the airway kit",
          detail: "Announce cannot intubate/cannot oxygenate, maintain BVM with high-flow oxygen, and assign roles for scalpel, suction, and confirmation.",
          equipment: ["bvm"],
          citations: ["abbott-ems-cricothyrotomy-2025", "statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 2,
          title: "Position and continue preoxygenation",
          detail: "Place the patient supine with slight neck extension if no trauma, or maintain inline stabilization while optimizing mask seal.",
          equipment: ["bvm"],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 3,
          title: "Expose and landmark the cricothyroid membrane",
          detail: "Identify the thyroid notch, cricoid cartilage, and membrane using the laryngeal handshake technique.",
          equipment: [],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 4,
          title: "Prep the skin and don sterile gloves",
          detail: "Apply antiseptic prep, place sterile drapes if available, and confirm suction readiness.",
          equipment: [],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 5,
          title: "Stabilize the larynx",
          detail: "Grip the thyroid cartilage with the nondominant hand to prevent movement throughout the procedure.",
          equipment: [],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 6,
          title: "Create a 4 cm vertical skin incision",
          detail: "Use the #20 scalpel to incise skin and subcutaneous tissue from the thyroid notch toward the cricoid.",
          equipment: ["scalpel"],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 7,
          title: "Bluntly dissect down to the membrane",
          detail: "Use clamps or scissors to spread tissue laterally until the membrane is exposed and palpable.",
          equipment: ["backhausClamp", "scissors"],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 8,
          title: "Make a horizontal membrane incision",
          detail: "Incise 1-2 cm across the cricothyroid membrane, aiming slightly caudad to avoid the vocal cords.",
          equipment: ["scalpel"],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 9,
          title: "Dilate with the index finger",
          detail: "Insert the finger to maintain the tract, palpate tracheal rings, and protect the posterior wall.",
          equipment: [],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 10,
          title: "Clear the airway with suction",
          detail: "Use Yankauer suction to remove blood or debris before advancing devices.",
          equipment: ["yankauer"],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 11,
          title: "Advance the bougie into the trachea",
          detail: "Glide the bougie along the finger into the trachea until tracheal rings or hold-up are felt, keeping a shallow angle.",
          equipment: ["bougie"],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 12,
          title: "Railroad and inflate the cuffed tube",
          detail: "Pass a 6.0 cuffed tracheostomy tube or ETT over the bougie, advance until the cuff disappears, withdraw the bougie, and inflate the cuff with 10 mL.",
          equipment: ["tracheostomyTube", "syringe10"],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 13,
          title: "Ventilate, confirm, and secure",
          detail: "Attach the BVM with EtCO2, confirm placement with capnography and bilateral breath sounds, then secure the tube and prepare for transport.",
          equipment: ["bvm", "tubeSecurement"],
          citations: ["abbott-ems-cricothyrotomy-2025", "statpearls-cricothyroidotomy-2025"]
        }
      ],
      media: {
        video: {
          title: "Surgical Cricothyrotomy (Scalpel-Finger-Bougie)",
          src: "Assets/Cricothyrotomy/cricothyrotomy-training.webm",
          caption: "Offline training video demonstrating each step of the scalpel-finger-bougie technique.",
          credit: "Defense Health Agency – Deployed Medicine",
          href: "https://deployedmedicine.com/market/143",
          citations: ["deployed-medicine-143"]
        }
      },
      references: [
        "abbott-ems-cricothyrotomy-2025",
        "statpearls-cricothyroidotomy-2025",
        "deployed-medicine-143"
      ]
    },
    {
      id: "pediatric",
      title: "Pediatric Front-of-Neck Airway Guidance",
      ageRange: "Infants and children < 12 years",
      banner: {
        headline: "Surgical cricothyrotomy is avoided in children under 12",
        summary: [
          "Prefer less invasive airway rescue; needle cricothyrotomy with jet ventilation when unable to ventilate.",
          "Reserve surgical technique for adolescents with adult laryngeal dimensions when OLMC authorizes."
        ],
        caution: "Coordinate with OLMC and the receiving pediatric facility before escalating beyond needle techniques.",
        citations: ["abbott-ems-cricothyrotomy-2025", "statpearls-cricothyroidotomy-2025"]
      },
      equipment: [
        "scalpel",
        "bougie",
        "tracheostomyTube",
        "syringe10",
        "yankauer",
        "bvm"
      ],
      toggles: [
        {
          id: "front-of-neck-choice",
          label: "Front-of-neck access selection",
          color: "green",
          options: [
            {
              id: "needle",
              label: "Needle cricothyrotomy with jet ventilation",
              description: "Insert a 14-16 gauge catheter at a 45 degree caudal angle, confirm free air, and ventilate using 1 second insufflation with 4 seconds passive exhalation.",
              citations: ["statpearls-cricothyroidotomy-2025"]
            },
            {
              id: "surgical-adolescent",
              label: "Surgical option for adolescent (>12 yr)",
              description: "If landmarks are adult-sized and OLMC approves, perform a limited scalpel-finger-bougie technique using a 5.0 cuffed tube and smaller incision.",
              citations: ["abbott-ems-cricothyrotomy-2025", "statpearls-cricothyroidotomy-2025"]
            }
          ]
        },
        {
          id: "peds-sedation",
          label: "Sedation considerations",
          color: "green",
          options: [
            {
              id: "minimal",
              label: "Minimal sedation with ketamine",
              description: "For agitated adolescents, ketamine 1 mg/kg IV preserves airway reflexes while preparations continue.",
              citations: ["statpearls-cricothyroidotomy-2025"]
            },
            {
              id: "avoid-sedation",
              label: "Avoid sedation in tenuous ventilation",
              description: "If oxygenation is failing, defer sedatives until oxygen delivery is re-established to prevent apnea.",
              citations: ["statpearls-cricothyroidotomy-2025"]
            }
          ]
        }
      ],
      workflow: [
        {
          step: 1,
          title: "Identify failure to ventilate",
          detail: "Recognize persistent hypoxia despite BVM and airway adjuncts in a pediatric patient.",
          equipment: ["bvm"],
          citations: ["abbott-ems-cricothyrotomy-2025"]
        },
        {
          step: 2,
          title: "Assess age and anatomy",
          detail: "If under 12 years or landmarks are difficult, plan for needle cricothyrotomy and notify OLMC immediately.",
          equipment: [],
          citations: ["abbott-ems-cricothyrotomy-2025", "statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 3,
          title: "Maintain oxygenation",
          detail: "Continue high-flow BVM ventilation with two-rescuer technique while equipment is prepared.",
          equipment: ["bvm"],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 4,
          title: "Assemble front-of-neck access kit",
          detail: "Prepare 14-16 gauge catheter, syringe, oxygen tubing, jet valve, and suction; keep surgical kit nearby for adolescents.",
          equipment: ["syringe10", "yankauer"],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 5,
          title: "Position with inline stabilization",
          detail: "Place a shoulder roll if tolerated; in trauma maintain neutral alignment and expose the neck.",
          equipment: [],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 6,
          title: "Palpate and mark the membrane",
          detail: "Use gentle palpation to locate the cricothyroid space between the thyroid and cricoid cartilages.",
          equipment: [],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 7,
          title: "Prep and stabilize",
          detail: "Apply antiseptic, stabilize the larynx with the nondominant hand, and ready suction.",
          equipment: ["yankauer"],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 8,
          title: "Perform needle entry",
          detail: "Insert the catheter at 45 degrees caudad while aspirating; confirm free air before advancing the catheter fully.",
          equipment: ["syringe10"],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 9,
          title: "Attach oxygen delivery",
          detail: "Remove the needle, secure the catheter, and connect to a jet ventilator or improvised device for insufflation.",
          equipment: ["syringe10"],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 10,
          title: "Cycle insufflation",
          detail: "Deliver 1 second of oxygen followed by 4 seconds passive exhalation while monitoring chest rise and EtCO2.",
          equipment: ["bvm"],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 11,
          title: "Adolescent surgical option if approved",
          detail: "For older adolescents with adult landmarks, create a 2 cm vertical incision, follow the scalpel-finger-bougie technique, and place a 5.0 cuffed tube.",
          equipment: ["scalpel", "bougie", "tracheostomyTube", "syringe10"],
          citations: ["abbott-ems-cricothyrotomy-2025", "statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 12,
          title: "Secure and prepare for definitive airway",
          detail: "Stabilize the catheter or tube, suction as needed, and plan rapid transfer for surgical airway conversion.",
          equipment: ["yankauer"],
          citations: ["statpearls-cricothyroidotomy-2025"]
        },
        {
          step: 13,
          title: "Monitor and document",
          detail: "Observe for barotrauma, reassess vital signs, document times and volumes, and keep OLMC updated during transport.",
          equipment: [],
          citations: ["abbott-ems-cricothyrotomy-2025", "statpearls-cricothyroidotomy-2025"]
        }
      ],
      media: {
        video: {
          title: "Pediatric airway escalation overview",
          src: "Assets/Cricothyrotomy/cricothyrotomy-training.webm",
          caption: "Reference video for front-of-neck access decision-making (review technique segments only with OLMC approval).",
          credit: "Defense Health Agency – Deployed Medicine",
          href: "https://deployedmedicine.com/market/143",
          citations: ["deployed-medicine-143"]
        }
      },
      references: [
        "abbott-ems-cricothyrotomy-2025",
        "statpearls-cricothyroidotomy-2025",
        "deployed-medicine-143"
      ]
    }
  ]
};
