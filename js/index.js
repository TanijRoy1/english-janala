// console.log("writting js");

const htmlElements = (arr) => {
    const elements = arr.map(el => `<span class="btn">${el}</span>`);
    return  elements.join(" ");
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const loadLevels = () => {
  const url = "https://openapi.programming-hero.com/api/levels/all";
  fetch(url)
    .then((res) => res.json())
    .then((json) => displayLevels(json.data));
};

const displayLevels = (ids) => {
  const levelContainer = document.getElementById("lesson-container");
  levelContainer.innerHTML = "";

  for (const id of ids) {
    const levelBtn = document.createElement("div");
    levelBtn.innerHTML = `<button id="lesson-${id.level_no}" onclick="loadLevelWords('${id.level_no}')" class="lesson btn btn-outline btn-primary">
                              <i class="fa-solid fa-book-open"></i>
                              Lesson-${id.level_no}
                          </button>
                         `;

    levelContainer.appendChild(levelBtn);
  }
};

const loadLevelWords = async (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  const res = await fetch(url);
  const data = await res.json();

  displayLevelWords(data.data);

  const allLessons = document.querySelectorAll(".lesson");
  allLessons.forEach((lesson) => {
    lesson.classList.remove("active");
  });
  document.getElementById(`lesson-${id}`).classList.add("active");
};

const displayLevelWords = (words) => {
  const levelWordsContainer = document.getElementById("level-words-container");
  levelWordsContainer.innerHTML = "";

  if (words.length === 0) {
    levelWordsContainer.innerHTML = `<div class="py-12 col-span-3">
                                             <img src="./assets/alert-error.png" class="mx-auto" alt="">
                                             <p class="text-gray-600 font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                                             <h1 class="font-semibold text-4xl mt-3.5 font-bangla">নেক্সট Lesson এ যান</h1>
                                         </div>`;
    manageSpinner(false);
    return;
  }

  words.forEach((word) => {
    const div = document.createElement("div");
    div.innerHTML = `<div class="bg-white rounded-xl space-y-5 py-10 px-5 shadow-sm">
                             <h1 class="text-2xl font-bold">${
                               word.word ? word.word : "শব্দটি পাওয়া যায়নি"
                             }</h1> 
                             <p class="font-medium">Meaning /Pronounciation</p>
                            <h1 class="text-2xl font-bold font-bangla text-gray-700">"${
                              word.meaning ? word.meaning : "অর্থটি পাওয়া যায়নি"
                            } / ${
      word.pronunciation ? word.pronunciation : "উচ্চারণটি পাওয়া যায়নি"
    }"</h1>
                            <div class="flex items-center justify-between">
                                <button onclick="loadWordDetails(${word.id})" class="btn bg-blue-100 hover:bg-blue-300"><i class="fa-solid fa-circle-info"></i></button>
                                <button onclick="pronounceWord('${word.word}')" class="btn bg-blue-100 hover:bg-blue-300"><i class="fa-solid fa-volume-high"></i></button>
                             </div>
                        </div>`;
    levelWordsContainer.appendChild(div);
  });
  manageSpinner(false);
};

const loadWordDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  displayWordDetails(data.data);
};

const displayWordDetails = (data) => {
  const modalBox = document.getElementById("modal-box");
  modalBox.innerHTML = `<div class="space-y-4">
          <div>
            <h1 class="font-bold text-2xl">
              <span>${data.word} </span>( <i class="fa-solid fa-microphone-lines"></i><span>:${data.pronunciation}</span> )
            </h1>
          </div>
          <div>
            <p class="font-semibold">Meaning</p>
            <p class="font-bangla font-medium">${data.meaning}</p>
          </div>
          <div>
            <p class="font-semibold">Example</p>
            <p class="font-medium text-gray-700">
              ${data.sentence}
            </p>
          </div>
          <div>
            <p class="font-bangla font-semibold">সমার্থক শব্দ গুলো</p>
            <div>
                ${htmlElements(data.synonyms)}
            </div>
          </div>
        </div>
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
          </form>
        </div>`;
  document.getElementById("my_modal_5").showModal();
};

const manageSpinner = (status) => {
    if (status) {
        document.getElementById("loading").classList.remove("hidden");
        document.getElementById("level-words-container").classList.add("hidden");
    } else {
        document.getElementById("loading").classList.add("hidden");
        document.getElementById("level-words-container").classList.remove("hidden");
    }
}


loadLevels();

document.getElementById("search-btn").addEventListener("click", async () => {
  const input = document.getElementById("search-input");
  const searchValue = input.value.trim().toLowerCase();

  const url = "https://openapi.programming-hero.com/api/words/all";
  const res = await fetch(url);
  const data = await res.json();
  const allWords = data.data;
  // console.log(allWords);
  const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
  console.log(filterWords);
  displayLevelWords(filterWords);
});
