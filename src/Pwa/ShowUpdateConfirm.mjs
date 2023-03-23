/** @typedef {import("../FluxPwaApi.mjs").FluxPwaApi} FluxPwaApi */

export class ShowUpdateConfirm {
    /**
     * @type {FluxPwaApi}
     */
    #flux_pwa_api;

    /**
     * @param {FluxPwaApi} flux_pwa_api
     * @returns {ShowUpdateConfirm}
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
     * @returns {Promise<boolean>}
     */
    async showUpdateConfirm() {
        const reload = await this.#flux_pwa_api.showPwaConfirm(
            "A new version of {name} is available\nThe update is installed automatically once all instances are closed\nThe update can be tried to be forced, but this may take up to a minute",
            "Force update",
            "Later"
        );

        if (reload) {
            document.body.appendChild((await import("../../../flux-loading-spinner/src/FluxFullscreenLoadingSpinnerElement.mjs")).FluxFullscreenLoadingSpinnerElement.new());
        }

        return reload;
    }
}
