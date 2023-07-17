import { LOCALIZATION_MODULE_PWA } from "./Localization/LOCALIZATION_MODULE.mjs";

/** @typedef {import("../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("./Localization/Localization.mjs").Localization} Localization */
/** @typedef {import("./Pwa/Manifest.mjs").Manifest} Manifest */
/** @typedef {import("./Pwa/setHideConfirm.mjs").setHideConfirm} setHideConfirm */
/** @typedef {import("./SettingsStorage/SettingsStorage.mjs").SettingsStorage} SettingsStorage */
/** @typedef {import("./Pwa/_showInstallConfirm.mjs").showInstallConfirm} showInstallConfirm */
/** @typedef {import("./Pwa/_showUpdateConfirm.mjs").showUpdateConfirm} showUpdateConfirm */

let flux_css_api = null;
try {
    ({
        flux_css_api
    } = await import("../../flux-css-api/src/FluxCssApi.mjs"));
} catch (error) {
    //console.error(error);
}
if (flux_css_api !== null) {
    const root_css = await flux_css_api.import(
        `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/Pwa/FluxPwaApiRoot.css`
    );

    document.adoptedStyleSheets.unshift(root_css);
}

export class FluxPwaApi {
    /**
     * @type {FluxHttpApi | null}
     */
    #flux_http_api;
    /**
     * @type {Localization | null}
     */
    #localization;
    /**
     * @type {Manifest | null}
     */
    #manifest = null;
    /**
     * @type {Map<string, Manifest>}
     */
    #manifests;
    /**
     * @type {SettingsStorage | null}
     */
    #settings_storage;

    /**
     * @param {FluxHttpApi | null} flux_http_api
     * @param {Localization | null} localization
     * @param {SettingsStorage | null} settings_storage
     * @returns {Promise<FluxPwaApi>}
     */
    static async new(flux_http_api = null, localization = null, settings_storage = null) {
        const flux_pwa_api = new this(
            flux_http_api,
            localization,
            settings_storage
        );

        if (flux_pwa_api.#localization !== null) {
            await flux_pwa_api.#localization.addModule(
                `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/Localization`,
                LOCALIZATION_MODULE_PWA
            );
        }

        return flux_pwa_api;
    }

    /**
     * @param {FluxHttpApi | null} flux_http_api
     * @param {Localization | null} localization
     * @param {SettingsStorage | null} settings_storage
     * @private
     */
    constructor(flux_http_api, localization, settings_storage) {
        this.#flux_http_api = flux_http_api;
        this.#localization = localization;
        this.#settings_storage = settings_storage;
        this.#manifests = new Map();

        addEventListener("touchstart", () => {

        });
    }

    /**
     * @returns {Promise<Manifest>}
     */
    async getManifest() {
        if (this.#manifest === null) {
            throw new Error("Missing manifest");
        }

        return this.#manifest;
    }

    /**
     * @param {string} manifest_json_file
     * @returns {Promise<void>}
     */
    async initPwa(manifest_json_file) {
        if (this.#flux_http_api === null) {
            throw new Error("Missing FluxHttpApi");
        }

        this.#manifest = await (await import("./Pwa/InitPwa.mjs")).InitPwa.new(
            this.#flux_http_api,
            this.#manifests,
            this.#localization
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
        if (this.#settings_storage === null) {
            throw new Error("Missing SettingsStorage");
        }

        await (await import("./Pwa/InitServiceWorker.mjs")).InitServiceWorker.new(
            this.#settings_storage
        )
            .initServiceWorker(
                service_worker_mjs_file,
                show_install_confirm,
                show_update_confirm
            );
    }

    /**
     * @param {setHideConfirm} set_hide_confirm
     * @returns {Promise<boolean | null>}
     */
    async showInstallConfirm(set_hide_confirm) {
        if (this.#localization === null) {
            throw new Error("Missing Localization");
        }

        return (await import("./Pwa/ShowInstallConfirm.mjs")).ShowInstallConfirm.new(
            this.#localization
        )
            .showInstallConfirm(
                await this.getManifest(),
                set_hide_confirm
            );
    }

    /**
     * @returns {Promise<boolean>}
     */
    async showUpdateConfirm() {
        if (this.#localization === null) {
            throw new Error("Missing Localization");
        }

        return (await import("./Pwa/ShowUpdateConfirm.mjs")).ShowUpdateConfirm.new(
            this.#localization
        )
            .showUpdateConfirm(
                await this.getManifest()
            );
    }
}
