import { SKIP_WAITING } from "./SKIP_WAITING.mjs";

/** @typedef {import("./Logger/Logger.mjs").Logger} Logger */
/** @typedef {import("./Pwa.mjs").Pwa} Pwa */
/** @typedef {import("./_showInstallConfirm.mjs").showInstallConfirm} showInstallConfirm */
/** @typedef {import("./_showUpdateConfirm.mjs").showUpdateConfirm} showUpdateConfirm */

export class InitServiceWorker {
    /**
     * @type {Logger}
     */
    #logger;
    /**
     * @type {Pwa}
     */
    #pwa;
    /**
     * @type {boolean}
     */
    #reload = false;

    /**
     * @param {Logger} logger
     * @param {Pwa} pwa
     * @returns {Promise<InitServiceWorker>}
     */
    static async new(logger, pwa) {
        return new this(
            logger,
            pwa
        );
    }

    /**
     * @param {Logger} logger
     * @param {Pwa} pwa
     * @private
     */
    constructor(logger, pwa) {
        this.#logger = logger;
        this.#pwa = pwa;
    }

    /**
     * @param {string} service_worker_mjs_file
     * @param {showInstallConfirm | null} show_install_confirm
     * @param {showUpdateConfirm | null} show_update_confirm
     * @param {boolean | null} show_install_confirm_later
     * @returns {Promise<void>}
     */
    async initServiceWorker(service_worker_mjs_file, show_install_confirm = null, show_update_confirm = null, show_install_confirm_later = null) {
        try {
            if ((navigator.serviceWorker?.register ?? null) === null) {
                this.#logger.info(
                    "serviceWorker is not available!"
                );
                return;
            }

            if (show_install_confirm !== null) {
                await this.#pwa.initInstallConfirm(
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

            if (show_update_confirm === null) {
                return;
            }

            await this.#registerUpdateConfirm(
                registration,
                show_update_confirm
            );
        } catch (error) {
            this.#logger.error(
                "Init service worker failed (",
                error,
                ")!"
            );
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

            registration.installing.addEventListener("statechange", event => {
                if (event.target.state !== "installed") {
                    return;
                }

                this.#showUpdateConfirm(
                    registration,
                    show_update_confirm
                );
            });
        });

        navigator.serviceWorker.addEventListener("controllerchange", async event => {
            if (!this.#reload) {
                return;
            }

            await event.target.ready;

            location.reload();
        }, {
            once: true
        });

        if (registration.waiting === null) {
            return;
        }

        this.#showUpdateConfirm(
            registration,
            show_update_confirm
        );
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
