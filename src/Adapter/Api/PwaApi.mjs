/** @typedef {import("../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../Pwa/getBackgroundColor.mjs").getBackgroundColor} getBackgroundColor */
/** @typedef {import("../Pwa/getDirection.mjs").getDirection} getDirection */
/** @typedef {import("../Pwa/getLanguage.mjs").getLanguage} getLanguage */
/** @typedef {import("../Pwa/getThemeColor.mjs").getThemeColor} getThemeColor */
/** @typedef {import("../Pwa/getTranslatedText.mjs").getTranslatedText} getTranslatedText */
/** @typedef {import("../../../../flux-json-api/src/Adapter/Api/JsonApi.mjs").JsonApi} JsonApi */
/** @typedef {import("../../Service/Pwa/Port/PwaService.mjs").PwaService} PwaService */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class PwaApi {
    /**
     * @type {CssApi}
     */
    #css_api;
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
     * @type {PwaService | null}
     */
    #pwa_service = null;

    /**
     * @param {CssApi} css_api
     * @param {JsonApi} json_api
     * @param {string} manifest_json_file
     * @param {getBackgroundColor | null} get_background_color
     * @param {getDirection | null} get_direction
     * @param {getLanguage | null} get_language
     * @param {getThemeColor | null} get_theme_color
     * @param {getTranslatedText | null} get_translated_text
     * @returns {PwaApi}
     */
    static new(css_api, json_api, manifest_json_file, get_background_color = null, get_direction = null, get_language = null, get_theme_color = null, get_translated_text = null) {
        return new this(
            css_api,
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
     * @param {CssApi} css_api
     * @param {JsonApi} json_api
     * @param {string} manifest_json_file
     * @param {getBackgroundColor | null} get_background_color
     * @param {getDirection | null} get_direction
     * @param {getLanguage | null} get_language
     * @param {getThemeColor | null} get_theme_color
     * @param {getTranslatedText | null} get_translated_text
     * @private
     */
    constructor(css_api, json_api, manifest_json_file, get_background_color, get_direction, get_language, get_theme_color, get_translated_text) {
        this.#css_api = css_api;
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
    async init() {
        this.#css_api.importCssToRoot(
            document,
            `${__dirname}/../Pwa/PwaVariables.css`
        );

        addEventListener("touchstart", () => {

        });
    }

    /**
     * @returns {Promise<void>}
     */
    async initPwa() {
        await (await this.#getPwaService()).initPwa();
    }

    /**
     * @returns {Promise<PwaService>}
     */
    async #getPwaService() {
        this.#pwa_service ??= (await import("../../Service/Pwa/Port/PwaService.mjs")).PwaService.new(
            this.#json_api,
            this.#manifest_json_file,
            this.#get_background_color,
            this.#get_direction,
            this.#get_language,
            this.#get_theme_color,
            this.#get_translated_text
        );

        return this.#pwa_service;
    }
}
