/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { addOptions, defaultValue, getValues } from "./select";

const swapBtn = document.querySelector("#swap-btn") as HTMLButtonElement;
const selectFirst = document.querySelector("#select-first") as HTMLDivElement;
const selectSecond = document.querySelector("#select-second") as HTMLDivElement;
const selectFirstValue = document.querySelector("#select-first .option") as HTMLSpanElement;
const selectSecondValue = document.querySelector("#select-second .option") as HTMLSpanElement;
const inputFirst = document.querySelector("#input-first") as HTMLInputElement;
const inputSecond = document.querySelector("#input-second") as HTMLInputElement;
const exchangeRateSpan = document.querySelector("#exchange-rate") as HTMLSpanElement;

const showRate = async () => {
    const conv = await fetch(`https://api.exchangerate.host/convert?from=${selectFirstValue.innerText}&to=${selectSecondValue.innerText}`);
    const converted = await conv.json();
    exchangeRateSpan.innerText = `1 ${converted.query.from} = ${Math.round((converted.result + Number.EPSILON) * 100) / 100} ${
        converted.query.to
    }`;
};

const convert = async () => {
    const conv = await fetch(
        `https://api.exchangerate.host/convert?from=${selectFirstValue.innerText}&to=${selectSecondValue.innerText}&amount=${inputFirst.value}`
    );
    const converted = await conv.json();
    inputSecond.value = `${converted.result}`;
    showRate();
};

const convertSecond = async () => {
    const conv = await fetch(
        `https://api.exchangerate.host/convert?from=${selectSecondValue.innerText}&to=${selectFirstValue.innerText}&amount=${inputSecond.value}`
    );
    const converted = await conv.json();
    inputFirst.value = `${converted.result}`;
    showRate();
};

const initialFetch = async () => {
    const res = await fetch(`https://api.exchangerate.host/symbols`);
    const currencies = await res.json();
    const currenciesArr: string[] = [];
    Object.keys(currencies.symbols).forEach((key) => {
        const currency = currencies.symbols[key];
        currenciesArr.push(currency.code);
    });
    addOptions(selectFirst, currenciesArr);
    addOptions(selectSecond, currenciesArr);
    getValues(currenciesArr);
    defaultValue(selectFirst, "EUR");
    defaultValue(selectSecond, "USD");
    showRate();
    convert();
};

const swap = () => {
    const temp = selectFirst.querySelector<HTMLSpanElement>(".option")!.innerText;
    selectFirst.querySelector<HTMLSpanElement>(".option")!.innerText = selectSecond.querySelector<HTMLSpanElement>(".option")!.innerText;
    selectSecond.querySelector<HTMLSpanElement>(".option")!.innerText = temp;
    showRate();
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
