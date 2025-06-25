// Data/ParamedicCategoriesData.js
const ParamedicCategoriesData = [  {
    id: 'adult-protocols',
    title: 'Adult Protocols',
    type: 'category',
    children: [
      { id: 'mi-acs', title: 'Myocardial Infarction/ACS', type: 'topic' },
      { id: 'stroke', title: 'Stroke', type: 'topic' },
      // ... other adult protocol topics
    ]
  },
  {
    id: 'pediatric-protocols',
    title: 'Pediatric Protocols',
    type: 'category',
    children: [
      { id: 'pediatric-assessment-vs', title: 'Pediatric Assessment/Vitals', type: 'topic' },
      // ... other pediatric topics
    ]
  },
  // ... additional categories and topics as needed

];
if (typeof module !== 'undefined') module.exports = ParamedicCategoriesData;
if (typeof window !== 'undefined') window.ParamedicCategoriesData = ParamedicCategoriesData;
