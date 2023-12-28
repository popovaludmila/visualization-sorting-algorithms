const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const createArray = arrayLength => {
    const array = [];

    for (let i = 0; i < arrayLength; i++) {
        array.push(randomIntFromInterval(30, 600));
    }

    return array;
}

async function setGreen(i) {
    const bars = document.querySelectorAll(".array div");

    bars[i].style.background = "green";
}

async function timeout() {
    let speed = parseInt(document.querySelector("#speed").value);

    while (speed === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
        speed = parseInt(document.querySelector("#speed").value);
    }

    await new Promise(resolve => setTimeout(resolve, 500 - speed));
}

async function compareAndReplace(i, j) {
    const bars = document.querySelectorAll(".array div");

    bars[i].style.background = "red"
    bars[j].style.background = "red"

    await timeout();

    let hasChange = false;

    if (+bars[Math.min(i, j)].getAttribute("data-value") > +bars[Math.max(i, j)].getAttribute("data-value")) {
        const h = bars[i].style.height;
        const v = bars[i].getAttribute("data-value");

        bars[i].style.height = bars[j].style.height;
        bars[i].setAttribute("data-value", bars[j].getAttribute("data-value"));
        bars[i].textContent = bars[j].getAttribute("data-value");

        bars[j].style.height = h;
        bars[j].setAttribute("data-value", v);


        bars[j].textContent = v;
        hasChange = true;
    }
    await timeout();

    bars[i].style.background = "#ffb86c";
    bars[j].style.background = "#ffb86c";

    document.querySelector("#iteration").value++;

    return hasChange;
}

async function initArray() {
    document.querySelector(".array").innerHTML = "";
    document.querySelector("#iteration").value = 0;

    document.querySelectorAll(".sorts button").forEach(el => el.disabled = true);

    let data = createArray(50)

    const BAR_WIDTH = window.screen.width / data.length;

    data.forEach(el => {
        let div = document.createElement('div');
        div.style = "width:" + BAR_WIDTH + "px; height:" + el + "px";
        div.setAttribute("data-value", el);
        div.textContent = el;
        document.querySelector(".array").append(div);
    })

    return data;
}

// Пузырьковая сортировка

async function bubbleSort() {
    let data = await initArray();

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length - i - 1; j++) {
            await compareAndReplace(j, j + 1);
        }
        await setGreen(data.length - i - 1);
    }

    document.querySelectorAll(".sorts button").forEach(el => el.disabled = false);
}


async function combSort() {
    let data = await initArray();

    const factor = 1.247; // Фактор уменьшения

    let step = data.length - 1;

    while (step >= 1) {
        for (let i = 0; i + step < data.length; ++i) {
            await compareAndReplace(i, i + step);
        }
        step = parseInt(step / factor);
    }

    document.querySelectorAll(".sorts button").forEach(el => el.disabled = false);
}

// Cортировка перемешиванием

async function shakerSort() {
    let data = await initArray();

    let left = 0;
    let right = data.length - 1;

    while (left <= right) {
        for (let i = right; i > left; --i) {
            await compareAndReplace(i - 1, i);
        }
        await setGreen(left);
        ++left;
        for (let i = left; i < right; ++i) {
            await compareAndReplace(i, i + 1);
        }
        await setGreen(right);
        --right;
    }

    document.querySelectorAll(".sorts button").forEach(el => el.disabled = false);
}

function getValue(i) {
    return document.querySelectorAll(".array div")[i].getAttribute("data-value");
}

// Быстрая сортировка
async function quickSort() {
    let data = await initArray();

    await quickSortPart(0, data.length - 1)

    document.querySelectorAll(".sorts button").forEach(el => el.disabled = false);
}

// Сортировка вставками
async function insertionSort() {
    let data = await initArray();


    for (let i = 1; i < data.length; i++) {
        for (let j = i - 1; j >= 0; j--) {
            if (!await compareAndReplace(j, j + 1)) {
                break;
            }
        }
    }

    document.querySelectorAll(".sorts button").forEach(el => el.disabled = false);
}



async function quickSortPart(start, end) {
    if (start + 1 >= end) {
        await compareAndReplace(start, end)

        return
    }

    let pivotIndex = end - 1;

    for (let i = start; i <= end; i++) {
        if (await compareAndReplace(i, pivotIndex)) {
            if (i < pivotIndex) {
                for (let j = pivotIndex; j > i; j--) {
                    pivotIndex = i;

                    if (await compareAndReplace(j, i)) {
                        pivotIndex = j;
                        break;
                    }
                }
            } else {
                for (let j = pivotIndex; j < i; j++) {
                    pivotIndex = i;

                    if (await compareAndReplace(j, i)) {
                        pivotIndex = j;
                        break;
                    }
                }
            }
        }
    }

    await setGreen(pivotIndex);

    if (start < pivotIndex - 1) {
        await quickSortPart(start, pivotIndex - 1)
    }

    if (pivotIndex + 1 < end) {
        await quickSortPart(pivotIndex + 1, end)
    }
}