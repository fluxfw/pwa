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
        let resolve_promise;

        const promise = new Promise(resolve => {
            resolve_promise = resolve;
        });

        const {
            FLUX_OVERLAY_BUTTON_CLICK_EVENT,
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

        flux_overlay_element.addEventListener(FLUX_OVERLAY_BUTTON_CLICK_EVENT, e => {
            switch (e.detail.value) {
                case "force-update":
                    flux_overlay_element.buttons = flux_overlay_element.buttons.map(button => ({
                        ...button,
                        disabled: true
                    }));

                    flux_overlay_element.loading = true;

                    resolve_promise(true);
                    break;

                case "later":
                    flux_overlay_element.remove();

                    resolve_promise(false);
                    break;

                default:
                    break;
            }
        });

        document.body.appendChild(flux_overlay_element);

        return promise;
    }
}
