/** @typedef {import("../../../../flux-loading-api/src/FluxLoadingApi.mjs").FluxLoadingApi} FluxLoadingApi */
/** @typedef {import("../Port/PwaService.mjs").PwaService} PwaService */

export class ShowUpdateConfirmCommand {
    /**
     * @type {FluxLoadingApi}
     */
    #flux_loading_api;
    /**
     * @type {PwaService}
     */
    #pwa_service;

    /**
     * @param {FluxLoadingApi} flux_loading_api
     * @param {PwaService} pwa_service
     * @returns {ShowUpdateConfirmCommand}
     */
    static new(flux_loading_api, pwa_service) {
        return new this(
            flux_loading_api,
            pwa_service
        );
    }

    /**
     * @param {FluxLoadingApi} flux_loading_api
     * @param {PwaService} pwa_service
     * @private
     */
    constructor(flux_loading_api, pwa_service) {
        this.#flux_loading_api = flux_loading_api;
        this.#pwa_service = pwa_service;
    }

    /**
     * @returns {Promise<boolean>}
     */
    async showUpdateConfirm() {
        const reload = await this.#pwa_service.showPwaConfirm(
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
