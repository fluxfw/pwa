/** @typedef {import("../../../flux-loading-api/src/FluxLoadingApi.mjs").FluxLoadingApi} FluxLoadingApi */
/** @typedef {import("../FluxPwaApi.mjs").FluxPwaApi} FluxPwaApi */

export class ShowUpdateConfirm {
    /**
     * @type {FluxLoadingApi}
     */
    #flux_loading_api;
    /**
     * @type {FluxPwaApi}
     */
    #flux_pwa_api;

    /**
     * @param {FluxLoadingApi} flux_loading_api
     * @param {FluxPwaApi} flux_pwa_api
     * @returns {ShowUpdateConfirm}
     */
    static new(flux_loading_api, flux_pwa_api) {
        return new this(
            flux_loading_api,
            flux_pwa_api
        );
    }

    /**
     * @param {FluxLoadingApi} flux_loading_api
     * @param {FluxPwaApi} flux_pwa_api
     * @private
     */
    constructor(flux_loading_api, flux_pwa_api) {
        this.#flux_loading_api = flux_loading_api;
        this.#flux_pwa_api = flux_pwa_api;
    }

    /**
     * @returns {Promise<boolean>}
     */
    async showUpdateConfirm() {
        const reload = await this.#flux_pwa_api.showPwaConfirm(
            "A new version of {name} is available\nThe update is installed automatically once all instances are closed\nThe update can be tried to be forced, but this may take up to a minute",
            "Force update",
            "Later"
        );

        if (reload) {
            document.body.appendChild(await this.#flux_loading_api.getFullscreenLoadingElement());
        }

        return reload;
    }
}
