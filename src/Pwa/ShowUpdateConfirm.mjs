import { PWA_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("../../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("./Manifest.mjs").Manifest} Manifest */

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
     * @param {Manifest} manifest
     * @returns {Promise<boolean>}
     */
    async showUpdateConfirm(manifest) {
        const {
            FluxOverlayElement
        } = await import("../../../flux-overlay/src/FluxOverlayElement.mjs");

        const name = manifest.name ?? "";

        const flux_overlay_element = FluxOverlayElement.new(
            name,
            await this.#flux_localization_api.translate(
                "A new version of {name} is available\nThe update is installed automatically once all instances are closed\nThe update can be tried to be forced, but this may make conflicts if multiple instances exists and may take up to a minute",
                PWA_LOCALIZATION_MODULE,
                {
                    name
                }
            ),
            [
                {
                    label: await this.#flux_localization_api.translate(
                        "Later",
                        PWA_LOCALIZATION_MODULE
                    ),
                    value: "later"
                },
                {
                    label: await this.#flux_localization_api.translate(
                        "Force update",
                        PWA_LOCALIZATION_MODULE
                    ),
                    value: "update"
                }
            ]
        );

        if ((await flux_overlay_element.wait(
            null,
            null,
            false
        )).button === "update") {
            flux_overlay_element.buttons = true;

            await flux_overlay_element.showLoading();

            return true;
        } else {
            flux_overlay_element.remove();

            return false;
        }
    }
}
