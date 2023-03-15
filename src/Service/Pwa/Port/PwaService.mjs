/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../../flux-http-api/src/Adapter/Api/HttpApi.mjs").HttpApi} HttpApi */
/** @typedef {import("../../../../../flux-loading-api/src/Adapter/Api/LoadingApi.mjs").LoadingApi} LoadingApi */
/** @typedef {import("../../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../../Adapter/Pwa/setHideConfirm.mjs").setHideConfirm} setHideConfirm */
/** @typedef {import("../../../../../flux-settings-api/src/Adapter/Api/SettingsApi.mjs").SettingsApi} SettingsApi */
/** @typedef {import("../../../Adapter/Pwa/showInstallConfirm.mjs").showInstallConfirm} showInstallConfirm */
/** @typedef {import("../../../Adapter/Pwa/showUpdateConfirm.mjs").showUpdateConfirm} showUpdateConfirm */

export class PwaService {
    /**
     * @type {CssApi | null}
     */
    #css_api;
    /**
     * @type {HttpApi | null}
     */
    #http_api;
    /**
     * @type {LoadingApi | null}
     */
    #loading_api;
    /**
     * @type {LocalizationApi | null}
     */
    #localization_api;
    /**
     * @type {SettingsApi | null}
     */
    #settings_api;

    /**
     * @param {CssApi | null} css_api
     * @param {HttpApi | null} http_api
     * @param {LoadingApi | null} loading_api
     * @param {LocalizationApi | null} localization_api
     * @param {SettingsApi | null} settings_api
     * @returns {PwaService}
     */
    static new(css_api = null, http_api = null, loading_api = null, localization_api = null, settings_api = null) {
        return new this(
            css_api,
            http_api,
            loading_api,
            localization_api,
            settings_api
        );
    }

    /**
     * @param {CssApi | null} css_api
     * @param {HttpApi | null} http_api
     * @param {LoadingApi | null} loading_api
     * @param {LocalizationApi | null} localization_api
     * @param {SettingsApi | null} settings_api
     * @private
     */
    constructor(css_api, http_api, loading_api, localization_api, settings_api) {
        this.#css_api = css_api;
        this.#http_api = http_api;
        this.#loading_api = loading_api;
        this.#localization_api = localization_api;
        this.#settings_api = settings_api;
    }

    /**
     * @param {string} manifest_json_file
     * @returns {Promise<void>}
     */
    async initPwa(manifest_json_file) {
        if (this.#http_api === null) {
            throw new Error("Missing HttpApi");
        }
        if (this.#localization_api === null) {
            throw new Error("Missing LocalizationApi");
        }

        await (await import("../Command/InitPwaCommand.mjs")).InitPwaCommand.new(
            this.#http_api,
            this.#localization_api
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
        if (this.#settings_api === null) {
            throw new Error("Missing SettingsApi");
        }

        await (await import("../Command/InitServiceWorkerCommand.mjs")).InitServiceWorkerCommand.new(
            this.#settings_api
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
        return (await import("../Command/ShowInstallConfirmCommand.mjs")).ShowInstallConfirmCommand.new(
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
        if (this.#css_api === null) {
            throw new Error("Missing CssApi");
        }
        if (this.#localization_api === null) {
            throw new Error("Missing LocalizationApi");
        }

        return (await import("../Command/ShowPwaConfirmCommand.mjs")).ShowPwaConfirmCommand.new(
            this.#css_api,
            this.#localization_api
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
        if (this.#loading_api === null) {
            throw new Error("Missing LoadingApi");
        }

        return (await import("../Command/ShowUpdateConfirmCommand.mjs")).ShowUpdateConfirmCommand.new(
            this.#loading_api,
            this
        )
            .showUpdateConfirm();
    }
}
