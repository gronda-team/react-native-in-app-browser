"use strict";
/**
 * Copyright (c) 2018-2020, Matei Bogdan Radu <opensource@mateiradu.dev>
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var validation_1 = require("./utils/validation");
var settings_1 = require("./settings");
/**
 * In-app browser functionalities.
 */
var InAppBrowser = /** @class */ (function () {
    function InAppBrowser() {
    }
    /**
     * Open a URL in app.
     *
     * @param {string} url http(s) URL to open.
     * @param {Object} settings platform-specific settings for the in-app
     * browsers.
     *
     * @throws If the `url` is not a valid http(s) URL.
     */
    InAppBrowser.open = function (url, settings) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!validation_1.isUrlValid(url)) {
                    throw 'Invalid URL';
                }
                react_native_1.NativeModules.RNInAppBrowser.openInApp(url, settings_1.sanitize(react_native_1.Platform.OS, settings));
                return [2 /*return*/];
            });
        });
    };
    /**
     * Close the current in app browser instance.
     *
     * This feature is iOS only as Chrome Custom Tabs does not support
     * programmatic dismissal.
     */
    InAppBrowser.close = function () {
        if (react_native_1.Platform.OS === 'ios') {
            react_native_1.NativeModules.RNInAppBrowser.closeInApp();
        }
    };
    /**
     * Warm up the browser process.
     *
     * Allows the browser application to pre-initialize itself in the background.
     * Significantly speeds up URL opening in the browser. This is asynchronous
     * and can be called several times.
     *
     * This feature is Android only.
     */
    InAppBrowser.warmup = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (react_native_1.Platform.OS === 'android') {
                    try {
                        return [2 /*return*/, react_native_1.NativeModules.RNInAppBrowser.warmup()];
                    }
                    catch (e) {
                        return [2 /*return*/, false];
                    }
                }
                return [2 /*return*/, false];
            });
        });
    };
    /**
     * Tell the browser of a likely future navigation to a URL.
     *
     * The method `warmup()` has to be called beforehand.
     *
     * Optionally, a list of other likely URLs can be provided. They are treated
     * as less likely than the first one, and have to be sorted in decreasing
     * priority order. These additional URLs may be ignored.All previous calls to
     * this method will be deprioritized.
     *
     * This feature is Android only.
     */
    InAppBrowser.mayLaunchUrl = function (url, additionalUrls) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (react_native_1.Platform.OS === 'android') {
                    return [2 /*return*/, react_native_1.NativeModules.RNInAppBrowser.mayLaunchUrl(url, (additionalUrls !== null && additionalUrls !== void 0 ? additionalUrls : []))];
                }
                return [2 /*return*/, false];
            });
        });
    };
    /**
     * Configure the platform-specific settings for the in-app browser
     * experience.
     *
     * This utility function is useful when `InAppBrowser.open` is used in several
     * portions of the application code base as it allows to provide the
     * settings only once instead of specifing them with each call.
     */
    InAppBrowser.configure = settings_1.initialize;
    return InAppBrowser;
}());
exports.InAppBrowser = InAppBrowser;
