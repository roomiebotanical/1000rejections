// ==================================================
// 1000 REJECTIONS
// FULL WALL + DETAIL VIEW
// ==================================================

import {
  supabase
} from "./supabase.js";



/* ==================================================
   ELEMENTS
================================================== */

const list =
  document.getElementById(
    "wallList"
  );


const modal =
  document.getElementById(
    "detailModal"
  );


const closeModalButton =
  document.getElementById(
    "closeModal"
  );



/* ==================================================
   RESULT LABELS
   (display text only — the stored value in
   Supabase stays "GHOSTED")
================================================== */

function formatResultLabel(
  result
) {

  if (result === "GHOSTED") {

    return "NO RESPONSE (YET)";

  }


  return result;

}



/* ==================================================
   HTML SAFETY
================================================== */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}



/* ==================================================
   LOAD ASKS
================================================== */

async function loadAsks() {

  const {
    data: asks,
    error
  } =
    await supabase
      .from("asks")
      .select("*")
      .order(
        "id",
        {
          ascending: false
        }
      );


  if (error) {

    console.error(
      "Could not load asks:",
      error
    );

    return {
      asks: [],
      error
    };

  }


  return {
    asks: asks || [],
    error: null
  };

}



/* ==================================================
   RENDER LIST
================================================== */

let allAsks = [];


function renderList(
  asks
) {

  if (asks.length === 0) {

    list.innerHTML = `

      <p class="empty">
        No asks yet.
        Time to make the first one.
      </p>

    `;

    return;

  }


  list.innerHTML =
    asks.map(
      ask => `

        <article
          class="wall-item"
          data-id="${ask.id}"
          tabindex="0"
        >

          <div class="ask-number">

            #${String(
              ask.id
            ).padStart(3, "0")}

          </div>


          <div class="ask-content">

            <h3>
              ${escapeHTML(
                ask.ask
              )}
            </h3>


            <p>

              ${escapeHTML(
                ask.category
              )}

              ·

              ${escapeHTML(
                ask.platform
              )}

              ·

              ${escapeHTML(
                ask.date
              )}

            </p>

          </div>


          <div
            class="result ${ask.result.toLowerCase()}"
          >

            ${formatResultLabel(ask.result)}

          </div>

        </article>

      `
    ).join("");

}



/* ==================================================
   OPEN / CLOSE MODAL
================================================== */

function openModal(
  ask
) {

  document.getElementById(
    "modalNumber"
  ).textContent =
    `ENTRY #${String(ask.id).padStart(3, "0")}`;


  document.getElementById(
    "modalAsk"
  ).textContent =
    ask.ask;


  document.getElementById(
    "modalCategory"
  ).textContent =
    ask.category;


  document.getElementById(
    "modalPlatform"
  ).textContent =
    ask.platform;


  document.getElementById(
    "modalResult"
  ).textContent =
    formatResultLabel(ask.result);


  document.getElementById(
    "modalFear"
  ).textContent =
    `${ask.fear}/10`;


  document.getElementById(
    "modalDate"
  ).textContent =
    ask.date;


  const notesWrap =
    document.getElementById(
      "modalNotesWrap"
    );


  const notesText =
    document.getElementById(
      "modalNotes"
    );


  if (ask.notes) {

    notesWrap.hidden = false;

    notesText.textContent =
      ask.notes;

  } else {

    notesWrap.hidden = true;

  }


  modal.hidden = false;

  modal.classList.add(
    "is-open"
  );


  document.body.style.overflow =
    "hidden";

}


function closeModal() {

  modal.hidden = true;

  modal.classList.remove(
    "is-open"
  );


  document.body.style.overflow =
    "";

}



/* ==================================================
   EVENTS
================================================== */

list.addEventListener(
  "click",
  (event) => {

    const item =
      event.target.closest(
        ".wall-item"
      );


    if (!item) return;


    const id =
      Number(
        item.dataset.id
      );


    const ask =
      allAsks.find(
        a => a.id === id
      );


    if (ask) openModal(ask);

  }
);


list.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key !== "Enter" &&
      event.key !== " "
    ) return;


    const item =
      event.target.closest(
        ".wall-item"
      );


    if (!item) return;


    event.preventDefault();


    const id =
      Number(
        item.dataset.id
      );


    const ask =
      allAsks.find(
        a => a.id === id
      );


    if (ask) openModal(ask);

  }
);


closeModalButton.addEventListener(
  "click",
  closeModal
);


modal.addEventListener(
  "click",
  (event) => {

    if (event.target === modal) {

      closeModal();

    }

  }
);


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      !modal.hidden
    ) {

      closeModal();

    }

  }
);



/* ==================================================
   START
================================================== */

async function init() {

  const {
    asks,
    error
  } =
    await loadAsks();


  allAsks = asks;


  if (error) {

    list.innerHTML = `

      <p class="empty">
        Could not load your data: ${escapeHTML(error.message)}.
        Check the browser console for details.
      </p>

    `;

    return;

  }


  renderList(asks);

}


init();
