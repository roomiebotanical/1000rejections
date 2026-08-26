// ==================================================
// 1000 REJECTIONS
// LOGIN
// ==================================================

import {
  supabase
} from "./supabase.js";



const form =
  document.getElementById(
    "loginForm"
  );


const message =
  document.getElementById(
    "loginMessage"
  );



/* ==================================================
   CHECK IF ALREADY LOGGED IN
================================================== */

async function checkExistingLogin() {

  const {
    data: {
      session
    }
  } =
    await supabase.auth.getSession();


  if (session) {

    window.location.href =
      "log.html";

  }

}


checkExistingLogin();



/* ==================================================
   LOGIN
================================================== */

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const email =
      document.getElementById(
        "email"
      ).value.trim();


    const password =
      document.getElementById(
        "password"
      ).value;


    if (!email || !password) {

      message.textContent =
        "Enter your email and password.";

      return;

    }


    message.textContent =
      "Logging in...";


    const {
      data,
      error
    } =
      await supabase.auth.signInWithPassword({

        email: email,

        password: password

      });


    if (error) {

      console.error(
        "Login error:",
        error
      );


      message.textContent =
        "Login failed. Check your email and password.";

      return;

    }


    if (!data.session) {

      message.textContent =
        "Login failed. No session was created.";

      return;

    }


    message.textContent =
      "Welcome back.";


    window.location.href =
      "log.html";

  }
);