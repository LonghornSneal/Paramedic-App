/**
 * Generated EKG waveform assets for rhythm and modifier selections.
 * The renderers build scalable SVG snippets so the Patient Info sidebar
 * can display compact previews without shipping large raster files.
 *
 * Each waveform is defined by a set of points (time vs amplitude) that
 * is converted into a polyline path. Values intentionally keep the math
 * lightweight so this module can run in the browser without build steps.
 */

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 260;
const BASELINE = Math.round(CANVAS_HEIGHT * 0.6);
const GRID_SPACING_X = 80;
const GRID_SPACING_Y = 40;

function toPoint(x, amplitude) {
  return [Number(x.toFixed(2)), Number((BASELINE - amplitude).toFixed(2))];
}

function pointsToPath(points) {
  return points
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x},${y}`)
    .join(' ');
}

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function buildGridPaths() {
  const vertical = [];
  for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SPACING_X) {
    vertical.push(`M${x},0 L${x},${CANVAS_HEIGHT}`);
  }
  const horizontal = [];
  for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SPACING_Y) {
    horizontal.push(`M0,${y} L${CANVAS_WIDTH},${y}`);
  }
  return {
    majorVertical: vertical.join(' '),
    majorHorizontal: horizontal.join(' ')
  };
}

const GRID_PATHS = buildGridPaths();

/**
 * Tiles a single cardiac cycle across the canvas width.
 * Expects cycle points as [time, amplitude] pairs describing the waveform.
 */
function tileCycle(cyclePoints, cycleWidth) {
  const tiles = Math.ceil(CANVAS_WIDTH / cycleWidth);
  const stitched = [];
  for (let i = 0; i < tiles; i += 1) {
    cyclePoints.forEach((point, index) => {
      if (i > 0 && index === 0) return; // avoid vertical jumps at tile seams
      const [x, amp] = point;
      const shiftedX = x + i * cycleWidth;
      if (shiftedX > CANVAS_WIDTH) return;
      stitched.push(toPoint(shiftedX, amp));
    });
  }
  if (!stitched.length) {
    stitched.push(toPoint(0, 0));
    stitched.push(toPoint(CANVAS_WIDTH, 0));
  } else {
    const last = stitched[stitched.length - 1];
    if (last[0] < CANVAS_WIDTH) {
      stitched.push(toPoint(CANVAS_WIDTH, 0));
    }
  }
  return pointsToPath(stitched);
}

function createSinusCycle({
  cycleWidth = 150,
  prMultiplier = 1,
  pAmplitude = 12,
  qDepth = -15,
  rHeight = 58,
  sDepth = -28,
  stElevation = 0,
  tAmplitude = 26,
  includeP = true,
  includeQrs = true
} = {}) {
  const baseDuration = 120;
  const prExtension = 18 * prMultiplier;
  const stretch = cycleWidth / (baseDuration + prExtension);
  const points = [];

  const push = (x, amp) => points.push([x * stretch, amp]);

  push(0, 0);
  push(12, 0);
  if (includeP) {
    push(16, pAmplitude * 0.6);
    push(20, pAmplitude);
    push(24, pAmplitude * 0.3);
    push(28, 0);
  } else {
    push(24, 0);
  }

  const prStart = includeP ? 28 : 20;
  push(prStart + prExtension, 0);

  if (includeQrs) {
    push(prStart + prExtension + 6, qDepth);
    push(prStart + prExtension + 11, rHeight);
    push(prStart + prExtension + 18, sDepth);
  }

  const postQrs = prStart + prExtension + (includeQrs ? 28 : 10);
  push(postQrs + 10, stElevation);
  push(postQrs + 24, stElevation);
  push(postQrs + 38, tAmplitude);
  push(postQrs + 58, 0);
  push(baseDuration + prExtension, 0);

  return points;
}

function generateSinusRhythm({
  cycleWidth,
  cycles = 6,
  options = {}
}) {
  const cycle = createSinusCycle({
    cycleWidth,
    ...options
  });
  return tileCycle(cycle, cycleWidth);
}

function generateDroppedBeatPattern({
  initialPr = 1,
  increment = 0.4,
  dropIndex = 3
}) {
  const sequences = [];
  for (let i = 0; i < 5; i += 1) {
    const prMultiplier = initialPr + i * increment;
    const includeQrs = i !== dropIndex;
    const cycle = createSinusCycle({
      cycleWidth: includeQrs ? 150 : 150,
      prMultiplier,
      includeQrs
    });
    const shift = i * 150;
    sequences.push(cycle.map(([x, amp]) => [x + shift, amp]));
  }
  const flattened = sequences.flat();
  const svgPoints = flattened.map(point => toPoint(point[0], point[1]));
  const last = svgPoints[svgPoints.length - 1];
  if (!last || last[0] < CANVAS_WIDTH) {
    svgPoints.push(toPoint(CANVAS_WIDTH, 0));
  }
  return pointsToPath(svgPoints);
}

function generateWideComplex({
  cycleWidth = 160,
  rWidth = 24,
  amplitude = 55,
  baselineSway = false,
  cycles = 6
}) {
  const points = [];
  const swayAmp = baselineSway ? 6 : 0;
  for (let i = 0; i < cycles; i += 1) {
    const offset = i * cycleWidth;
    points.push(toPoint(offset, baselineSway ? swayAmp : 0));
    points.push(toPoint(offset + rWidth * 0.2, -amplitude * 0.4));
    points.push(toPoint(offset + rWidth * 0.5, amplitude));
    points.push(toPoint(offset + rWidth * 0.9, -amplitude * 0.35));
    points.push(toPoint(offset + rWidth * 1.4, 0));
    points.push(toPoint(offset + rWidth * 1.8, swayAmp ? -swayAmp : 0));
  }
  if (points[points.length - 1][0] < CANVAS_WIDTH) {
    points.push(toPoint(CANVAS_WIDTH, 0));
  }
  return pointsToPath(points);
}

function generateChaoticWave({ amplitude = 30, step = 24 }) {
  const points = [];
  let polarity = 1;
  for (let x = 0; x <= CANVAS_WIDTH; x += step) {
    const variance = amplitude * (0.4 + ((x * 37) % 23) / 50);
    points.push(toPoint(x, variance * polarity));
    polarity *= -1;
  }
  return pointsToPath(points);
}

function generateTorsades() {
  const points = [];
  const period = 140;
  for (let x = 0; x <= CANVAS_WIDTH; x += 12) {
    const angle = (x / period) * Math.PI;
    const envelope = 20 + 35 * Math.sin(angle);
    const waveform = envelope * Math.sin((x / 24) * Math.PI);
    points.push(toPoint(x, waveform));
  }
  return pointsToPath(points);
}

function generateAsystole() {
  return pointsToPath([
    toPoint(0, 0),
    toPoint(CANVAS_WIDTH * 0.2, 0),
    toPoint(CANVAS_WIDTH * 0.3, 2),
    toPoint(CANVAS_WIDTH * 0.4, -2),
    toPoint(CANVAS_WIDTH * 0.6, 1),
    toPoint(CANVAS_WIDTH, 0)
  ]);
}

function generatePacedRhythm() {
  const points = [];
  const cycleWidth = 170;
  for (let x = 0; x <= CANVAS_WIDTH; x += cycleWidth) {
    points.push(toPoint(x, 0));
    points.push(toPoint(x + 4, 40));
    points.push(toPoint(x + 6, -80));
    points.push(toPoint(x + 16, 70));
    points.push(toPoint(x + 32, -40));
    points.push(toPoint(x + 44, 5));
  }
  if (points[points.length - 1][0] < CANVAS_WIDTH) {
    points.push(toPoint(CANVAS_WIDTH, 0));
  }
  return pointsToPath(points);
}

function generateJunctional() {
  return generateSinusRhythm({
    cycleWidth: 150,
    options: {
      includeP: false,
      qDepth: -10,
      rHeight: 52,
      sDepth: -24,
      tAmplitude: 18
    }
  });
}

function generateAtrialFibrillation() {
  const points = [];
  let x = 0;
  const randomSeries = [0.1, 0.6, -0.3, 0.4, -0.6, 0.2, -0.4, 0.3, -0.2, 0.55];
  let seriesIndex = 0;
  while (x <= CANVAS_WIDTH) {
    const jitter = randomSeries[seriesIndex % randomSeries.length];
    const amplitude = jitter * 18;
    points.push(toPoint(x, amplitude));
    seriesIndex += 1;
    x += 14;
  }
  // Insert irregular R waves
  const overlay = [];
  let position = 70;
  const intervals = [120, 140, 90, 160, 110];
  for (let idx = 0; position < CANVAS_WIDTH; idx += 1) {
    const interval = intervals[idx % intervals.length];
    overlay.push(toPoint(position - 6, -22));
    overlay.push(toPoint(position - 2, 58));
    overlay.push(toPoint(position + 6, -30));
    position += interval;
  }
  return pointsToPath([...points, ...overlay].sort((a, b) => a[0] - b[0]));
}

function generateAtrialFlutter() {
  const points = [];
  const cycle = 32;
  for (let x = 0; x <= CANVAS_WIDTH; x += cycle) {
    points.push(toPoint(x, 0));
    points.push(toPoint(x + cycle * 0.25, 18));
    points.push(toPoint(x + cycle * 0.5, -18));
    points.push(toPoint(x + cycle * 0.75, 18));
    points.push(toPoint(x + cycle, -14));
  }
  // Insert regular QRS complexes
  const overlay = [];
  for (let x = 60; x <= CANVAS_WIDTH; x += 160) {
    overlay.push(toPoint(x - 4, -25));
    overlay.push(toPoint(x, 60));
    overlay.push(toPoint(x + 6, -25));
  }
  return pointsToPath([...points, ...overlay].sort((a, b) => a[0] - b[0]));
}

function assembleWaveSvg(path) {
  return [
    `<svg viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" `,
    'xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">',
    `<rect x="0" y="0" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" fill="#101623" />`,
    `<path d="${GRID_PATHS.majorHorizontal}" stroke="rgba(255,255,255,0.07)" stroke-width="1" />`,
    `<path d="${GRID_PATHS.majorVertical}" stroke="rgba(255,255,255,0.07)" stroke-width="1" />`,
    `<path d="${path}" fill="none" stroke="#3fffb2" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" />`,
    '</svg>'
  ].join('');
}

