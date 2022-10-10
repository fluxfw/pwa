import { CONTENT_TYPE_JSON } from "../../../../../flux-fetch-api/src/Adapter/ContentType/CONTENT_TYPE.mjs";

/** @typedef {import("../../../Adapter/Pwa/getBackgroundColor.mjs").getBackgroundColor} getBackgroundColor */
/** @typedef {import("../../../Adapter/Pwa/getDirection.mjs").getDirection} getDirection */
/** @typedef {import("../../../Adapter/Pwa/getLanguage.mjs").getLanguage} getLanguage */
/** @typedef {import("../../../Adapter/Pwa/getThemeColor.mjs").getThemeColor} getThemeColor */
/** @typedef {import("../../../Adapter/Pwa/getTranslatedText.mjs").getTranslatedText} getTranslatedText */
/** @typedef {import("../../../../../flux-json-api/src/Adapter/Api/JsonApi.mjs").JsonApi} JsonApi */

export class InitPwaCommand {
    /**
     * @type {getBackgroundColor | null}
     */
    #get_background_color;
    /**
     * @type {getDirection | null}
     */
    #get_direction;
    /**
     * @type {getLanguage | null}
     */
    #get_language;
    /**
     * @type {getThemeColor | null}
     */
    #get_theme_color;
    /**
     * @type {getTranslatedText | null}
     */
    #get_translated_text;
    /**
     * @type {JsonApi}
     */
    #json_api;
    /**
     * @type {string}
     */
    #manifest_json_file;

    /**
     * @param {JsonApi} json_api
     * @param {string} manifest_json_file
     * @param {getBackgroundColor | null} get_background_color
     * @param {getDirection | null} get_direction
     * @param {getLanguage | null} get_language
     * @param {getThemeColor | null} get_theme_color
     * @param {getTranslatedText | null} get_translated_text
     * @returns {InitPwaCommand}
     */
    static new(json_api, manifest_json_file, get_background_color = null, get_direction = null, get_language = null, get_theme_color = null, get_translated_text = null) {
        return new this(
            json_api,
            manifest_json_file,
            get_background_color,
            get_direction,
            get_language,
            get_theme_color,
            get_translated_text
        );
    }

    /**
     * @param {JsonApi} json_api
     * @param {string} manifest_json_file
     * @param {getBackgroundColor | null} get_background_color
     * @param {getDirection | null} get_direction
     * @param {getLanguage | null} get_language
     * @param {getThemeColor | null} get_theme_color
     * @param {getTranslatedText | null} get_translated_text
     * @private
     */
    constructor(json_api, manifest_json_file, get_background_color, get_direction, get_language, get_theme_color, get_translated_text) {
        this.#json_api = json_api;
        this.#manifest_json_file = manifest_json_file;
        this.#get_background_color = get_background_color;
        this.#get_direction = get_direction;
        this.#get_language = get_language;
        this.#get_theme_color = get_theme_color;
        this.#get_translated_text = get_translated_text;
    }

    /**
     * @returns {Promise<void>}
     */
    async initPwa() {
        const viewport_meta = document.head.querySelector("meta[name=viewport]") ?? document.createElement("meta");
        viewport_meta.content = Object.entries({
            "initial-scale": "1.0",
            "maximum-scale": "1.0",
            "minimum-scale": "1.0",
            "user-scalable": "no"
        }).map(([
            key,
            value
        ]) => `${key}=${value}`).join(",");
        viewport_meta.name = "viewport";
        if (!viewport_meta.isConnected) {
            document.head.appendChild(viewport_meta);
        }

        const manifest = structuredClone(await this.#json_api.importJson(
            this.#manifest_json_file
        ));

        manifest.lang ??= "";
        if (this.#get_language !== null) {
            manifest.lang = this.#get_language();
        }
        document.documentElement.lang = manifest.lang;

        manifest.dir ??= "";
        if (this.#get_direction !== null) {
            manifest.dir = this.#get_direction();
        }
        document.documentElement.dir = manifest.dir;

        manifest.description ??= "";
        if (this.#get_translated_text !== null) {
            manifest.description = this.#get_translated_text(
                manifest.description
            );
        }

        manifest.name ??= "";
        if (this.#get_translated_text !== null) {
            manifest.name = this.#get_translated_text(
                manifest.name
            );
        }
        document.title = manifest.name;

        manifest.short_name ??= "";
        if (this.#get_translated_text !== null) {
            manifest.short_name = this.#get_translated_text(
                manifest.short_name
            );
        }

        manifest.start_url = this.#fixUrl(
            manifest.start_url ?? null
        );

        manifest.scope = this.#fixUrl(
            manifest.scope ?? null
        );

        const icon_links = [
            ...document.head.querySelectorAll("link[rel=icon]")
        ];
        let last_icon_link = null;
        manifest.icons ??= [];
        for (const icon of manifest.icons) {
            const icon_link = icon_links.shift() ?? document.createElement("link");

            icon.src = this.#fixUrl(
                icon.src ?? null
            );
            icon_link.href = icon.src;

            icon_link.rel = "icon";

            icon.sizes ??= "";
            icon_link.sizes = icon.sizes;

            icon.type ??= "";
            icon_link.type = icon.type;

            if (!icon_link.isConnected) {
                if (last_icon_link !== null) {
                    last_icon_link.insertAdjacentElement("afterend", icon_link);
                } else {
                    document.head.appendChild(icon_link);
                }
            }

            last_icon_link = icon_link;
        }
        for (const icon_link of icon_links) {
            icon_link.remove();
        }

        manifest.background_color ??= "";
        if (this.#get_background_color !== null) {
            manifest.background_color = this.#get_background_color();
        }

        manifest.theme_color ??= "";
        if (this.#get_theme_color !== null) {
            manifest.theme_color = this.#get_theme_color();
        }

        const manifest_link = document.head.querySelector("link[rel=manifest]") ?? document.createElement("link");
        manifest_link.href = `data:${CONTENT_TYPE_JSON};charset=utf-8;base64,${btoa(JSON.stringify(manifest))}`;
        manifest_link.rel = "manifest";
        if (!manifest_link.isConnected) {
            document.head.appendChild(manifest_link);
        }
    }

    /**
     * @param {string | null} url
     * @returns {string | URL}
     */
    #fixUrl(url = null) {
        if (url === null || url.includes("://") || url.startsWith("/")) {
            return url ?? "";
        }

        return new URL(`${this.#manifest_json_file.substring(0, this.#manifest_json_file.lastIndexOf("/"))}/${url}`);
    }
}
