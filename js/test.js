
const arr = ["hello", "bondhu", "kutte"];

const htmlElements = (arr) => {
    const elements = arr.map(el => `<span class="btn">${el}</span>`);
    return  elements.join(" ");
}
console.log(htmlElements(arr));