function assembleLeadSvg(innerMarkup) {
  return [
    `<svg viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" `,
    'xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">',
    `<rect x="0" y="0" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" fill="#0b1220" />`,
    `<path d="${GRID_PATHS.majorHorizontal}" stroke="rgba(255,255,255,0.05)" stroke-width="1" />`,
    innerMarkup,
    '</svg>'
  ].join('');
}

function buildDataUri(svgMarkup) {
  const encoded = encodeURIComponent(svgMarkup)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml,${encoded}`;
}

const rhythmBlueprints = [
  {
    id: 'normal-sinus-rhythm',
    name: 'Normal Sinus Rhythm',
    definition: 'Regular rhythm 60-100 bpm with upright P preceding every narrow QRS and normal PR interval.',
    builder: () => generateSinusRhythm({ cycleWidth: 150 })
  },
  {
    id: 'sinus-tachycardia',
    name: 'Sinus Tachycardia',
    definition: 'Regular sinus rhythm faster than 100 bpm; P waves and PR interval remain normal but RR interval shortens.',
    builder: () => generateSinusRhythm({ cycleWidth: 110 })
  },
  {
    id: 'sinus-bradycardia',
    name: 'Sinus Bradycardia',
    definition: 'Regular sinus rhythm slower than 60 bpm with normal P-QRS relationship and prolonged RR interval.',
    builder: () => generateSinusRhythm({ cycleWidth: 200 })
  },
  {
    id: 'atrial-fibrillation',
    name: 'Atrial Fibrillation',
    definition: 'Irregularly irregular rhythm with absent P waves and fibrillatory baseline between variable QRS spacing.',
    builder: () => generateAtrialFibrillation()
  },
  {
    id: 'atrial-flutter',
    name: 'Atrial Flutter',
    definition: 'Sawtooth flutter waves at ~300 bpm with regular ventricular response depending on AV conduction ratio.',
    builder: () => generateAtrialFlutter()
  },
  {
    id: 'supraventricular-tachycardia',
    name: 'SVT',
    definition: 'Narrow complex tachycardia typically >150 bpm with absent or retrograde P waves and regular RR intervals.',
    builder: () => generateSinusRhythm({ cycleWidth: 90, options: { pAmplitude: 4 } })
  },
  {
    id: 'junctional-rhythm',
    name: 'Junctional Rhythm',
    definition: 'Rhythm originating at AV node with absent or inverted P waves and narrow complexes 40-60 bpm.',
    builder: () => generateJunctional()
  },
  {
    id: 'first-degree-av-block',
    name: 'First Degree AV Block',
    definition: 'Sinus rhythm with prolonged PR interval (>200 ms) but every P conducts to a QRS complex.',
    builder: () => generateSinusRhythm({
      cycleWidth: 180,
      options: { prMultiplier: 1.9 }
    })
  },
  {
    id: 'second-degree-av-block-type-i',
    name: 'Second Degree AV Block Type I',
    definition: 'Progressively lengthening PR intervals culminating in a dropped QRS (Wenckebach).',
    builder: () => generateDroppedBeatPattern({ initialPr: 1, increment: 0.4, dropIndex: 3 })
  },
  {
    id: 'second-degree-av-block-type-ii',
    name: 'Second Degree AV Block Type II',
    definition: 'Intermittent non-conducted P waves without PR prolongation; sudden dropped QRS complexes.',
    builder: () => generateDroppedBeatPattern({ initialPr: 1.2, increment: 0, dropIndex: 2 })
  },
  {
    id: 'third-degree-av-block',
    name: 'Third Degree AV Block',
    definition: 'Complete AV dissociation with independent atrial (P) and ventricular (QRS) rhythms.',
    builder: () => {
      const ventricular = generateWideComplex({ cycleWidth: 200, amplitude: 45, cycles: 6 });
      const atrial = tileCycle(createSinusCycle({ cycleWidth: 100, includeQrs: false, pAmplitude: 10 }), 100);
      const combined = `${ventricular} ${atrial}`;
      return combined;
    }
  },
  {
    id: 'ventricular-tachycardia',
    name: 'Ventricular Tachycardia',
    definition: 'Wide complex monomorphic tachycardia typically >120 bpm originating below the AV node.',
    builder: () => generateWideComplex({ cycleWidth: 150, amplitude: 60, cycles: 7 })
  },
  {
    id: 'torsades-de-pointes',
    name: 'Torsades de Pointes',
    definition: 'Polymorphic VT with twisting QRS axis around baseline and waxing/waning amplitude.',
    builder: () => generateTorsades()
  },
  {
    id: 'ventricular-fibrillation',
    name: 'Ventricular Fibrillation',
    definition: 'Chaotic, irregular waveform without identifiable P waves, QRS complexes, or T waves.',
    builder: () => generateChaoticWave({ amplitude: 36 })
  },
  {
    id: 'asystole',
    name: 'Asystole',
    definition: 'Flatline with no discernible electrical activity; confirm in two leads.',
    builder: () => generateAsystole()
  },
  {
    id: 'pea',
    name: 'Pulseless Electrical Activity',
    definition: 'Organized electrical rhythm on ECG without palpable pulse; look for reversible causes.',
    builder: () => generateSinusRhythm({ cycleWidth: 170, options: { rHeight: 12, sDepth: -12, tAmplitude: 6 } })
  },
  {
    id: 'wolff-parkinson-white',
    name: 'Wolff-Parkinson-White',
    definition: 'Short PR interval with delta wave slurred upstroke caused by accessory pathway conduction.',
    builder: () => generateSinusRhythm({
      cycleWidth: 150,
      options: { prMultiplier: 0.6, qDepth: -6, rHeight: 48, stElevation: 6 }
    })
  },
  {
    id: 'paced-rhythm',
    name: 'Paced Rhythm',
    definition: 'Regular rhythm with pacing spikes preceding wide QRS complexes.',
    builder: () => generatePacedRhythm()
  }
];

export const EkgRhythmAssets = rhythmBlueprints.map(blueprint => {
  const path = blueprint.builder();
  const svgMarkup = assembleWaveSvg(path);
  return {
    id: blueprint.id,
    name: blueprint.name,
    definition: blueprint.definition,
    dataUri: buildDataUri(svgMarkup)
  };
});

/**
 * Modifier assets represent MI territories, bundle branch blocks, and Sgarbossa criteria.
 * These illustrations focus on hallmark features (e.g., ST elevation) instead of full rhythm strips.
 */

function buildLeadBox({ leads, highlight }) {
  const cellWidth = Math.floor(CANVAS_WIDTH / leads.length);
  const statements = leads.map((lead, index) => {
    const x = index * cellWidth;
    const label = `<text x="${x + cellWidth / 2}" y="${CANVAS_HEIGHT - 12}" font-size="28" fill="#cbd5f5" text-anchor="middle">${lead}</text>`;
    const baseline = `<path d="M${x + 20},${BASELINE} L${x + cellWidth - 20},${BASELINE}" stroke="rgba(255,255,255,0.2)" stroke-width="4" />`;
    const wave = highlight[index] ?? `<path d="M${x + 20},${BASELINE} L${x + cellWidth - 20},${BASELINE}" stroke="#3fffb2" stroke-width="6" />`;
    return `${label}${baseline}${wave}`;
  });
  return statements.join('');
}

const modifierBlueprints = [
  {
    id: 'inferior-mi',
    name: 'Inferior MI',
    definition: 'ST elevation in II, III, aVF with reciprocal depression in I and aVL; consider right-sided involvement.',
    builder: () => assembleLeadSvg(buildLeadBox({
      leads: ['II', 'III', 'aVF', 'V1'],
      highlight: [
        `<path d="M60,${BASELINE} L120,${BASELINE - 50} L180,${BASELINE - 20}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M240,${BASELINE} L300,${BASELINE - 65} L360,${BASELINE - 25}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M420,${BASELINE} L480,${BASELINE - 45} L540,${BASELINE - 15}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M600,${BASELINE} L660,${BASELINE + 28} L720,${BASELINE + 18}" stroke="#4cc9f0" stroke-width="7" />`
      ]
    }))
  },
  {
    id: 'anterior-mi',
    name: 'Anterior MI',
    definition: 'ST elevation in V1-V4; monitor for LAD occlusion and anterior wall ischemia.',
    builder: () => assembleLeadSvg(buildLeadBox({
      leads: ['V1', 'V2', 'V3', 'V4'],
      highlight: [
        `<path d="M60,${BASELINE + 10} L120,${BASELINE - 40} L180,${BASELINE - 30}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M240,${BASELINE + 6} L300,${BASELINE - 52} L360,${BASELINE - 28}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M420,${BASELINE} L480,${BASELINE - 60} L540,${BASELINE - 30}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M600,${BASELINE - 4} L660,${BASELINE - 48} L720,${BASELINE - 20}" stroke="#ff6b6b" stroke-width="8" />`
      ]
    }))
  },
  {
    id: 'lateral-mi',
    name: 'Lateral MI',
    definition: 'ST elevation in I, aVL, V5, V6 with reciprocal changes inferiorly.',
    builder: () => assembleLeadSvg(buildLeadBox({
      leads: ['I', 'aVL', 'V5', 'V6'],
      highlight: [
        `<path d="M60,${BASELINE} L120,${BASELINE - 42} L180,${BASELINE - 18}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M240,${BASELINE} L300,${BASELINE - 36} L360,${BASELINE - 12}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M420,${BASELINE} L480,${BASELINE - 48} L540,${BASELINE - 22}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M600,${BASELINE} L660,${BASELINE - 40} L720,${BASELINE - 18}" stroke="#ff6b6b" stroke-width="8" />`
      ]
    }))
  },
  {
    id: 'posterior-mi',
    name: 'Posterior MI',
    definition: 'Posterior infarct manifests as ST depression and tall R waves in V1-V3; confirm with posterior leads.',
    builder: () => assembleLeadSvg(buildLeadBox({
      leads: ['V1', 'V2', 'V3', 'V4'],
      highlight: [
        `<path d="M60,${BASELINE} L120,${BASELINE + 55} L180,${BASELINE + 25}" stroke="#4cc9f0" stroke-width="8" />`,
        `<path d="M240,${BASELINE} L300,${BASELINE + 45} L360,${BASELINE + 18}" stroke="#4cc9f0" stroke-width="8" />`,
        `<path d="M420,${BASELINE} L480,${BASELINE + 36} L540,${BASELINE + 12}" stroke="#4cc9f0" stroke-width="8" />`,
        `<path d="M600,${BASELINE} L660,${BASELINE - 12} L720,${BASELINE - 6}" stroke="#3fffb2" stroke-width="6" />`
      ]
    }))
  },
  {
    id: 'right-ventricular-mi',
    name: 'Right Ventricular MI',
    definition: 'Inferior STEMI with ST elevation in right-sided leads (V4R); monitor for hypotension.',
    builder: () => assembleLeadSvg(buildLeadBox({
      leads: ['II', 'III', 'aVF', 'V4R'],
      highlight: [
        `<path d="M60,${BASELINE} L120,${BASELINE - 38} L180,${BASELINE - 12}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M240,${BASELINE} L300,${BASELINE - 46} L360,${BASELINE - 14}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M420,${BASELINE} L480,${BASELINE - 42} L540,${BASELINE - 10}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M600,${BASELINE} L660,${BASELINE - 56} L720,${BASELINE - 22}" stroke="#ff6b6b" stroke-width="8" />`
      ]
    }))
  },
  {
    id: 'left-bundle-branch-block',
    name: 'Left Bundle Branch Block',
    definition: 'Wide QRS (>120 ms) with broad notched R in lateral leads and deep S in V1-V3.',
    builder: () => assembleLeadSvg(buildLeadBox({
      leads: ['V1', 'V2', 'V5', 'V6'],
      highlight: [
        `<path d="M60,${BASELINE + 18} L120,${BASELINE - 10} L180,${BASELINE - 34}" stroke="#3fffb2" stroke-width="8" />`,
        `<path d="M240,${BASELINE + 24} L300,${BASELINE} L360,${BASELINE - 30}" stroke="#3fffb2" stroke-width="8" />`,
        `<path d="M420,${BASELINE} L480,${BASELINE - 12} L510,${BASELINE - 32} L540,${BASELINE - 10}" stroke="#3fffb2" stroke-width="8" />`,
        `<path d="M600,${BASELINE} L660,${BASELINE - 14} L690,${BASELINE - 30} L720,${BASELINE - 12}" stroke="#3fffb2" stroke-width="8" />`
      ]
    }))
  },
  {
    id: 'right-bundle-branch-block',
    name: 'Right Bundle Branch Block',
    definition: 'Wide QRS with rSR\' pattern in V1 and broad slurred S in lateral leads.',
    builder: () => assembleLeadSvg(buildLeadBox({
      leads: ['V1', 'V2', 'V5', 'V6'],
      highlight: [
        `<path d="M60,${BASELINE + 12} L120,${BASELINE - 36} L150,${BASELINE + 10} L180,${BASELINE - 32}" stroke="#3fffb2" stroke-width="8" />`,
        `<path d="M240,${BASELINE + 12} L300,${BASELINE - 32} L330,${BASELINE + 12} L360,${BASELINE - 26}" stroke="#3fffb2" stroke-width="8" />`,
        `<path d="M420,${BASELINE} L480,${BASELINE - 6} L540,${BASELINE + 18}" stroke="#3fffb2" stroke-width="8" />`,
        `<path d="M600,${BASELINE} L660,${BASELINE - 8} L720,${BASELINE + 16}" stroke="#3fffb2" stroke-width="8" />`
      ]
    }))
  },
  {
    id: 'sgarbossa-positive',
    name: 'Sgarbossa Positive',
    definition: 'Concordant ST elevation ≥1 mm in leads with positive QRS or concordant ST depression in V1-V3.',
    builder: () => assembleLeadSvg(buildLeadBox({
      leads: ['V1', 'V2', 'V3', 'V4'],
      highlight: [
        `<path d="M60,${BASELINE} L120,${BASELINE - 32} L180,${BASELINE - 8}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M240,${BASELINE} L300,${BASELINE - 36} L360,${BASELINE - 12}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M420,${BASELINE} L480,${BASELINE + 42} L540,${BASELINE + 16}" stroke="#4cc9f0" stroke-width="8" />`,
        `<path d="M600,${BASELINE} L660,${BASELINE - 4} L720,${BASELINE + 6}" stroke="#3fffb2" stroke-width="6" />`
      ]
    }))
  },
  {
    id: 'sgarbossa-negative',
    name: 'Sgarbossa Negative/Discordant',
    definition: 'Excessive discordant ST elevation (≥5 mm) in leads with negative QRS during LBBB or paced rhythm.',
    builder: () => assembleLeadSvg(buildLeadBox({
      leads: ['V1', 'V2', 'V3', 'V4'],
      highlight: [
        `<path d="M60,${BASELINE + 20} L120,${BASELINE - 52} L180,${BASELINE + 30}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M240,${BASELINE + 18} L300,${BASELINE - 48} L360,${BASELINE + 28}" stroke="#ff6b6b" stroke-width="8" />`,
        `<path d="M420,${BASELINE} L480,${BASELINE - 10} L540,${BASELINE - 20}" stroke="#3fffb2" stroke-width="6" />`,
        `<path d="M600,${BASELINE} L660,${BASELINE - 8} L720,${BASELINE - 18}" stroke="#3fffb2" stroke-width="6" />`
      ]
    }))
  }
];

export const EkgModifierAssets = modifierBlueprints.map(blueprint => {
  const svgMarkup = blueprint.builder();
  return {
    id: blueprint.id,
    name: blueprint.name,
    definition: blueprint.definition,
    dataUri: buildDataUri(svgMarkup)
  };
});
