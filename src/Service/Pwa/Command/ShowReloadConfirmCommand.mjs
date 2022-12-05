/** @typedef {import("../../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../../flux-loading-api/src/Adapter/Api/LoadingApi.mjs").LoadingApi} LoadingApi */
/** @typedef {import("../../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */

export class ShowReloadConfirmCommand {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {LoadingApi}
     */
    #loading_api;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;

    /**
     * @param {CssApi} css_api
     * @param {LoadingApi} loading_api
     * @param {LocalizationApi} localization_api
     * @returns {ShowReloadConfirmCommand}
     */
    static new(css_api, loading_api, localization_api) {
        return new this(
            css_api,
            loading_api,
            localization_api
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LoadingApi} loading_api
     * @param {LocalizationApi} localization_api
     * @private
     */
    constructor(css_api, loading_api, localization_api) {
        this.#css_api = css_api;
        this.#loading_api = loading_api;
        this.#localization_api = localization_api;
    }

    /**
     * @returns {Promise<boolean>}
     */
    async showReloadConfirm() {
        const { ReloadConfirmElement } = await import("../../../Adapter/Pwa/ReloadConfirmElement.mjs");

        return new Promise(resolve => {
            const reload_confirm_element = ReloadConfirmElement.new(
                this.#css_api,
                this.#localization_api,
                async reload => {
                    reload_confirm_element.remove();

                    if (reload) {
                        document.body.appendChild(await this.#loading_api.getFullscreenLoadingElement());
                    }

                    resolve(reload);
                }
            );

            document.body.prepend(reload_confirm_element);
        });
    }
}
