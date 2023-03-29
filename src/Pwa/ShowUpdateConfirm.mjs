import { PWA_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("../../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */

export class ShowUpdateConfirm {
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @returns {ShowUpdateConfirm}
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
     * @returns {Promise<boolean>}
     */
    async showUpdateConfirm() {
        const {
            FluxOverlayElement
        } = await import("../../../flux-overlay/src/FluxOverlayElement.mjs");

        const flux_overlay_element = FluxOverlayElement.new(
            document.title,
            await this.#flux_localization_api.translate(
                "A new version of {name} is available\nThe update is installed automatically once all instances are closed\nThe update can be tried to be forced, but this may take up to a minute",
                PWA_LOCALIZATION_MODULE,
                {
                    name: document.title
                }
            ),
            null,
            [
                {
                    label: await this.#flux_localization_api.translate(
                        "Force update",
                        PWA_LOCALIZATION_MODULE
                    ),
                    value: "force-update"
                },
                {
                    label: await this.#flux_localization_api.translate(
                        "Later",
                        PWA_LOCALIZATION_MODULE
                    ),
                    value: "later"
                }
            ]
        );

        switch ((await flux_overlay_element.showAndWait(
            null,
            false
        )).button) {
            case "force-update":
                flux_overlay_element.buttons = true;
                await flux_overlay_element.showLoading();
                return true;

            case "later":
            default:
                flux_overlay_element.remove();
                return false;
        }
    }
}
