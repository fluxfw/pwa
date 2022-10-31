/** @typedef {import("../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../flux-json-api/src/Adapter/Api/JsonApi.mjs").JsonApi} JsonApi */
/** @typedef {import("../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").JsonApi} LocalizationApi */
/** @typedef {import("../../Service/Pwa/Port/PwaService.mjs").PwaService} PwaService */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class PwaApi {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {JsonApi}
     */
    #json_api;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
    /**
     * @type {PwaService | null}
     */
    #pwa_service = null;

    /**
     * @param {CssApi} css_api
     * @param {JsonApi} json_api
     * @param {LocalizationApi} localization_api
     * @returns {PwaApi}
     */
    static new(css_api, json_api, localization_api) {
        return new this(
            css_api,
            json_api,
            localization_api
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {JsonApi} json_api
     * @param {LocalizationApi} localization_api
     * @private
     */
    constructor(css_api, json_api, localization_api) {
        this.#css_api = css_api;
        this.#json_api = json_api;
        this.#localization_api = localization_api;
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        addEventListener("touchstart", () => {

        });

        this.#css_api.importCssToRoot(
            document,
            `${__dirname}/../Pwa/PwaVariables.css`
        );
    }

    /**
     * @param {string} manifest_json_file
     * @returns {Promise<void>}
     */
    async initPwa(manifest_json_file) {
        await (await this.#getPwaService()).initPwa(
            manifest_json_file
        );
    }

    /**
     * @returns {Promise<PwaService>}
     */
    async #getPwaService() {
        this.#pwa_service ??= (await import("../../Service/Pwa/Port/PwaService.mjs")).PwaService.new(
            this.#json_api,
            this.#localization_api
        );

        return this.#pwa_service;
    }
}
