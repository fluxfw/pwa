/** @typedef {import("../../../../../flux-json-api/src/Adapter/Api/JsonApi.mjs").JsonApi} JsonApi */
/** @typedef {import("../../../../../flux-localization-api/src/Adapter/Api/LocalizationApi.mjs").JsonApi} LocalizationApi */

export class PwaService {
    /**
     * @type {JsonApi}
     */
    #json_api;
    /**
     * @type {LocalizationApi}
     */
    #localization_api;

    /**
     * @param {JsonApi} json_api
     * @param {LocalizationApi} localization_api
     * @returns {PwaService}
     */
    static new(json_api, localization_api) {
        return new this(
            json_api,
            localization_api
        );
    }

    /**
     * @param {JsonApi} json_api
     * @param {LocalizationApi} localization_api
     * @private
     */
    constructor(json_api, localization_api) {
        this.#json_api = json_api;
        this.#localization_api = localization_api;
    }

    /**
     * @param {string} manifest_json_file
     * @returns {Promise<void>}
     */
    async initPwa(manifest_json_file) {
        await (await import("../Command/InitPwaCommand.mjs")).InitPwaCommand.new(
            this.#json_api,
            this.#localization_api
        )
            .initPwa(
                manifest_json_file
            );
    }
}
