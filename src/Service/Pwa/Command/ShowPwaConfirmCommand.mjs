/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("../../../Adapter/Pwa/setHideConfirm.mjs").setHideConfirm} setHideConfirm */

export class ShowPwaConfirmCommand {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;

    /**
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @returns {ShowPwaConfirmCommand}
     */
    static new(css_api, localization_api) {
        return new this(
            css_api,
            localization_api
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @private
     */
    constructor(css_api, localization_api) {
        this.#css_api = css_api;
        this.#localization_api = localization_api;
    }

    /**
     * @param {string} info_text
     * @param {string} confirm_text
     * @param {string} cancel_text
     * @param {setHideConfirm | null} set_hide_confirm
     * @returns {Promise<boolean>}
     */
    async showPwaConfirm(info_text, confirm_text, cancel_text, set_hide_confirm = null) {
        const { PwaConfirmElement } = await import("../../../Adapter/Pwa/PwaConfirmElement.mjs");

        return new Promise(resolve => {
            const confirm_element = PwaConfirmElement.new(
                this.#css_api,
                this.#localization_api,
                document.title,
                info_text,
                confirm_text,
                cancel_text,
                async confirm => {
                    confirm_element.remove();

                    resolve(confirm);
                }
            );

            document.body.appendChild(confirm_element);

            if (set_hide_confirm !== null) {
                set_hide_confirm(
                    () => {
                        confirm_element.remove();
                    }
                );
            }
        });
    }
}
