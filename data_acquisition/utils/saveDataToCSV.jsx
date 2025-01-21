export default function saveDataToCSV(brainwaveData) {
  /**
   * Header includes:
   *  1) type               ("raw" or "powerByBand")
   *  2) timestamp          (Neurosity device timestamp)
   *  3) laptop_timestamp   (local system time in ms with decimal)
   *  4) raw channels       (8 columns)
   *  5) alpha (8 columns)
   *  6) beta  (8 columns)
   *  7) gamma (8 columns)
   *  8) signal quality     (8 columns: one per channel)
   *  9) frequency
   */
  const header = [
    "type",
    "timestamp",
    "laptop_timestamp",
    "participantName",
    // 8 raw channels (CP3, C3, F5, PO3, PO4, F6, C4, CP4):
    "raw_CP3",
    "raw_C3",
    "raw_F5",
    "raw_PO3",
    "raw_PO4",
    "raw_F6",
    "raw_C4",
    "raw_CP4",

    // alpha_0..alpha_7
    ...Array.from({ length: 8 }, (_, i) => `alpha_${i}`),

    // beta_0..beta_7
    ...Array.from({ length: 8 }, (_, i) => `beta_${i}`),

    // gamma_0..gamma_7
    ...Array.from({ length: 8 }, (_, i) => `gamma_${i}`),

    // 8 signal quality columns:
    "SQ_CP3",
    "SQ_C3",
    "SQ_F5",
    "SQ_PO3",
    "SQ_PO4",
    "SQ_F6",
    "SQ_C4",
    "SQ_CP4",

    "frequency",
  ];

  let particpantName = brainwaveData[0]?.participantName || "unknown";

  // Convert each data point into a CSV row
  const rows = brainwaveData.map((dataPoint) => {
    const {
      type = "",
      timestamp = "",
      laptop_timestamp = "",
      participantName = "",
      data = [],
      alpha = [],
      beta = [],
      gamma = [],
      signalQuality = [],
      frequency = "",
    } = dataPoint;

    // Prepare placeholders to avoid errors if arrays are missing
    let rawChannels = Array(8).fill("");
    let alphaArr = Array(8).fill("");
    let betaArr = Array(8).fill("");
    let gammaArr = Array(8).fill("");
    let sqArr = Array(8).fill("");

    // If "raw", fill the raw channels (8 values)
    if (type === "raw") {
      rawChannels = Array.isArray(data) ? data : rawChannels;
    }

    // If "powerByBand", fill alpha/beta/gamma
    if (type === "powerByBand") {
      if (Array.isArray(alpha) && alpha.length === 8) alphaArr = alpha;
      if (Array.isArray(beta) && beta.length === 8) betaArr = beta;
      if (Array.isArray(gamma) && gamma.length === 8) gammaArr = gamma;
    }

    // Fill signalQuality statuses (8 channels)
    if (Array.isArray(signalQuality) && signalQuality.length === 8) {
      sqArr = signalQuality;
    }

    // Build the row in the same order as the header
    const rowValues = [
      type,
      timestamp,
      laptop_timestamp,
      participantName,

      // raw channels (8)
      ...rawChannels,

      // alpha, beta, gamma (each 8)
      ...alphaArr,
      ...betaArr,
      ...gammaArr,

      // signal quality for 8 channels
      ...sqArr,

      // frequency
      frequency,
    ];

    // Join by commas
    return rowValues.map((val) => (val !== undefined ? val : "")).join(",");
  });

  // Combine header + rows
  const csvContent = [header.join(","), ...rows].join("\n");

  // Create a downloadable Blob and auto-click to save
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `brainwaves_data_${particpantName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
