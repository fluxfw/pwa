import { CONTENT_TYPE_JSON } from "../../../flux-http-api/src/ContentType/CONTENT_TYPE.mjs";
import { HEADER_ACCEPT } from "../../../flux-http-api/src/Header/HEADER.mjs";
import { HttpClientRequest } from "../../../flux-http-api/src/Client/HttpClientRequest.mjs";

/** @typedef {import("../../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../../../flux-localization-api/src/FluxLocalizationApi.mjs").FluxLocalizationApi} FluxLocalizationApi */
/** @typedef {import("./Manifest.mjs").Manifest} Manifest */

export class InitPwa {
    /**
     * @type {FluxHttpApi}
     */
    #flux_http_api;
    /**
     * @type {FluxLocalizationApi}
     */
    #flux_localization_api;
    /**
     * @type {Map<string, Manifest>}
     */
    #manifests;

    /**
     * @param {FluxHttpApi} flux_http_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {Map<string, Manifest>} manifests
     * @returns {InitPwa}
     */
    static new(flux_http_api, flux_localization_api, manifests) {
        return new this(
            flux_http_api,
            flux_localization_api,
            manifests
        );
    }

    /**
     * @param {FluxHttpApi} flux_http_api
     * @param {FluxLocalizationApi} flux_localization_api
     * @param {Map<string, Manifest>} manifests
     * @private
     */
    constructor(flux_http_api, flux_localization_api, manifests) {
        this.#flux_http_api = flux_http_api;
        this.#flux_localization_api = flux_localization_api;
        this.#manifests = manifests;
    }

    /**
     * @param {string} manifest_json_file
     * @returns {Promise<void>}
     */
    async initPwa(manifest_json_file) {
        const manifest_json_file_dot_pos = manifest_json_file.lastIndexOf(".");
        const localized_manifest_json_file = `${manifest_json_file.substring(0, manifest_json_file_dot_pos)}-${(await this.#flux_localization_api.getLanguage()).language}${manifest_json_file.substring(manifest_json_file_dot_pos)}`;

        let manifest, _manifest_json_file;
        try {
            manifest = await this.#importManifest(
                localized_manifest_json_file
            );

            _manifest_json_file = localized_manifest_json_file;
        } catch (error) {
            console.error(`Load ${localized_manifest_json_file} failed - Use ${manifest_json_file} as fallback (`, error, ")");

            manifest = await this.#importManifest(
                manifest_json_file
            );

            _manifest_json_file = manifest_json_file;
        }

        document.documentElement.dir = manifest.dir ?? "";
        document.documentElement.lang = manifest.lang ?? "";

        document.title = manifest.name ?? "";

        const description_meta = document.head.querySelector("meta[name=description]") ?? document.createElement("meta");
        description_meta.content = manifest.description ?? "";
        description_meta.name = "description";
        if (!description_meta.isConnected) {
            document.head.appendChild(description_meta);
        }

        const manifest_link = document.head.querySelector("link[rel=manifest]") ?? document.createElement("link");
        manifest_link.href = _manifest_json_file;
        manifest_link.rel = "manifest";
        if (!manifest_link.isConnected) {
            document.head.appendChild(manifest_link);
        }
    }

    /**
     * @param {string} manifest_json_file
     * @returns {Promise<Manifest>}
     */
    async #importManifest(manifest_json_file) {
        let manifest = null;

        if (this.#manifests.has(manifest_json_file)) {
            manifest = structuredClone(this.#manifests.get(manifest_json_file) ?? null);
        } else {
            try {
                manifest = await (await this.#flux_http_api.request(
                    HttpClientRequest.new(
                        new URL(manifest_json_file),
                        null,
                        null,
                        {
                            [HEADER_ACCEPT]: CONTENT_TYPE_JSON
                        },
                        true
                    ))).body.json();
            } finally {
                this.#manifests.set(manifest_json_file, manifest);
            }
        }

        if (manifest === null) {
            throw new Error("Invalid manifest");
        }

        return manifest;
    }
}
