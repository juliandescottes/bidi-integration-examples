/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const assert = require('assert');

exports.waitUntil = function (predicate, interval = 10) {
  if (predicate()) {
    return Promise.resolve(true);
  }
  return new Promise(resolve => {
    setTimeout(function() {
      waitUntil(predicate, interval).then(() => resolve(true));
    }, interval);
  });
};

exports.wait = function (delay) {
  return new Promise(r => setTimeout(r, delay));
}

exports.assertEqual = function (actual, expected, message) {
  assert.equal(actual, expected, message + " (FAILED)");
  console.log(message);
}

exports.assertOk = function (value, message) {
  assert.ok(value, message + " (FAILED)");
  console.log(message);
}