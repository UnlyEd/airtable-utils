function dateToWordsFrench(date) {
  const monthNames = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  const dayNames = [
    "",
    "UN",
    "DEUX",
    "TROIS",
    "QUATRE",
    "CINQ",
    "SIX",
    "SEPT",
    "HUIT",
    "NEUF",
    "DIX",
    "ONZE",
    "DOUZE",
    "TREIZE",
    "QUATORZE",
    "QUINZE",
    "SEIZE",
    "DIX-SEPT",
    "DIX-HUIT",
    "DIX-NEUF",
    "VINGT",
    "VINGT ET UN",
    "VINGT-DEUX",
    "VINGT-TROIS",
    "VINGT-QUATRE",
    "VINGT-CINQ",
    "VINGT-SIX",
    "VINGT-SEPT",
    "VINGT-HUIT",
    "VINGT-NEUF",
    "TRENTE",
    "TRENTE ET UN",
  ];

  let day = dayNames[date.getDate()];
  let month = monthNames[date.getMonth()];
  let year = date.getFullYear();

  // Format the year as "deux mille vingt-trois" instead of "2023"
  let yearWords = "";
  if (year >= 2000) {
    yearWords = "DEUX MILLE ";
    year -= 2000;
  }
  if (year >= 1000) {
    let thousands = Math.floor(year / 1000);
    yearWords += dayNames[thousands] + " MILLE ";
    year %= 1000;
  }
  if (year >= 100) {
    let hundreds = Math.floor(year / 100);
    yearWords += dayNames[hundreds] + " CENT ";
    year %= 100;
  }
  if (year >= 10) {
    if (year === 10) {
      yearWords += "DIX ";
      year = 0;
    } else if (year > 10 && year <= 16) {
      yearWords += dayNames[year] + " ";
      year = 0;
    } else if (year > 16 && year <= 19) {
      yearWords += "DIX-" + dayNames[year - 10] + " ";
      year = 0;
    } else {
      let tens = Math.floor(year / 10);
      yearWords += dayNames[tens + 18] + " ";
      year %= 10;
    }
  }
  if (year > 0) {
    yearWords += dayNames[year] + " ";
  }

  return day + " " + month.toUpperCase() + " " + yearWords.trim();
}

const dateAsWords = dateToWordsFrench(new Date())
console.log(dateAsWords);

output.set('dateAsWords', dateAsWords);
