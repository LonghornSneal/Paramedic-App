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



          preload: 'auto',



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



      sections: [



        {



          id: "pediatric-surgical",



          displayTitle: "Surgical Cric. for >12yrs old",



          ageRange: "Adolescents >= 12 years",



          banner: {



            headline: "If adolescent anatomy supports the procedure, proceed only after OLMC approval",



            summary: [



              "Confirm CICO status with optimized BVM and adjuncts before escalating to a surgical airway.",



              "Team leader assigns scalpel, suction, and confirmation roles with trauma-style packaging.",



              "Use 5.0-6.0 cuffed tube and minimize incision size to protect developing laryngeal structures."



            ],



            caution: "Maintain inline stabilization when trauma is suspected and discontinue immediately if landmarks are obscured.",



            citations: ["abbott-ems-cricothyrotomy-2025", "statpearls-cricothyroidotomy-2025"]



          },



          equipment: [



            "scalpel",



            "bougie",



            "tracheostomyTube",



            "syringe10",



            "yankauer",



            "tubeSecurement"



          ],



          toggles: [



            {



              id: "adolescent-prep",



              label: "Preparation priorities",



              color: "green",



              options: [



                {



                  id: "announce-cico",



                  label: "Announce CICO and assign roles",



                  description: "State the failure to intubate/oxygenate, task a scalpel operator, suction lead, and confirmation medic, and keep BVM support running.",



                  citations: ["abbott-ems-cricothyrotomy-2025"]



                },



                {



                  id: "optimize-preoxygenation",



                  label: "Maintain preoxygenation",



                  description: "Use two-provider BVM with PEEP and EtCO2 while landmarks are identified and the kit is assembled.",



                  citations: ["statpearls-cricothyroidotomy-2025"]



                }



              ]



            },



            {



              id: "adolescent-sedation",



              label: "Sedation considerations (>12 yr)",



              color: "green",



              options: [



                {



                  id: "ketamine-sequence",



                  label: "Ketamine dissociation",



                  description: "Ketamine 1 mg/kg IV (or 4 mg/kg IM) preserves airway reflexes while providing anxiolysis during instrumentation.",



                  citations: ["statpearls-cricothyroidotomy-2025"]



                },



                {



                  id: "local-anesthetic",



                  label: "Local infiltration",



                  description: "Infiltrate 3-5 mL of 1% lidocaine with epinephrine along the planned incision if the adolescent is cooperative and time allows.",



                  citations: ["statpearls-cricothyroidotomy-2025"]



                }



              ]



            }



          ],



          workflow: [



            {



              step: 1,



              title: "Confirm CICO in adolescent",



              detail: "Verify persistent hypoxia or ineffective ventilation after optimized BVM and supraglottic options; notify OLMC.",



              equipment: ["bvm"],



              citations: ["abbott-ems-cricothyrotomy-2025"]



            },



            {



              step: 2,



              title: "Evaluate anatomy and position",



              detail: "Slightly extend the neck if no trauma or maintain inline stabilization, exposing landmarks with a shoulder roll as tolerated.",



              equipment: [],



              citations: ["statpearls-cricothyroidotomy-2025"]



            },



            {



              step: 3,



              title: "Landmark using laryngeal handshake",



              detail: "Palpate thyroid notch, cricoid cartilage, and cricothyroid membrane before prepping the site.",



              equipment: [],



              citations: ["statpearls-cricothyroidotomy-2025"]



            },



            {



              step: 4,



              title: "Stabilize and incise vertically",



              detail: "Stabilize the larynx and create a 3-4 cm vertical skin incision centered on the membrane; bluntly dissect to expose it.",



              equipment: ["scalpel", "yankauer"],



              citations: ["statpearls-cricothyroidotomy-2025"]



            },



            {



              step: 5,



              title: "Open membrane and clear view",



              detail: "Make a horizontal stab into the membrane, rotate the blade caudally, and suction blood before advancing devices.",



              equipment: ["scalpel", "yankauer"],



              citations: ["statpearls-cricothyroidotomy-2025"]



            },



            {



              step: 6,



              title: "Insert bougie under tactile control",



              detail: "Keep a finger in the tract while advancing the bougie until tracheal rings or hold-up are sensed.",



              equipment: ["bougie"],



              citations: ["statpearls-cricothyroidotomy-2025"]



            },



            {



              step: 7,



              title: "Railroad a cuffed tube",



              detail: "Advance a 5.0-6.0 cuffed tracheostomy tube over the bougie, withdraw the bougie, and inflate the cuff with 5-10 mL.",



              equipment: ["tracheostomyTube", "syringe10"],



              citations: ["statpearls-cricothyroidotomy-2025"]



            },



            {



              step: 8,



              title: "Ventilate and secure",



              detail: "Attach EtCO2 monitoring, confirm chest rise and breath sounds, then secure with commercial holder or tape.",



              equipment: ["tubeSecurement"],



              citations: ["abbott-ems-cricothyrotomy-2025", "statpearls-cricothyroidotomy-2025"]



            }



          ],



          media: {



            video: {



              title: "Surgical Cricothyrotomy (Adolescent demonstration)",



              placeholder: true,



              note: "Need Video Still!!!"



            }



          },



          references: [



            "abbott-ems-cricothyrotomy-2025",



            "statpearls-cricothyroidotomy-2025"



          ]



        },







      ],



      references: [



        "abbott-ems-cricothyrotomy-2025",



        "statpearls-cricothyroidotomy-2025"



      ]



    }



  ]



};



