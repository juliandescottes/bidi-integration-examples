/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const pageMarkup = `
  <style>
    form {
      /* Just to center the form on the page */
      margin: 0 auto;
      width: 400px;

      /* To see the limits of the form */
      padding: 1em;
      border: 1px solid #ccc;
      border-radius: 1em;
    }

    div + div {
      margin-top: 1em;
    }

    label {
      /* To make sure that all label have the same size and are properly align */
      display: inline-block;
      width: 90px;
      text-align: right;
    }

    input,
    textarea {
      /* To make sure that all text field have the same font settings
         By default, textarea are set with a monospace font */
      font: 1em sans-serif;

      /* To give the same size to all text field */
      width: 300px;

      -moz-box-sizing: border-box;
      box-sizing: border-box;

      /* To harmonize the look & feel of text field border */
      border: 1px solid #999;
    }

    input:focus,
    textarea:focus {
      /* To give a little highlight on active elements */
      border-color: #000;
    }

    textarea {
      /* To properly align multiline text field with their label */
      vertical-align: top;

      /* To give enough room to type some text */
      height: 5em;

      /* To allow users to resize any textarea vertically
         It works only on Chrome, Firefox and Safari */
      resize: vertical;
    }

    .button {
      /* To position the buttons to the same position of the text fields */
      padding-left: 90px; /* same size as the label elements */
    }

    button {
      /* This extra margin represent the same space as the space between
         the labels and their text fields */
      margin-left: 0.5em;
    }
  </style>
  <form action="/my-handling-form-page" method="post" id="form">
    <div>
      <label for="name">Name:</label>
      <input type="text" id="name" name="user_name" />
    </div>

    <div>
      <label for="mail">Email:</label>
      <input type="email" id="mail" name="user_email" />
    </div>

    <div>
      <label for="msg">Message:</label>
      <textarea id="msg" name="user_message"></textarea>
    </div>

    <div class="button">
      <button type="submit">Send your message</button>
    </div>
  </form>
`;

exports.pageMarkup = pageMarkup;