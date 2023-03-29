import { PWA_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("../../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("./setHideConfirm.mjs").setHideConfirm} setHideConfirm */

export class ShowInstallConfirm {
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @returns {ShowInstallConfirm}
     */
    static new(flux_localization_api) {
        return new this(
            flux_localization_api
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @private
     */
    constructor(flux_localization_api) {
        this.#flux_localization_api = flux_localization_api;
    }

    /**
     * @param {setHideConfirm} set_hide_confirm
     * @returns {Promise<boolean>}
     */
    async showInstallConfirm(set_hide_confirm) {
        const {
            FluxOverlayElement
        } = await import("../../../flux-overlay/src/FluxOverlayElement.mjs");

        const flux_overlay_element = FluxOverlayElement.new(
            document.title,
            await this.#flux_localization_api.translate(
                "{name} can be installed as PWA",
                PWA_LOCALIZATION_MODULE,
                {
                    name: document.title
                }
            ),
            null,
            [
                {
                    label: await this.#flux_localization_api.translate(
                        "Install",
                        PWA_LOCALIZATION_MODULE
                    ),
                    value: "install"
                },
                {
                    label: await this.#flux_localization_api.translate(
                        "Use in browser",
                        PWA_LOCALIZATION_MODULE
                    ),
                    value: "use-in-browser"
                }
            ]
        );

        set_hide_confirm(
            () => {
                flux_overlay_element.remove();
            }
        );

        return (await flux_overlay_element.showAndWait()).button === "install";
    }
}
