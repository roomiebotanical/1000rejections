// ==================================================
// 1000 REJECTIONS
// PUBLIC DASHBOARD
// ==================================================

import {
  supabase
} from "./supabase.js";



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
        "date",
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
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}



/* ==================================================
   RENDER DASHBOARD
================================================== */

function renderDashboard(
  asks
) {

  const goal = 1000;


  const total =
    asks.length;


  const yes =
    asks.filter(
      ask =>
        ask.result === "YES"
    ).length;


  const no =
    asks.filter(
      ask =>
        ask.result === "NO"
    ).length;


  const ghosted =
    asks.filter(
      ask =>
        ask.result === "GHOSTED"
    ).length;



  /* ----------------------------------------------
     AVERAGE FEAR
  ---------------------------------------------- */

  const totalFear =
    asks.reduce(
      (sum, ask) =>
        sum +
        Number(
          ask.fear || 0
        ),
      0
    );


  const averageFear =
    total > 0
      ? totalFear / total
      : 0;



  /* ----------------------------------------------
     PROGRESS
  ---------------------------------------------- */

  const percentage =
    Math.min(
      (total / goal) * 100,
      100
    );


  document.getElementById(
    "totalCount"
  ).textContent =
    total;


  document.getElementById(
    "progressFill"
  ).style.width =
    `${percentage}%`;


  document.getElementById(
    "progressText"
  ).textContent =
    `${percentage.toFixed(1)}% completed`;


  document.getElementById(
    "footerCount"
  ).textContent =
    `${total} / ${goal}`;



  /* ----------------------------------------------
     STATS
  ---------------------------------------------- */

  document.getElementById(
    "yesCount"
  ).textContent =
    yes;


  document.getElementById(
    "noCount"
  ).textContent =
    no;


  document.getElementById(
    "ghostedCount"
  ).textContent =
    ghosted;


  document.getElementById(
    "fearAverage"
  ).textContent =
    averageFear.toFixed(1);



  /* ----------------------------------------------
     LATEST ASKS
  ---------------------------------------------- */

  const list =
    document.getElementById(
      "askList"
    );


  const latest =
    asks.slice(0, 5);


  if (latest.length === 0) {

    list.innerHTML = `

      <p class="empty">
        No asks yet.
        Time to make the first one.
      </p>

    `;

  } else {

    list.innerHTML =
      latest.map(
        ask => `

          <article class="ask" data-id="${ask.id}" tabindex="0">
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



  /* ----------------------------------------------
     BIGGEST REJECTION
  ---------------------------------------------- */

  const biggest =
    asks
      .filter(
        ask =>
          ask.result === "NO"
      )
      .sort(
        (a, b) =>
          Number(b.fear) -
          Number(a.fear)
      )[0];


  const featuredAsk =
    document.getElementById(
      "featuredAsk"
    );


  const featuredMeta =
    document.getElementById(
      "featuredMeta"
    );


  if (!biggest) {

    featuredAsk.textContent =
      "Your biggest rejection will appear here.";

    featuredMeta.innerHTML =
      "";

    return;

  }


  featuredAsk.textContent =
    biggest.ask;


  featuredMeta.innerHTML = `

    <span>

      FEAR BEFORE:

      <strong>
        ${biggest.fear}/10
      </strong>

    </span>


    <span>

      RESULT:

      <strong>
        NO
      </strong>

    </span>

  `;

}



/* ==================================================
   DETAIL MODAL
================================================== */

let allAsks = [];


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


  const modal =
    document.getElementById(
      "detailModal"
    );


  modal.hidden = false;

  modal.classList.add(
    "is-open"
  );


  document.body.style.overflow =
    "hidden";

}


function closeModal() {

  const modal =
    document.getElementById(
      "detailModal"
    );


  modal.hidden = true;

  modal.classList.remove(
    "is-open"
  );


  document.body.style.overflow =
    "";

}


function setUpModalEvents() {

  const list =
    document.getElementById(
      "askList"
    );


  const modal =
    document.getElementById(
      "detailModal"
    );


  const closeModalButton =
    document.getElementById(
      "closeModal"
    );


  function openFromElement(
    item
  ) {

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


  list.addEventListener(
    "click",
    (event) => {

      const item =
        event.target.closest(
          ".ask"
        );


      if (!item) return;


      openFromElement(item);

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
          ".ask"
        );


      if (!item) return;


      event.preventDefault();


      openFromElement(item);

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

}



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


  setUpModalEvents();


  if (error) {

    const list =
      document.getElementById(
        "askList"
      );

    list.innerHTML = `

      <p class="empty">
        Could not load your data: ${error.message}.
        Check the browser console for details.
      </p>

    `;

  }


  renderDashboard(
    asks
  );

}


init();