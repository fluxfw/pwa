/** @typedef {import("../Port/PwaService.mjs").PwaService} PwaService */
/** @typedef {import("../../../Adapter/Pwa/setHideConfirm.mjs").setHideConfirm} setHideConfirm */

export class ShowInstallConfirmCommand {
    /**
     * @type {PwaService}
     */
    #pwa_service;

    /**
     * @param {PwaService} pwa_service
     * @returns {ShowInstallConfirmCommand}
     */
    static new(pwa_service) {
        return new this(
            pwa_service
        );
    }

    /**
     * @param {PwaService} pwa_service
     * @private
     */
    constructor(pwa_service) {
        this.#pwa_service = pwa_service;
    }

    /**
     * @param {setHideConfirm} set_hide_confirm
     * @returns {Promise<boolean>}
     */
    async showInstallConfirm(set_hide_confirm) {
        return this.#pwa_service.showPwaConfirm(
            "{name} can be installed as PWA",
            "Install",
            "Use in browser",
            set_hide_confirm
        );
    }
}
