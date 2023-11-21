import { SKIP_WAITING } from "./SKIP_WAITING.mjs";

/** @typedef {import("../FluxPwaApi.mjs").FluxPwaApi} FluxPwaApi */
/** @typedef {import("./_showInstallConfirm.mjs").showInstallConfirm} showInstallConfirm */
/** @typedef {import("./_showUpdateConfirm.mjs").showUpdateConfirm} showUpdateConfirm */

export class InitServiceWorker {
    /**
     * @type {FluxPwaApi}
     */
    #flux_pwa_api;
    /**
     * @type {boolean}
     */
    #reload;

    /**
     * @param {FluxPwaApi} flux_pwa_api
     * @returns {InitServiceWorker}
     */
    static new(flux_pwa_api) {
        return new this(
            flux_pwa_api
        );
    }

    /**
     * @param {FluxPwaApi} flux_pwa_api
     * @private
     */
    constructor(flux_pwa_api) {
        this.#flux_pwa_api = flux_pwa_api;
        this.#reload = false;
    }

    /**
     * @param {string} service_worker_mjs_file
     * @param {showInstallConfirm | null} show_install_confirm
     * @param {boolean | null} show_install_confirm_later
     * @param {showUpdateConfirm | null} show_update_confirm
     * @returns {Promise<void>}
     */
    async initServiceWorker(service_worker_mjs_file, show_install_confirm = null, show_install_confirm_later = null, show_update_confirm = null) {
        try {
            if ((navigator.serviceWorker?.register ?? null) === null) {
                console.info("serviceWorker is not available");
                return;
            }

            if (show_install_confirm !== null) {
                await this.#flux_pwa_api.initInstallConfirm(
                    show_install_confirm,
                    show_install_confirm_later
                );
            }

            if (document.readyState !== "complete") {
                await new Promise(resolve => {
                    addEventListener("load", () => {
                        resolve();
                    }, {
                        once: true
                    });
                });
            }

            const registration = await navigator.serviceWorker.register(service_worker_mjs_file, {
                type: "module"
            });

            if (show_update_confirm !== null) {
                await this.#registerUpdateConfirm(
                    registration,
                    show_update_confirm
                );
            }
        } catch (error) {
            console.error("Init service worker failed (", error, ")");
        }
    }

    /**
     * @param {ServiceWorkerRegistration} registration
     * @param {showUpdateConfirm} show_update_confirm
     * @returns {Promise<void>}
     */
    async #registerUpdateConfirm(registration, show_update_confirm) {
        registration.addEventListener("updatefound", () => {
            if (registration.active === null || registration.installing === null) {
                return;
            }

            registration.installing.addEventListener("statechange", e => {
                if (e.target.state !== "installed") {
                    return;
                }

                this.#showUpdateConfirm(
                    registration,
                    show_update_confirm
                );
            });
        });

        navigator.serviceWorker.addEventListener("controllerchange", async e => {
            if (!this.#reload) {
                return;
            }

            await e.target.ready;

            location.reload();
        }, {
            once: true
        });

        if (registration.waiting !== null) {
            this.#showUpdateConfirm(
                registration,
                show_update_confirm
            );
        }
    }

    /**
     * @param {ServiceWorkerRegistration} registration
     * @param {showUpdateConfirm} show_update_confirm
     * @returns {Promise<void>}
     */
    async #showUpdateConfirm(registration, show_update_confirm) {
        if (this.#reload) {
            return;
        }

        this.#reload = await show_update_confirm();

        if (!this.#reload) {
            return;
        }

        registration.waiting.postMessage({
            type: SKIP_WAITING
        });
    }
}
