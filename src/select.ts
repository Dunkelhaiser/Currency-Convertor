/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const selectWrapper = document.querySelectorAll(".select-wrapper") as NodeListOf<HTMLDivElement>;
const selectBtn = document.querySelectorAll(".select-btn") as NodeListOf<HTMLDivElement>;
const searchInput = document.querySelectorAll("#search") as NodeListOf<HTMLInputElement>;

const values: string[] = [];

const expand = (i: number) => {
    selectWrapper[i].classList.toggle("expanded");
};

const updateSelected = (select: HTMLDivElement, selected: HTMLLIElement) => {
    select.querySelector<HTMLSpanElement>(".option")!.innerText = selected.innerText;
    select.classList.remove("expanded");
    select.querySelector<HTMLInputElement>("#search")!.value = "";
    select.dispatchEvent(new Event("change"));
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    search(select.querySelector<HTMLInputElement>("#search")!);
};

const createOptions = (select: HTMLDivElement, options: string[]) => {
    options.forEach((option) => {
        const li = document.createElement("li");
        li.innerText = option;
        li.addEventListener("click", () => updateSelected(select, li));
        select.querySelector(".options")!.appendChild(li);
    });
};

const search = (input: HTMLInputElement) => {
    const optionsContainer = input.parentNode!.parentNode!.querySelector<HTMLUListElement>(".options")!;
    let searchResults: string[] = [];
    searchResults = values.filter((searchValues) => {
        return searchValues.toLowerCase().startsWith(input.value.toLowerCase());
    });
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.lastChild!);
    }
    if (searchResults.length === 0) {
        const li = document.createElement("li");
        li.classList.add("not-found");
        li.innerText = "Not Found";
        optionsContainer.appendChild(li);
        return;
    }
    createOptions(input.parentNode!.parentNode! as HTMLDivElement, searchResults);
};

export const defaultValue = (select: HTMLDivElement, value: string) => {
    select.querySelector<HTMLSpanElement>(".option")!.innerText = value;
};

export const addOptions = (select: HTMLDivElement, options: string[]) => {
    createOptions(select, options);
};

export const getValues = (options: string[]) => {
    values.push(...options);
    selectBtn.forEach((btn, index) => btn.addEventListener("click", () => expand(index)));
    searchInput.forEach((input) => input.addEventListener("keyup", () => search(input)));
};
