/** @typedef {import("../FluxPwaApi.mjs").FluxPwaApi} FluxPwaApi */
/** @typedef {import("./setHideConfirm.mjs").setHideConfirm} setHideConfirm */

export class ShowInstallConfirm {
    /**
     * @type {FluxPwaApi}
     */
    #flux_pwa_api;

    /**
     * @param {FluxPwaApi} flux_pwa_api
     * @returns {ShowInstallConfirm}
     */
    static new(flux_pwa_api) {
        return new this(
            flux_pwa_api
        );
    }

    /**
     * @param {FluxPwaApi} flux_pwa_api
     * @private
     */
    constructor(flux_pwa_api) {
        this.#flux_pwa_api = flux_pwa_api;
    }

    /**
     * @param {setHideConfirm} set_hide_confirm
     * @returns {Promise<boolean>}
     */
    async showInstallConfirm(set_hide_confirm) {
        return this.#flux_pwa_api.showPwaConfirm(
            "{name} can be installed as PWA",
            "Install",
            "Use in browser",
            set_hide_confirm
        );
    }
}
