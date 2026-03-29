export const TieredDetailConfig = {
  'adult-seizure': {
    prefaceTier: 4,
    prefaceTitleLine: 'BGL  >100',
    sectionHeaders: [
      { line: 'Intervention', tier: 1 },
      { line: 'Consultation', tier: 2 }
    ]
  },
  'adult-sepsis': {
    prefaceTier: 4,
    prefaceTitleLine: 'Recognized by at least 2 of the following 3 acute criteria',
    sectionHeaders: [
      { line: 'Intervention', tier: 1 },
      { line: 'Consultation', tier: 2 }
    ]
  }
};
