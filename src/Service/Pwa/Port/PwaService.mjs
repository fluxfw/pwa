/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../../flux-json-api/src/Adapter/Api/JsonApi.mjs").JsonApi} JsonApi */
/** @typedef {import("../../../../../flux-loading-api/src/Adapter/Api/LoadingApi.mjs").LoadingApi} LoadingApi */
/** @typedef {import("../../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../../Adapter/Pwa/showReloadConfirm.mjs").showReloadConfirm} showReloadConfirm */

export class PwaService {
    /**
     * @type {CssApi | null}
     */
    #css_api;
    /**
     * @type {JsonApi | null}
     */
    #json_api;
    /**
     * @type {LoadingApi | null}
     */
    #loading_api;
    /**
     * @type {LocalizationApi | null}
     */
    #localization_api;

    /**
     * @param {CssApi | null} css_api
     * @param {JsonApi | null} json_api
     * @param {LoadingApi | null} loading_api
     * @param {LocalizationApi | null} localization_api
     * @returns {PwaService}
     */
    static new(css_api = null, json_api = null, loading_api = null, localization_api = null) {
        return new this(
            css_api,
            json_api,
            loading_api,
            localization_api
        );
    }

    /**
     * @param {CssApi | null} css_api
     * @param {JsonApi | null} json_api
     * @param {LoadingApi | null} loading_api
     * @param {LocalizationApi | null} localization_api
     * @private
     */
    constructor(css_api, json_api, loading_api, localization_api) {
        this.#css_api = css_api;
        this.#json_api = json_api;
        this.#loading_api = loading_api;
        this.#localization_api = localization_api;
    }

    /**
     * @param {string} manifest_json_file
     * @returns {Promise<void>}
     */
    async initPwa(manifest_json_file) {
        if (this.#json_api === null) {
            throw new Error("Missing JsonApi");
        }
        if (this.#localization_api === null) {
            throw new Error("Missing LocalizationApi");
        }

        await (await import("../Command/InitPwaCommand.mjs")).InitPwaCommand.new(
            this.#json_api,
            this.#localization_api
        )
            .initPwa(
                manifest_json_file
            );
    }

    /**
     * @param {string} service_worker_mjs_file
     * @param {showReloadConfirm | null} show_reload_confirm
     * @returns {Promise<void>}
     */
    async initServiceWorker(service_worker_mjs_file, show_reload_confirm = null) {
        await (await import("../Command/InitServiceWorkerCommand.mjs")).InitServiceWorkerCommand.new()
            .initServiceWorker(
                service_worker_mjs_file,
                show_reload_confirm
            );
    }

    /**
     * @returns {Promise<boolean>}
     */
    async showReloadConfirm() {
        if (this.#css_api === null) {
            throw new Error("Missing CssApi");
        }
        if (this.#loading_api === null) {
            throw new Error("Missing LoadingApi");
        }
        if (this.#localization_api === null) {
            throw new Error("Missing LocalizationApi");
        }

        return (await import("../Command/ShowReloadConfirmCommand.mjs")).ShowReloadConfirmCommand.new(
            this.#css_api,
            this.#loading_api,
            this.#localization_api
        )
            .showReloadConfirm();
    }
}
