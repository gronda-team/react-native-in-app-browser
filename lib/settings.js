"use strict";
/**
 * Copyright (c) 2018-2020, Matei Bogdan Radu <opensource@mateiradu.dev>
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree.
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var tinycolor_1 = require("@ctrl/tinycolor");
var iosDismissButtonStyles = ['done', 'close', 'cancel'];
/**
 * Default settings.
 *
 * These values can be augmented throgh initialization.
 */
exports.defaultSettings = {
    android: {},
    ios: {},
};
function sanitizeAndroid(settings) {
    var sanitized = __assign({}, exports.defaultSettings.android);
    if (!settings) {
        return sanitized;
    }
    var toolbarColor = new tinycolor_1.TinyColor(settings.toolbarColor);
    if (toolbarColor.isValid) {
        sanitized.toolbarColor = toolbarColor.toHexString();
    }
    if (typeof settings.showTitle === 'boolean') {
        sanitized.showTitle = settings.showTitle;
    }
    if (settings.closeButtonIcon) {
        sanitized.closeButtonIcon = react_native_1.Image.resolveAssetSource(settings.closeButtonIcon).uri;
    }
    if (typeof settings.addDefaultShareMenu === 'boolean') {
        sanitized.addDefaultShareMenu = settings.addDefaultShareMenu;
    }
    return sanitized;
}
function sanitizeIOS(settings) {
    var sanitized = __assign({}, exports.defaultSettings.ios);
    if (!settings) {
        return sanitized;
    }
    var colors = ['preferredBarTintColor', 'preferredControlTintColor'];
    colors.forEach(function (color) {
        var parsedColor = new tinycolor_1.TinyColor(settings[color]);
        if (parsedColor.isValid) {
            sanitized[color] = parsedColor.toHexString();
        }
    });
    if (typeof settings.barCollapsingEnabled === 'boolean') {
        sanitized.barCollapsingEnabled = settings.barCollapsingEnabled;
    }
    if (typeof settings.entersReaderIfAvailable === 'boolean') {
        sanitized.entersReaderIfAvailable = settings.entersReaderIfAvailable;
    }
    if (settings.dismissButtonStyle && iosDismissButtonStyles.includes(settings.dismissButtonStyle)) {
        sanitized.dismissButtonStyle = settings.dismissButtonStyle;
    }
    return sanitized;
}
function sanitize(os, settings) {
    var _a, _b;
    switch (os) {
        case 'android':
            return sanitizeAndroid((_a = settings) === null || _a === void 0 ? void 0 : _a.android);
        case 'ios':
            return sanitizeIOS((_b = settings) === null || _b === void 0 ? void 0 : _b.ios);
        // Other platforms in the future.
        default:
            return {};
    }
}
exports.sanitize = sanitize;
/**
 * Initializes the platform-specific settings for the in-app browser
 * experience.
 *
 * This utility function is useful when `openInApp` is used in several
 * portions of the application code base as it allows to provide the
 * settings only once instead of specifing them with each call.
 */
function initialize(settings) {
    // First, reset directly as `sanitize` will otherwise merge with
    // previous defaults: it would not be possible to remove properties.
    exports.defaultSettings.android = {};
    exports.defaultSettings.ios = {};
    exports.defaultSettings.android = sanitize('android', settings);
    exports.defaultSettings.ios = sanitize('ios', settings);
}
exports.initialize = initialize;
