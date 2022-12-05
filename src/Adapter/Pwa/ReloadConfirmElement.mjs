import { PWA_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("../../../../flux-css-api/src/Adapter/Api/CssApi.mjs").CssApi} CssApi */
/** @typedef {import("../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").LocalizationApi} LocalizationApi */
/** @typedef {import("./reload.mjs").reload} _reload */

const __dirname = import.meta.url.substring(0, import.meta.url.lastIndexOf("/"));

export class ReloadConfirmElement extends HTMLElement {
    /**
     * @type {CssApi}
     */
    #css_api;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;
    /**
     * @type {_reload}
     */
    #reload;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @param {_reload} reload
     * @returns {ReloadConfirmElement}
     */
    static new(css_api, localization_api, reload) {
        return new this(
            css_api,
            localization_api,
            reload
        );
    }

    /**
     * @param {CssApi} css_api
     * @param {LocalizationApi} localization_api
     * @param {_reload} reload
     * @private
     */
    constructor(css_api, localization_api, reload) {
        super();

        this.#css_api = css_api;
        this.#localization_api = localization_api;
        this.#reload = reload;

        this.#shadow = this.attachShadow({ mode: "closed" });
        this.#css_api.importCssToRoot(
            this.#shadow,
            `${__dirname}/${this.constructor.name}.css`
        );

        this.#render();
    }

    /**
     * @param {boolean} reload
     * @returns {void}
     */
    #click(reload) {
        for (const button_element of this.#shadow.querySelectorAll("button")) {
            if (button_element.disabled) {
                return;
            }

            button_element.disabled = true;
        }

        this.#reload(
            reload
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        const container_element = document.createElement("div");
        container_element.classList.add("container");

        const content_element = document.createElement("div");
        content_element.classList.add("content");

        const title_element = document.createElement("div");
        title_element.classList.add("title");
        title_element.innerText = await this.#localization_api.translate(
            "A new version of the PWA is available",
            PWA_LOCALIZATION_MODULE
        );
        content_element.appendChild(title_element);

        const info_element = document.createElement("div");
        info_element.innerText = `${await this.#localization_api.translate(
            "It can be used, if all instances of the PWA are closed",
            PWA_LOCALIZATION_MODULE
        )}
${await this.#localization_api.translate(
            "It can be forced to reload this instance, but any unsaved changes may will be lost and other instances may have data inconsistency!",
            PWA_LOCALIZATION_MODULE
        )}`;
        content_element.appendChild(info_element);

        container_element.appendChild(content_element);

        const buttons_element = document.createElement("div");
        buttons_element.classList.add("buttons");

        const later_button_element = document.createElement("button");
        later_button_element.innerText = await this.#localization_api.translate(
            "Later",
            PWA_LOCALIZATION_MODULE
        );
        later_button_element.type = "button";
        later_button_element.addEventListener("click", () => {
            this.#click(
                false
            );
        });
        buttons_element.appendChild(later_button_element);

        const reload_button_element = document.createElement("button");
        reload_button_element.innerText = await this.#localization_api.translate(
            "Force reload",
            PWA_LOCALIZATION_MODULE
        );
        reload_button_element.type = "button";
        reload_button_element.addEventListener("click", () => {
            this.#click(
                true
            );
        });
        buttons_element.appendChild(reload_button_element);

        container_element.appendChild(buttons_element);

        this.#shadow.appendChild(container_element);
    }
}

export const RELOAD_CONFIRM_ELEMENT_TAG_NAME = "flux-reload-confirm";

customElements.define(RELOAD_CONFIRM_ELEMENT_TAG_NAME, ReloadConfirmElement);
