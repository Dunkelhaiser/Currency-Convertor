export {};

const swapBtn = document.querySelector("#swap-btn") as HTMLButtonElement;
const selectFirst = document.querySelector("#select-first") as HTMLSelectElement;
const selectSecond = document.querySelector("#select-second") as HTMLSelectElement;
const inputFirst = document.querySelector("#input-first") as HTMLInputElement;
const inputSecond = document.querySelector("#input-second") as HTMLInputElement;
const exchangeRateSpan = document.querySelector("#exchange-rate") as HTMLSpanElement;

const showRate = async () => {
    const conv = await fetch(`https://api.exchangerate.host/convert?from=EUR&to=USD`);
    const converted = await conv.json();
    exchangeRateSpan.innerText = `1 ${converted.query.from} = ${converted.result} ${converted.query.to}`;
};

const convert = async () => {
    const conv = await fetch(
        `https://api.exchangerate.host/convert?from=${selectFirst.value}&to=${selectSecond.value}&amount=${inputFirst.value}`
    );
    const converted = await conv.json();
    inputSecond.value = `${converted.result}`;
};

const convertSecond = async () => {
    const conv = await fetch(
        `https://api.exchangerate.host/convert?from=${selectSecond.value}&to=${selectFirst.value}&amount=${inputSecond.value}`
    );
    const converted = await conv.json();
    inputFirst.value = `${converted.result}`;
};

const initialFetch = async () => {
    const res = await fetch(`https://api.exchangerate.host/symbols`);
    const currencies = await res.json();
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const currency in currencies.symbols) {
        const currOpt = document.createElement("option");
        currOpt.value = currency;
        currOpt.textContent += currency;
        selectFirst.appendChild(currOpt);
    }
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const currency in currencies.symbols) {
        const currOpt = document.createElement("option");
        currOpt.value = currency;
        currOpt.textContent += currency;
        selectSecond.appendChild(currOpt);
    }
    selectFirst.selectedIndex = 46;
    selectSecond.selectedIndex = 150;
    showRate();
    convert();
};

const swap = () => {
    const temp = selectFirst.value;
    selectFirst.value = selectSecond.value;
    selectSecond.value = temp;
};

initialFetch();

selectFirst.addEventListener("change", convert);
selectSecond.addEventListener("change", convert);
inputFirst.addEventListener("change", convert);
inputSecond.addEventListener("change", convertSecond);
swapBtn.addEventListener("click", () => {
    swap();
    convert();
});
