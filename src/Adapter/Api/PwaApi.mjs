import { PWA_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../flux-json-api/src/Adapter/Api/JsonApi.mjs").JsonApi} JsonApi */
/** @typedef {import("../../../../flux-loading-api/src/Adapter/Api/LoadingApi.mjs").LoadingApi} LoadingApi */
/** @typedef {import("../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../Service/Pwa/Port/PwaService.mjs").PwaService} PwaService */
/** @typedef {import("../Pwa/setHideConfirm.mjs").setHideConfirm} setHideConfirm */
/** @typedef {import("../../../../flux-settings-api/src/Adapter/Api/SettingsApi.mjs").SettingsApi} SettingsApi */
/** @typedef {import("../Pwa/showInstallConfirm.mjs").showInstallConfirm} showInstallConfirm */
/** @typedef {import("../Pwa/showUpdateConfirm.mjs").showUpdateConfirm} showUpdateConfirm */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class PwaApi {
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
     * @type {PwaService | null}
     */
    #pwa_service = null;
    /**
     * @type {SettingsApi | null}
     */
    #settings_api;

    /**
     * @param {CssApi | null} css_api
     * @param {JsonApi | null} json_api
     * @param {LoadingApi | null} loading_api
     * @param {LocalizationApi | null} localization_api
     * @param {SettingsApi | null} settings_api
     * @returns {PwaApi}
     */
    static new(css_api = null, json_api = null, loading_api = null, localization_api = null, settings_api = null) {
        return new this(
            css_api,
            json_api,
            loading_api,
            localization_api,
            settings_api
        );
    }

    /**
     * @param {CssApi | null} css_api
     * @param {JsonApi | null} json_api
     * @param {LoadingApi | null} loading_api
     * @param {LocalizationApi | null} localization_api
     * @param {SettingsApi | null} settings_api
     * @private
     */
    constructor(css_api, json_api, loading_api, localization_api, settings_api) {
        this.#css_api = css_api;
        this.#json_api = json_api;
        this.#loading_api = loading_api;
        this.#localization_api = localization_api;
        this.#settings_api = settings_api;
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        if (this.#css_api !== null) {
            addEventListener("touchstart", () => {

            });

            this.#css_api.importCssToRoot(
                document,
                `${__dirname}/../Pwa/PwaVariables.css`
            );
            this.#css_api.importCssToRoot(
                document,
                `${__dirname}/../Pwa/PwaConfirmVariables.css`
            );
        }

        if (this.#localization_api !== null) {
            await this.#localization_api.addModule(
                `${__dirname}/../Localization`,
                PWA_LOCALIZATION_MODULE
            );
        }
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
     * @param {string} service_worker_mjs_file
     * @param {showInstallConfirm | null} show_install_confirm
     * @param {showUpdateConfirm | null} show_update_confirm
     * @returns {Promise<void>}
     */
    async initServiceWorker(service_worker_mjs_file, show_install_confirm = null, show_update_confirm = null) {
        await (await this.#getPwaService()).initServiceWorker(
            service_worker_mjs_file,
            show_install_confirm,
            show_update_confirm
        );
    }

    /**
     * @param {setHideConfirm} set_hide_confirm
     * @returns {Promise<boolean>}
     */
    async showInstallConfirm(set_hide_confirm) {
        return (await this.#getPwaService()).showInstallConfirm(
            set_hide_confirm
        );
    }

    /**
     * @returns {Promise<boolean>}
     */
    async showUpdateConfirm() {
        return (await this.#getPwaService()).showUpdateConfirm();
    }

    /**
     * @returns {Promise<PwaService>}
     */
    async #getPwaService() {
        this.#pwa_service ??= (await import("../../Service/Pwa/Port/PwaService.mjs")).PwaService.new(
            this.#css_api,
            this.#json_api,
            this.#loading_api,
            this.#localization_api,
            this.#settings_api
        );

        return this.#pwa_service;
    }
}
