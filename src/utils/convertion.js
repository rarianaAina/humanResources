export default function numberToLetterMoney(amount) {
  if (amount === 0) return "zéro";
  let words = "";

  // Gérer les milliers
  if (amount >= 1000) {
    words += convertHundreds(Math.floor(amount / 1000)) + " mille ";
    amount %= 1000;
  }

  // Gérer les centaines
  if (amount > 0) {
    words += convertHundreds(amount);
  }

  return words.trim() + " Ariary";
}

function convertHundreds(amount) {
  const units = [
    "",
    "un",
    "deux",
    "trois",
    "quatre",
    "cinq",
    "six",
    "sept",
    "huit",
    "neuf",
  ];
  const tens = [
    "",
    "",
    "vingt",
    "trente",
    "quarante",
    "cinquante",
    "soixante",
    "soixante-dix",
    "quatre-vingt",
    "quatre-vingt-dix",
  ];

  let words = "";

  if (amount >= 100) {
    const hundredsCount = Math.floor(amount / 100);
    words += hundredsCount > 1 ? units[hundredsCount] + " cents " : "cent ";
    amount %= 100;
  }

  if (amount >= 20) {
    words +=
      tens[Math.floor(amount / 10)] + (amount % 10 === 0 ? "" : "-") + " ";
    amount %= 10;
  }

  if (amount > 0) {
    words += units[amount] + " ";
  }

  return words.trim();
}
