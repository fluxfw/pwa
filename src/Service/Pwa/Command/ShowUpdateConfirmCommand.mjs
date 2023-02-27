/** @typedef {import("../../../../../flux-loading-api/src/Adapter/Api/LoadingApi.mjs").LoadingApi} LoadingApi */
/** @typedef {import("../Port/PwaService.mjs").PwaService} PwaService */

export class ShowUpdateConfirmCommand {
    /**
     * @type {LoadingApi}
     */
    #loading_api;
    /**
     * @type {PwaService}
     */
    #pwa_service;

    /**
     * @param {LoadingApi} loading_api
     * @param {PwaService} pwa_service
     * @returns {ShowUpdateConfirmCommand}
     */
    static new(loading_api, pwa_service) {
        return new this(
            loading_api,
            pwa_service
        );
    }

    /**
     * @param {LoadingApi} loading_api
     * @param {PwaService} pwa_service
     * @private
     */
    constructor(loading_api, pwa_service) {
        this.#loading_api = loading_api;
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
            document.body.appendChild(await this.#loading_api.getFullscreenLoadingElement());
        }

        return reload;
    }
}
