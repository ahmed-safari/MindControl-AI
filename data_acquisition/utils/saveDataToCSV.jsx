export default function saveDataToCSV(brainwaveData) {
  const header = [
    "timestamp",
    ...Array.from({ length: 8 }, (_, i) => `alpha_${i + 1}`),
    ...Array.from({ length: 8 }, (_, i) => `beta_${i + 1}`),
    ...Array.from({ length: 8 }, (_, i) => `gamma_${i + 1}`),
    "stimulus",
    "frequency",
  ];

  const rows = brainwaveData.map((dataPoint) => {
    const row = [
      dataPoint.timestamp,
      ...dataPoint.alpha,
      ...dataPoint.beta,
      ...dataPoint.gamma,
      dataPoint.stimulus,
      dataPoint.frequency,
    ];
    return row.join(",");
  });

  const csvContent = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "brainwaves_data.csv";
  link.click();
  URL.revokeObjectURL(url);
}
