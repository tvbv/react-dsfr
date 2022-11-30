# 🌎 Internationalisation

DSFR components contains hard coded strings.&#x20;

Theses strings can be switched form a langage to antother with a provider.&#x20;

![image](https://user-images.githubusercontent.com/6702424/202221151-9e04dd77-da52-4ce7-b1b1-5bb653addf50.png) ![image](https://user-images.githubusercontent.com/6702424/202221309-b11b89a7-4893-442b-ab2a-92f85177ba69.png)

### Integration with i18n libraries&#x20;

{% tabs %}
{% tab title="i18nifty" %}
{% embed url="https://i18nifty.dev" %}
A type safe internationalisation library for SPAs and Next.js
{% endembed %}

{% code title="index.tsx" overflow="wrap" %}
```tsx
import { useLang } from "i18n";
import { DsfrLangProvider } from "@codegouvfr/react-dsfr";

function MyApp(){
    const { lang } = useLang();
    
    return (
        <DsfrLangProvider lang={lang}>
            {/* ... your app */}
        </DsfrLangProvider>
    );

}
```
{% endcode %}

Example setup [in Next.js](https://github.com/etalab/etalab-website/blob/b427049dd9609ddbdd5fc2b42484d700e20851f4/pages/\_app.tsx#L39-L42) / In a SPA.

{% hint style="warning" %}
DISLAMER: I'm the author of i18nifty.

While I confidently recommend it for SPAs I have to warn you that using i18nifty in Next.js will force you to opt out  from[ Automatic Static Optimization](https://nextjs.org/docs/messages/opt-out-auto-static-optimization) and bundle all your translations in the JavaScript bundle. SSR, SSO will work fine though.dindd
{% endhint %}
{% endtab %}

{% tab title="Next.js builtin i18n" %}
{% embed url="https://nextjs.org/docs/advanced-features/i18n-routing" %}

Assuming you have enabled internationalized routing: &#x20;

{% code title="pages/_app.tsx" %}
```tsx
import { useRouter } from "next/router";
import { DsfrLangProvider } from "@codegouvfr/react-dsfr";

function App({ Component, pageProps }: AppProps) {

  const router = useRouter();

  return (
    <DsfrLangProvider lang={router.locale}>
      {/* ... */}
    </DsfrLangProvider>
  );
}

```
{% endcode %}
{% endtab %}

{% tab title="Other i18n library" %}
It's up you you to remplace in the following example to remplace `"fr"` by the desired locale using to tooling exposed by your i18n library. &#x20;

```tsx
import { DsfrLangProvider } from "@codegouvfr/react-dsfr";

function MyApp(){
    return (
        <DsfrLangProvider lang="fr">
            {/* ... your app */}
        </DsfrLangProvider>
    );

}
```
{% endtab %}
{% endtabs %}
 
### Adding translations&#x20; 

The components usualy comes with one or two translation by default, typically english (`en`), spanis (`es`) and somethime german (`de`).  [Illustration with the \<DarkModeSwitch /> component](https://github.com/codegouvfr/react-dsfr/blob/e8b78dd5ad069a322fbcc34b34b25d4ac8214e34/src/DarkModeSwitch.tsx#L162-L199).&#x20;

You can add translation for extra language on a composant basis like so:

```tsx
import { addAlertTranslations } from "@codegouvfr/react-dsfr/Alert";

addAlertTranslations({
	"lang": "zh-CN",
	"messages": {
		"hide message": "隐藏消息"
	}
});
```

The above code adds chinese (`zh-CN`) support for the Alert component. You can call  `addAlertTranslations()` wherever just be sure it's evaluated before the first use of the component, here `<Alert />`.
