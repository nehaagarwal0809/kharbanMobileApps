import i18n from "i18n-js";
import en from "./en.json";
import ar from "./ar.json";

i18n.defaultLocale = "en";
i18n.locale = "en";
i18n.fallbacks = true;
i18n.translations = { en, ar };
const currentLocale = I18n.currentLocale();
export const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;
ReactNative.I18nManager.allowRTL(isRTL);
export function strings(name, params = {}) {
    return I18n.t(name, params);
  };
export default i18n;