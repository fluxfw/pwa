import { flux_css_api } from "../../../flux-css-api/src/FluxCssApi.mjs";
import { PWA_LOCALIZATION_MODULE } from "../Localization/_LOCALIZATION_MODULE.mjs";

/** @typedef {import("./confirm.mjs").confirm} _confirm */
/** @typedef {import("../../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */

flux_css_api.adopt(
    document,
    await flux_css_api.import(
        `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/PwaConfirmElementVariables.css`
    ),
    true
);

const css = await flux_css_api.import(
    `${import.meta.url.substring(0, import.meta.url.lastIndexOf("/"))}/PwaConfirmElement.css`
);

export class PwaConfirmElement extends HTMLElement {
    /**
     * @type {string}
     */
    #cancel_text;
    /**
     * @type {_confirm}
     */
    #confirm;
    /**
     * @type {string}
     */
    #confirm_text;
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {string}
     */
    #info_text;
    /**
     * @type {string}
     */
    #name;
    /**
     * @type {ShadowRoot}
     */
    #shadow;

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {string} name
     * @param {string} info_text
     * @param {string} confirm_text
     * @param {string} cancel_text
     * @param {_confirm} confirm
     * @returns {PwaConfirmElement}
     */
    static new(flux_localization_api, name, info_text, confirm_text, cancel_text, confirm) {
        return new this(
            flux_localization_api,
            name,
            info_text,
            confirm_text,
            cancel_text,
            confirm
        );
    }

    /**
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {string} name
     * @param {string} info_text
     * @param {string} confirm_text
     * @param {string} cancel_text
     * @param {_confirm} confirm
     * @private
     */
    constructor(flux_localization_api, name, info_text, confirm_text, cancel_text, confirm) {
        super();

        this.#flux_localization_api = flux_localization_api;
        this.#name = name;
        this.#info_text = info_text;
        this.#confirm_text = confirm_text;
        this.#cancel_text = cancel_text;
        this.#confirm = confirm;

        this.#shadow = this.attachShadow({
            mode: "closed"
        });

        flux_css_api.adopt(
            this.#shadow,
            css
        );

        this.#render();
    }

    /**
     * @param {boolean} confirm
     * @returns {void}
     */
    #click(confirm) {
        for (const button_element of this.#shadow.querySelectorAll("button")) {
            if (button_element.disabled) {
                return;
            }

            button_element.disabled = true;
        }

        this.#confirm(
            confirm
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async #render() {
        const container_element = document.createElement("div");
        container_element.classList.add("container");

        const info_element = document.createElement("div");
        info_element.classList.add("info");
        info_element.innerText = await this.#flux_localization_api.translate(
            this.#info_text,
            PWA_LOCALIZATION_MODULE,
            {
                name: this.#name
            }
        );
        container_element.appendChild(info_element);

        const buttons_element = document.createElement("div");
        buttons_element.classList.add("buttons");

        const confirm_button_element = document.createElement("button");
        confirm_button_element.innerText = await this.#flux_localization_api.translate(
            this.#confirm_text,
            PWA_LOCALIZATION_MODULE
        );
        confirm_button_element.type = "button";
        confirm_button_element.addEventListener("click", () => {
            this.#click(
                true
            );
        });
        buttons_element.appendChild(confirm_button_element);

        const cancel_button_element = document.createElement("button");
        cancel_button_element.innerText = await this.#flux_localization_api.translate(
            this.#cancel_text,
            PWA_LOCALIZATION_MODULE
        );
        cancel_button_element.type = "button";
        cancel_button_element.addEventListener("click", () => {
            this.#click(
                false
            );
        });
        buttons_element.appendChild(cancel_button_element);

        container_element.appendChild(buttons_element);

        this.#shadow.appendChild(container_element);
    }
}

export const PWA_CONFIRM_ELEMENT_TAG_NAME = "flux-pwa-confirm";

customElements.define(PWA_CONFIRM_ELEMENT_TAG_NAME, PwaConfirmElement);
