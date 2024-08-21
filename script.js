const Base_Url =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swapCurrencyBtn = document.getElementById("swapCurrency");

for (let select of dropdowns) {
  for (currncyCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currncyCode;
    newOption.value = currncyCode;
    if (select.name === "from" && currncyCode === "USD") {
      newOption.selected = "selected";
    }
    if (select.name === "to" && currncyCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

const updateExchange = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amount.value = "1";
  }

  const URL = `${Base_Url}/currencies/${fromCurr.value.toLowerCase()}.json`;
  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Error fetching the exchange rate:", error);
    msg.textContent = "Error fetching the exchange rate. Please try again.";
  }
};

window.addEventListener("load", () => {
  updateExchange();
});
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchange();
});

swapCurrencyBtn.addEventListener("click", () => {
    let temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;

    updateFlag(fromCurr);
    updateFlag(toCurr);
  
    updateExchange();
  });
