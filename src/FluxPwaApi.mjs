import { PWA_LOCALIZATION_MODULE } from "./Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("../../flux-css-api/src/FluxCssApi.mjs").FluxCssApi} FluxCssApi */
/** @typedef {import("../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../../flux-loading-api/src/FluxLoadingApi.mjs").FluxLoadingApi} FluxLoadingApi */
/** @typedef {import("../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("../../flux-settings-api/src/FluxSettingsApi.mjs").FluxSettingsApi} FluxSettingsApi */
/** @typedef {import("./Pwa/setHideConfirm.mjs").setHideConfirm} setHideConfirm */
/** @typedef {import("./Pwa/_showInstallConfirm.mjs").showInstallConfirm} showInstallConfirm */
/** @typedef {import("./Pwa/_showUpdateConfirm.mjs").showUpdateConfirm} showUpdateConfirm */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class FluxPwaApi {
    /**
     * @type {FluxCssApi | null}
     */
    #flux_css_api;
    /**
     * @type {FluxHttpApi | null}
     */
    #flux_http_api;
    /**
     * @type {FluxLoadingApi | null}
     */
    #flux_loading_api;
    /**
     * @type {FluxLocalizationApi | null}
     */
    #flux_localization_api;
    /**
     * @type {FluxSettingsApi | null}
     */
    #flux_settings_api;

    /**
     * @param {FluxCssApi | null} flux_css_api
     * @param {FluxHttpApi | null} flux_http_api
     * @param {FluxLoadingApi | null} flux_loading_api
     * @param {FluxLocalizationApi | null} flux_localization_api
     * @param {FluxSettingsApi | null} flux_settings_api
     * @returns {FluxPwaApi}
     */
    static new(flux_css_api = null, flux_http_api = null, flux_loading_api = null, flux_localization_api = null, flux_settings_api = null) {
        return new this(
            flux_css_api,
            flux_http_api,
            flux_loading_api,
            flux_localization_api,
            flux_settings_api
        );
    }

    /**
     * @param {FluxCssApi | null} flux_css_api
     * @param {FluxHttpApi | null} flux_http_api
     * @param {FluxLoadingApi | null} flux_loading_api
     * @param {FluxLocalizationApi | null} flux_localization_api
     * @param {FluxSettingsApi | null} flux_settings_api
     * @private
     */
    constructor(flux_css_api, flux_http_api, flux_loading_api, flux_localization_api, flux_settings_api) {
        this.#flux_css_api = flux_css_api;
        this.#flux_http_api = flux_http_api;
        this.#flux_loading_api = flux_loading_api;
        this.#flux_localization_api = flux_localization_api;
        this.#flux_settings_api = flux_settings_api;
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        if (this.#flux_css_api !== null) {
            addEventListener("touchstart", () => {

            });

            this.#flux_css_api.importCssToRoot(
                document,
                `${__dirname}/Pwa/PwaVariables.css`
            );
            this.#flux_css_api.importCssToRoot(
                document,
                `${__dirname}/Pwa/PwaConfirmVariables.css`
            );
        }

        if (this.#flux_localization_api !== null) {
            await this.#flux_localization_api.addModule(
                `${__dirname}/Localization`,
                PWA_LOCALIZATION_MODULE
            );
        }
    }

    /**
     * @param {string} manifest_json_file
     * @returns {Promise<void>}
     */
    async initPwa(manifest_json_file) {
        if (this.#flux_http_api === null) {
            throw new Error("Missing FluxHttpApi");
        }
        if (this.#flux_localization_api === null) {
            throw new Error("Missing FluxLocalizationApi");
        }

        await (await import("./Pwa/InitPwa.mjs")).InitPwa.new(
            this.#flux_http_api,
            this.#flux_localization_api
        )
            .initPwa(
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
        if (this.#flux_settings_api === null) {
            throw new Error("Missing FluxSettingsApi");
        }

        await (await import("./Pwa/InitServiceWorker.mjs")).InitServiceWorker.new(
            this.#flux_settings_api
        )
            .initServiceWorker(
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
        return (await import("./Pwa/ShowInstallConfirm.mjs")).ShowInstallConfirm.new(
            this
        )
            .showInstallConfirm(
                set_hide_confirm
            );
    }

    /**
     * @param {string} info_text
     * @param {string} confirm_text
     * @param {string} cancel_text
     * @param {setHideConfirm | null} set_hide_confirm
     * @returns {Promise<boolean>}
     */
    async showPwaConfirm(info_text, confirm_text, cancel_text, set_hide_confirm = null) {
        if (this.#flux_css_api === null) {
            throw new Error("Missing FluxCssApi");
        }
        if (this.#flux_localization_api === null) {
            throw new Error("Missing FluxLocalizationApi");
        }

        return (await import("./Pwa/ShowPwaConfirm.mjs")).ShowPwaConfirm.new(
            this.#flux_css_api,
            this.#flux_localization_api
        )
            .showPwaConfirm(
                info_text,
                confirm_text,
                cancel_text,
                set_hide_confirm
            );
    }

    /**
     * @returns {Promise<boolean>}
     */
    async showUpdateConfirm() {
        if (this.#flux_loading_api === null) {
            throw new Error("Missing FluxLoadingApi");
        }

        return (await import("./Pwa/ShowUpdateConfirm.mjs")).ShowUpdateConfirm.new(
            this.#flux_loading_api,
            this
        )
            .showUpdateConfirm();
    }
}
