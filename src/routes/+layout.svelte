<script lang="ts">
    import favicon from "$lib/assets/icons/38x38.png";
    import { m } from "$lib/paraglide/messages.js";
    import { locales, localizeHref } from "$lib/paraglide/runtime";
    import { page } from "$app/state";

    let { children } = $props();
</script>

<svelte:head>
    <title>{m.title()}</title>
    <meta name="description" content={m.description()} />
    <meta property="og:title" content={m.title()} />
    <meta property="og:description" content={m.description()} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href="https://etiennemr.fr/" />
    {@html `<script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Etienne_MR",
            "url": "https://etiennemr.fr",
            "sameAs": ["https://github.com/EtienneMR"],
            "jobTitle": ${JSON.stringify(m.description({}, { locale: "en" }))}
          }
    </script>`}
    <link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
<div style="display:none">
    {#each locales as locale}
        <a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
    {/each}
</div>

<style>
    :global {
        :root {
            --bg: #071016;
            --card: #0b1116;
            --fg: #e6eef3;
            --muted: #9aa6ad;

            --radial: rgba(126, 227, 255, 0.02);

            --card-gradient-start: rgba(255, 255, 255, 0.02);
            --card-gradient-end: rgba(255, 255, 255, 0.01);

            --border: rgba(255, 255, 255, 0.05);

            --card-shadow: 0 12px 40px rgba(2, 6, 23, 0.6);

            font-family:
                system-ui,
                -apple-system,
                "Segoe UI",
                Roboto,
                "Helvetica Neue",
                Arial,
                "SF Mono",
                Menlo,
                monospace;
        }

        @media (prefers-color-scheme: light) {
            :root {
                --bg: #f4f7f9;
                --card: #ffffff;
                --fg: #0b1014;
                --muted: #55656b;

                --radial: rgba(126, 227, 255, 0.03);

                --card-gradient-start: rgba(2, 6, 23, 0.02);
                --card-gradient-end: rgba(2, 6, 23, 0.01);

                --border: rgba(2, 6, 23, 0.06);

                --card-shadow: 0 12px 40px rgba(2, 6, 23, 0.08);
            }
        }

        html,
        body {
            height: 100%;
            margin: 0;
        }
        body {
            background:
                radial-gradient(
                    900px 400px at 15% 15%,
                    var(--radial),
                    transparent 6%
                ),
                var(--bg);
            color: var(--fg);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 32px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            overflow: hidden;
        }
    }
</style>
