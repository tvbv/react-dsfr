import { isBrowser } from "./tools/isBrowser";
import type { ColorScheme } from "./useColorScheme";
import {
    startObservingColorSchemeHtmlAttribute,
    data_fr_theme,
    data_fr_scheme
} from "./useColorScheme";
import { assert } from "tsafe/assert";
import { symToStr } from "tsafe/symToStr";

export type Params = {
    defaultColorScheme: ColorScheme | "system";
    /** Default: false */
    verbose?: boolean;
};

let isStarted = false;

export async function startDsfrReact(params: Params) {
    const { defaultColorScheme, verbose = false } = params;

    assert(
        isBrowser,
        [
            `${symToStr({ startDsfrReact })}() is not supposed`,
            `to be run on the backed, only in the browser`
        ].join(" ")
    );

    assert(!isStarted, `${symToStr({ startDsfrReact })}() should be called only once`);

    isStarted = true;

    const isNextJsDevEnvironnement = (window as any).__NEXT_DATA__?.buildId === "development";

    set_html_color_scheme_attributes: {
        if (document.documentElement.getAttribute(data_fr_theme) !== null) {
            //NOTE: Is has been set by SSR
            break set_html_color_scheme_attributes;
        }

        document.documentElement.setAttribute(data_fr_scheme, defaultColorScheme);

        if (isNextJsDevEnvironnement) {
            break set_html_color_scheme_attributes;
        }

        document.documentElement.setAttribute(
            data_fr_theme,
            (() => {
                const colorSchemeReadFromLocalStorage = localStorage.getItem("scheme");

                const colorSchemeOrSystem: ColorScheme | "system" =
                    (() => {
                        switch (colorSchemeReadFromLocalStorage) {
                            case "light":
                            case "dark":
                            case "system":
                                return colorSchemeReadFromLocalStorage;
                            default:
                                return null;
                        }
                    })() ?? defaultColorScheme;

                return colorSchemeOrSystem !== "system"
                    ? colorSchemeOrSystem
                    : window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";
            })()
        );
    }

    startObservingColorSchemeHtmlAttribute();

    (window as any).dsfr = { verbose, "mode": "manual" };

    await import("@gouvfr/dsfr/dist/dsfr.module");

    if (isNextJsDevEnvironnement) {
        // NOTE: @gouvfr/dsfr/dist/dsfr.module.js is not isomorphic, it can't run on the Server.",
        // We set an artificial delay before starting the module otherwise to avoid getting",
        // Hydration error from Next.js
        await new Promise(resolve => setTimeout(resolve, 150));
    }

    (window as any).dsfr.start();
}