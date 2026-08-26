// ==================================================
// 1000 REJECTIONS
// PRIVATE LOGGING APP
// ==================================================

import {
  supabase
} from "./supabase.js";



/* ==================================================
   ELEMENTS
================================================== */

const form =
  document.getElementById(
    "logForm"
  );


const fear =
  document.getElementById(
    "fear"
  );


const fearNumber =
  document.getElementById(
    "fearNumber"
  );


const dateInput =
  document.getElementById(
    "date"
  );


const successMessage =
  document.getElementById(
    "successMessage"
  );



/* ==================================================
   CHECK LOGIN
================================================== */

async function checkLogin() {

  const {
    data: {
      session
    },
    error
  } =
    await supabase.auth.getSession();


  if (error) {

    console.error(
      "Supabase session error:",
      error
    );

  }


  if (!session) {

    window.location.href =
      "login.html";

    return false;

  }


  return true;

}



const loggedIn =
  await checkLogin();


if (!loggedIn) {

  throw new Error(
    "User is not logged in."
  );

}



/* ==================================================
   SHOW TODAY'S DATE
================================================== */

dateInput.value =
  new Date()
    .toISOString()
    .split("T")[0];



/* ==================================================
   FEAR SLIDER
================================================== */

fear.addEventListener(
  "input",
  () => {

    fearNumber.textContent =
      fear.value;

  }
);



/* ==================================================
   SAVE ASK
================================================== */

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    successMessage.textContent =
      "Saving...";


    /* ----------------------------------------------
       GET CURRENT USER
    ---------------------------------------------- */

    const {
      data: {
        user
      }
    } =
      await supabase.auth.getUser();


    if (!user) {

      window.location.href =
        "login.html";

      return;

    }



    /* ----------------------------------------------
       GET FORM VALUES
    ---------------------------------------------- */

    const ask =
      document.getElementById(
        "ask"
      ).value.trim();


    const category =
      document.getElementById(
        "category"
      ).value;


    const platform =
      document.getElementById(
        "platform"
      ).value.trim();


    const resultElement =
      document.querySelector(
        'input[name="result"]:checked'
      );


    const fearValue =
      Number(
        fear.value
      );


    const date =
      dateInput.value;


    const notes =
      document.getElementById(
        "notes"
      ).value.trim();



    /* ----------------------------------------------
       VALIDATION
    ---------------------------------------------- */

    if (!ask) {

      successMessage.textContent =
        "Tell me what you asked.";

      return;

    }


    if (!platform) {

      successMessage.textContent =
        "Where did you make the ask?";

      return;

    }


    if (!resultElement) {

      successMessage.textContent =
        "Choose a result.";

      return;

    }


    if (!date) {

      successMessage.textContent =
        "Choose a date.";

      return;

    }



    /* ----------------------------------------------
       INSERT INTO SUPABASE
    ---------------------------------------------- */

    const {
      data,
      error
    } =
      await supabase
        .from("asks")
        .insert({

          ask: ask,

          category: category,

          platform: platform,

          result:
            resultElement.value,

          fear: fearValue,

          date: date,

          notes:
            notes || null

        })
        .select()
        .single();



    /* ----------------------------------------------
       ERROR
    ---------------------------------------------- */

    if (error) {

      console.error(
        "Supabase error:",
        error
      );


      successMessage.textContent =
        `Something went wrong: ${error.message}`;

      return;

    }



    /* ----------------------------------------------
       SUCCESS
    ---------------------------------------------- */

    const entryNumber =
      data.id;


    successMessage.textContent =
      `#${String(entryNumber).padStart(3, "0")} logged. Keep asking.`;



    /* ----------------------------------------------
       RESET FORM
    ---------------------------------------------- */

    form.reset();


    fear.value = 7;

    fearNumber.textContent = 7;


    dateInput.value =
      new Date()
        .toISOString()
        .split("T")[0];


    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  }
);