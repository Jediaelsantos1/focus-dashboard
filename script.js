const STORAGE_KEY = "focus_history_v1";

const defaultData = [
  {
    releaseDate: "2026-04-24",
    pdfUrl: "https://www.bcb.gov.br/content/focus/focus/R20260424.pdf",
    ipca: 5.55,
    selic: 14.75,
    gdp: 2.0,
    fx: 5.42
  }
];

const form = document.getElementById("focus-form");
const historyBody = document.getElementById("history-body");
const macroInsights = document.getElementById("macro-insights");
const allocationOutput = document.getElementById("allocation-output");
const rebalancingOutput = document.getElementById("rebalancing-output");

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return [...defaultData];
  }
  return JSON.parse(raw);
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function fmt(value) {
  return Number(value).toFixed(2).replace(".", ",");
}

function calcDirection(curr, prev) {
  if (curr > prev) return "up";
  if (curr < prev) return "down";
  return "flat";
}

function render() {
  const data = loadData().sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
  historyBody.innerHTML = "";

  data.forEach((entry, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.releaseDate}</td>
      <td>${fmt(entry.ipca)}</td>
      <td>${fmt(entry.selic)}</td>
      <td>${fmt(entry.gdp)}</td>
      <td>${fmt(entry.fx)}</td>
      <td><a href="${entry.pdfUrl}" target="_blank" rel="noreferrer">PDF</a></td>
      <td><button data-index="${index}" class="delete">Excluir</button></td>
    `;
    historyBody.appendChild(tr);
  });

  const last = data[data.length - 1];
  const prev = data[data.length - 2] || last;
  renderMacro(last, prev);
  renderAllocation(last, prev);
  renderRebalancing(last, prev);

  document.querySelectorAll(".delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.index);
      data.splice(idx, 1);
      saveData(data);
      render();
    });
  });
}

function renderMacro(last, prev) {
  const items = [
    ["IPCA", last.ipca, prev.ipca],
    ["SELIC", last.selic, prev.selic],
    ["PIB", last.gdp, prev.gdp],
    ["Câmbio", last.fx, prev.fx]
  ];
  macroInsights.innerHTML = "";

  items.forEach(([name, current, previous]) => {
    const li = document.createElement("li");
    const direction = calcDirection(current, previous);
    const label = direction === "up" ? "Revisão para cima" : direction === "down" ? "Revisão para baixo" : "Estável";
    li.innerHTML = `${name}: <span class="tag ${direction}">${label}</span> (${fmt(previous)} → ${fmt(current)})`;
    macroInsights.appendChild(li);
  });
}

function renderAllocation(last) {
  let allocation;
  if (last.ipca > 5.5 && last.selic >= 14) {
    allocation = [
      "Renda fixa pós-fixada: 45%",
      "Inflação (NTN-B): 25%",
      "Ações Brasil defensivas: 15%",
      "Ações globais: 10%",
      "Caixa/alternativos: 5%"
    ];
  } else {
    allocation = [
      "Renda fixa pós-fixada: 30%",
      "Inflação (NTN-B): 20%",
      "Ações Brasil: 25%",
      "Ações globais: 20%",
      "Caixa/alternativos: 5%"
    ];
  }
  allocationOutput.innerHTML = `<ul>${allocation.map((x) => `<li>${x}</li>`).join("")}</ul>`;
}

function renderRebalancing(last, prev) {
  const msgs = [];
  if (last.selic > prev.selic) msgs.push("Aumentar duration curta e caixa tático.");
  if (last.ipca > prev.ipca) msgs.push("Reforçar proteção inflacionária (NTN-B, real assets). ");
  if (last.gdp < prev.gdp) msgs.push("Reduzir beta em renda variável doméstica.");
  if (last.fx > prev.fx) msgs.push("Elevar hedge cambial parcial.");

  rebalancingOutput.innerHTML = msgs.length
    ? `<ul>${msgs.map((x) => `<li>${x}</li>`).join("")}</ul>`
    : "Sem gatilhos táticos relevantes na semana.";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entry = {
    releaseDate: document.getElementById("releaseDate").value,
    pdfUrl: document.getElementById("pdfUrl").value,
    ipca: Number(document.getElementById("ipca").value),
    selic: Number(document.getElementById("selic").value),
    gdp: Number(document.getElementById("gdp").value),
    fx: Number(document.getElementById("fx").value)
  };

  const data = loadData();
  data.push(entry);
  saveData(data);
  form.reset();
  render();
});

render();
