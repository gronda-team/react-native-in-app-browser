/**
 * Copyright (c) 2018-2020, Matei Bogdan Radu <opensource@mateiradu.dev>
 *
 * This source code is licensed under the MIT license found in the LICENSE
 * file in the root directory of this source tree.
 */

package com.mattblock.reactnative.inappbrowser

import android.content.ComponentName
import android.content.pm.ApplicationInfo
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import androidx.browser.customtabs.CustomTabsCallback
import androidx.browser.customtabs.CustomTabsClient
import androidx.browser.customtabs.CustomTabsIntent
import androidx.browser.customtabs.CustomTabsServiceConnection
import androidx.browser.customtabs.CustomTabsSession
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.PixelUtil
import java.io.IOException
import java.net.URL

class RNInAppBrowserModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    companion object {
        private const val SETTING_COLOR = "toolbarColor"
        private const val SETTING_SHOW_TITLE = "showTitle"
        private const val SETTING_CLOSE_BUTTON = "closeButtonIcon"
        private const val SETTING_SHARE_MENU = "addDefaultShareMenu"

        private val CUSTOMTABS_BROWSERS = listOf(
                "com.android.chrome", // Google Chrome - Stable
                "com.chrome.beta", // Google Chrome - Beta
                "com.chrome.dev", // Google Chrome - Dev
                "com.chrome.canary", // Google Chrome - Canary

                "org.mozilla.firefox", // Mozilla Firefox - Stable
                "org.mozilla.firefox_beta", // Mozilla Firefox - Beta
                "org.mozilla.fennec_aurora", // Mozilla Firefox - Nightly

                "com.sec.android.app.sbrowser" // Samsung Internet
        )
    }

    private var mClient: CustomTabsClient? = null
    private var mSession: CustomTabsSession? = null

    init {
        val packageName = getPreferredBrowserPackageName()

        // The device could have no Custom Tabs compatible browser, in which case `packageName`
        // will be null.
        // See https://github.com/matei-radu/react-native-in-app-browser/issues/75
        packageName?.let { it ->
            CustomTabsClient.bindCustomTabsService(context, it, object : CustomTabsServiceConnection() {
                override fun onCustomTabsServiceConnected(name: ComponentName, client: CustomTabsClient) {
                    mClient = client
                    mSession = client.newSession(CustomTabsCallback())
                }

                override fun onServiceDisconnected(name: ComponentName) {
                    mClient = null
                    mSession = null
                }
            })
        }
    }

    override fun getName() = "RNInAppBrowser"

    @ReactMethod
    fun openInApp(url: String, settings: ReadableMap) {
        val builder = CustomTabsIntent.Builder(mSession)

        if (settings.hasKey(SETTING_COLOR)) {
            val color = Color.parseColor(settings.getString(SETTING_COLOR))
            builder.setToolbarColor(color)
        }

        if (settings.hasKey(SETTING_SHOW_TITLE)) {
            builder.setShowTitle(settings.getBoolean(SETTING_SHOW_TITLE))
        }

        if (settings.hasKey(SETTING_CLOSE_BUTTON)) {
            val uriOrDrawable = settings.getString(SETTING_CLOSE_BUTTON)
            val icon = uriOrDrawable?.let {
                getBitmapFromUriOrDrawable(it)
            }

            icon?.let { it ->
                val sizeInPixels = PixelUtil.toPixelFromDIP(24f).toInt()
                val resizedIcon = Bitmap.createScaledBitmap(it, sizeInPixels, sizeInPixels, false)
                builder.setCloseButtonIcon(resizedIcon)
            }
        }

        if (settings.hasKey(SETTING_SHARE_MENU) && settings.getBoolean(SETTING_SHARE_MENU)) {
            builder.addDefaultShareMenuItem()
        }

        val customTabsIntent = builder.build()
        customTabsIntent.launchUrl(currentActivity, Uri.parse(url))
    }

    @ReactMethod
    fun warmup(promise: Promise) {
        try {
            promise.resolve(mClient!!.warmup(0))
        } catch (e: NullPointerException) {
            promise.resolve(e)
        }
    }

    @ReactMethod
    fun mayLaunchUrl(url: String, otherLikelyUrls: ReadableArray, promise: Promise) {
        val additionalUris = createOtherLikelyUrlBundles(otherLikelyUrls)
        promise.resolve(mSession?.mayLaunchUrl(Uri.parse(url), null, additionalUris) ?: false)
    }

    private fun getBitmapFromUriOrDrawable(uriOrDrawable: String): Bitmap? {
        return if (isDebug()) {
            getBitmapFromUri(uriOrDrawable)
        } else {
            getBitmapFromDrawable(uriOrDrawable)
        }
    }

    /**
     * Load image from development server.
     */
    private fun getBitmapFromUri(uri: String): Bitmap? {
        return try {
            val url = URL(uri)
            val connection = url.openConnection()
            BitmapFactory.decodeStream(connection.getInputStream())
        } catch (e: IOException) {
            null
        }
    }

    private fun getBitmapFromDrawable(drawableName: String): Bitmap? {
        return this.currentActivity?.let { activity ->
            BitmapFactory.decodeResource(
                    activity.resources,
                    activity.resources?.getIdentifier(drawableName, "drawable", activity.packageName)!!
            )
        }
    }

    private fun getPreferredBrowserPackageName() =
            CustomTabsClient.getPackageName(this.reactApplicationContext, CUSTOMTABS_BROWSERS)

    private fun createOtherLikelyUrlBundles(otherLikelyUrls: ReadableArray): List<Bundle>? {
        if (otherLikelyUrls.size() == 0) {
            return null
        }

        return List(otherLikelyUrls.size()) {
            val bundle = Bundle()
            bundle.putString("url", otherLikelyUrls.getString(it))
            bundle
        }
    }

    /**
     * Since this is a separate module, [BuildConfig.DEBUG] is not reliable.
     *
     * @see [https://medium.com/@elye.project/checking-debug-build-the-right-way-d12da1098120]
     */
    private fun isDebug() = this.reactApplicationContext.applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE != 0
}
