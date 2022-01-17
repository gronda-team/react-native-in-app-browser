"use strict";
/**
 * Copyright (c) 2018-2020, Matei Bogdan Radu <opensource@mateiradu.dev>
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Checks if a url is HTTP or HTTPS.
 *
 * Other protocols are not supported by both platforms.
 */
function isUrlValid(url) {
    return RegExp(/^(http|https):\/\//).test(url);
}
exports.isUrlValid = isUrlValid;
