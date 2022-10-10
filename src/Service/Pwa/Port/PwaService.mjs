import { InitPwaCommand } from "../Command/InitPwaCommand.mjs";

/** @typedef {import("../../../Adapter/Pwa/getBackgroundColor.mjs").getBackgroundColor} getBackgroundColor */
/** @typedef {import("../../../Adapter/Pwa/getDirection.mjs").getDirection} getDirection */
/** @typedef {import("../../../Adapter/Pwa/getLanguage.mjs").getLanguage} getLanguage */
/** @typedef {import("../../../Adapter/Pwa/getThemeColor.mjs").getThemeColor} getThemeColor */
/** @typedef {import("../../../Adapter/Pwa/getTranslatedText.mjs").getTranslatedText} getTranslatedText */
/** @typedef {import("../../../../../flux-json-api/src/Adapter/Api/JsonApi.mjs").JsonApi} JsonApi */

export class PwaService {
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
     * @returns {PwaService}
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
        await InitPwaCommand.new(
            this.#json_api,
            this.#manifest_json_file,
            this.#get_background_color,
            this.#get_direction,
            this.#get_language,
            this.#get_theme_color,
            this.#get_translated_text
        )
            .initPwa();
    }
}
