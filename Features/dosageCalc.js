const NUMERIC_RANGE_SEPARATOR_RE = /\s*[-–]\s*/;

function toAsciiText(value) {
  return String(value)
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/\u00B5/g, 'u')
    .replace(/\u03BC/g, 'u');
}

function stripDecorators(text) {
  return String(text || '')
    .replace(/\[\[(.+?)\|(.+?)\]\]/g, '$1 $2')
    .replace(/\{\{[^}]+\}\}/g, '')
    .replace(/[↑↓]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toNumber(value) {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num : null;
}

function normalizeUnit(unit) {
  const cleaned = toAsciiText(unit)
    .replace(/\s+/g, '')
    .toLowerCase();
  if (cleaned === 'mcg' || cleaned === 'ug') return 'mcg';
  if (cleaned === 'meq' || cleaned === 'mEq'.toLowerCase()) return 'meq';
  if (cleaned === 'unit' || cleaned === 'units') return 'units';
  if (cleaned === 'ml' || cleaned === 'cc') return 'ml';
  return cleaned;
}

function parseRange(raw) {
  const text = toAsciiText(raw).trim();
  const parts = text.split(NUMERIC_RANGE_SEPARATOR_RE);
  if (!parts.length) return null;
  const min = toNumber(parts[0]);
  if (min == null) return null;
  const max = parts.length > 1 ? toNumber(parts[1]) : min;
  if (max == null) return null;
  return {
    min: Math.min(min, max),
    max: Math.max(min, max)
  };
}

function unitScale(unit) {
  const normalized = normalizeUnit(unit);
  if (normalized === 'mg') return 1;
  if (normalized === 'g') return 1000;
  if (normalized === 'mcg') return 0.001;
  return null;
}

function isMassDoseUnit(unit) {
  const normalized = normalizeUnit(unit);
  return normalized === 'mg' || normalized === 'g' || normalized === 'mcg';
}

function areDosageUnitsCompatible(left, right) {
  const leftNorm = normalizeUnit(left);
  const rightNorm = normalizeUnit(right);
  if (leftNorm === rightNorm) return true;
  return isMassDoseUnit(leftNorm) && isMassDoseUnit(rightNorm);
}

function toDoseUnit(value, fromUnit, toUnit) {
  const fromNorm = normalizeUnit(fromUnit);
  const toNorm = normalizeUnit(toUnit);
  if (!areDosageUnitsCompatible(fromNorm, toNorm)) return null;
  const fromScale = unitScale(fromNorm);
  const toScale = unitScale(toNorm);
  if (fromScale == null || toScale == null) return fromNorm === toNorm ? value : null;
  return (value * fromScale) / toScale;
}

function cleanNumber(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return value;
}

function formatNumber(value) {
  const num = cleanNumber(value);
  if (num == null) return '';
  const fixed = Number.isInteger(num) ? num : Number.parseFloat(num.toFixed(2));
  return Number.isInteger(fixed) ? fixed.toString() : fixed.toString();
}

function rangeLabel(range, unit) {
  if (!range) return '';
  const min = formatNumber(range.min);
  const max = formatNumber(range.max);
  return min === max ? `${min} ${unit}` : `${min}-${max} ${unit}`;
}

function parseMaxCaps(text) {
  const cleanText = stripDecorators(text);
  const matches = Array.from(cleanText.matchAll(/(?:max(?:imum)?)\s*=\s*(\d+(?:\.\d+)?(?:\s*[-–]\s*\d+(?:\.\d+)?)?)\s*(mg|mcg|ug|g|units?|meq)\s*(?:\/\s*kg)?/gi));
  if (!matches.length) return { perKgCap: null, maxCap: null };

  let perKgCap = null;
  let maxCap = null;

  matches.forEach(match => {
    const valueRange = parseRange(match[1]);
    const unit = normalizeUnit(match[2]);
    if (!valueRange) return;
    const isPerKg = /\/\s*kg/i.test(match[0]);
    const parsed = {
      unit,
      min: valueRange.min,
      max: valueRange.max
    };
    if (isPerKg) {
      perKgCap = parsed;
    } else if (!maxCap) {
      maxCap = parsed;
    }
  });

  return { perKgCap, maxCap };
}

function parseConcentration(raw) {
  const cleanText = stripDecorators(raw);
  const match = cleanText.match(/(\d+(?:\.\d+)?)\s*(mg|g|mcg|ug|units?|meq)\s*\/\s*(\d+(?:\.\d+)?)\s*(ml|cc)/i);
  if (!match) return null;

  const concentrationAmount = toNumber(match[1]);
  const concentrationUnit = normalizeUnit(match[2]);
  const volumePerUnit = toNumber(match[3]);

  if (concentrationAmount == null || volumePerUnit == null || concentrationUnit == null || !volumePerUnit) {
    return null;
  }

  return {
    amount: concentrationAmount,
    unit: concentrationUnit,
    volume: volumePerUnit
  };
}

export function parseDosePattern(detailText) {
  const cleanText = stripDecorators(detailText);
  const normalized = toAsciiText(cleanText);
  const weightMatch = normalized.match(/(\d+(?:\.\d+)?(?:\s*[-–]\s*\d+(?:\.\d+)?)?)\s*(mg|mcg|ug|units?|meq)\s*\/\s*kg/i);
  if (!weightMatch) {
    return null;
  }

  const doseRange = parseRange(weightMatch[1]);
  if (!doseRange) {
    return null;
  }

  const capInfo = parseMaxCaps(normalized);

  return {
    doseRange: {
      min: doseRange.min,
      max: doseRange.max,
      unit: normalizeUnit(weightMatch[2])
    },
    maxPerKg: capInfo.perKgCap,
    maxTotal: capInfo.maxCap
  };
}

function applyCapForUnit(cap, targetUnit) {
  if (!cap) return null;
  if (!areDosageUnitsCompatible(cap.unit, targetUnit)) return null;
  return {
    min: toDoseUnit(cap.min, cap.unit, targetUnit),
    max: toDoseUnit(cap.max, cap.unit, targetUnit)
  };
}

function clampRange(range, maxRange, unit) {
  if (!maxRange) return { ...range };
  const converted = {
    min: toDoseUnit(maxRange.max, maxRange.unit, unit),
    max: toDoseUnit(maxRange.max, maxRange.unit, unit)
  };
  if (converted.min == null) return { ...range };

  const max = converted.max;
  return {
    min: Math.min(range.min, max),
    max: Math.min(range.max, max)
  };
}

export function computeDose({ dosePattern, weightKg, concentration }) {
  if (!dosePattern || !dosePattern.doseRange || !dosePattern.doseRange.unit) {
    return { status: 'not_weight_based', hasCalculation: false };
  }

  const weight = toNumber(weightKg);
  if (!weight || weight <= 0) {
    return {
      status: 'missing_weight',
      hasCalculation: false,
      needsWeight: true,
      message: 'Enter weight to calculate'
    };
  }

  const doseUnit = dosePattern.doseRange.unit;
  const perKgRange = { ...dosePattern.doseRange };
  const maxPerKg = applyCapForUnit(dosePattern.maxPerKg, doseUnit);
  const cappedPerKg = clampRange(perKgRange, maxPerKg && { unit: doseUnit, max: maxPerKg.max }, doseUnit);

  const totalDose = {
    min: cappedPerKg.min * weight,
    max: cappedPerKg.max * weight,
    unit: doseUnit
  };
  const maxTotal = applyCapForUnit(dosePattern.maxTotal, doseUnit);
  const cappedTotal = clampRange(totalDose, maxTotal && { unit: doseUnit, max: maxTotal.max }, doseUnit);

  const conc = parseConcentration(concentration);
  let volume = null;
  if (conc && areDosageUnitsCompatible(conc.unit, doseUnit)) {
    const concDoseUnit = toDoseUnit(conc.amount / conc.volume, conc.unit, doseUnit);
    if (concDoseUnit != null) {
      volume = {
        min: cappedTotal.min / concDoseUnit,
        max: cappedTotal.max / concDoseUnit,
        unit: 'mL'
      };
    }
  }

  return {
    status: 'calculated',
    hasCalculation: true,
    weightKg: weight,
    doseUnit,
    doseRangePerKg: {
      ...cappedPerKg
    },
    totalDose: {
      ...cappedTotal
    },
    concentration: conc,
    volume
  };
}

export function formatDoseCalculation(calcResult) {
  if (!calcResult || !calcResult.status) {
    return { hasCalculation: false, html: '', text: '', formulaLines: [] };
  }

  if (calcResult.status === 'missing_weight') {
    return {
      hasCalculation: false,
      html: `<div class="med-dose-calc med-dose-calc-fallback">Enter weight to calculate</div>`,
      text: 'Enter weight to calculate',
      formulaLines: []
    };
  }

  if (calcResult.status !== 'calculated') {
    return { hasCalculation: false, html: '', text: '', formulaLines: [] };
  }

  const perKgText = rangeLabel(calcResult.doseRangePerKg, `${calcResult.doseUnit}/kg`);
  const doseText = rangeLabel(calcResult.totalDose, calcResult.doseUnit);
  const formula = [];
  const dosePerKgFormula = `${perKgText} × ${formatNumber(calcResult.weightKg)}kg = ${doseText}`;
  formula.push(`Dose: ${dosePerKgFormula}`);

  let volumeText = null;
  if (calcResult.volume) {
    const concLabel = calcResult.concentration
      ? `${formatNumber(calcResult.concentration.amount)}${calcResult.concentration.unit}/${calcResult.concentration.volume}mL`
      : 'concentration estimate';
    const volRange = rangeLabel(calcResult.volume, calcResult.volume.unit);
    volumeText = volRange;
    formula.push(`Volume: ${doseText} ÷ ${concLabel} = ${volRange}`);
  } else {
    formula.push('Volume not available: concentration did not parse to mg/units per mL.');
  }

  const html = [
    '<div class="med-dose-calc">',
    '<div class="med-dose-calc-title">Auto-calculated dose</div>',
    `<div class="med-dose-calc-line"><span class="font-semibold">Formula:</span> ${formula[0]}</div>`,
    `<div class="med-dose-calc-line">${formula[1]}</div>`,
    `</div>`
  ].join('');

  return {
    hasCalculation: true,
    doseText,
    formulaLines: formula,
    volumeText,
    text: doseText,
    html
  };
}

export function calculateLineDose({ text, weightKg, concentration }) {
  const dosePattern = parseDosePattern(text);
  const calc = computeDose({ dosePattern, weightKg, concentration });
  const formatted = formatDoseCalculation(calc);
  return {
    dosePattern,
    calc,
    formatted
  };
}
