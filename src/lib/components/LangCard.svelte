<script lang="ts">
    import { m } from "$lib/paraglide/messages.js";
    import {
        locales,
        localizeHref,
        setLocale,
        getLocale,
    } from "$lib/paraglide/runtime";
    import { page } from "$app/state";
    import Button from "./Button.svelte";
</script>

<footer>
    <nav>
        {#each locales.filter((l) => l != getLocale()) as locale}
            <Button
                href={localizeHref(page.url.pathname, { locale })}
                onclick={(e: Event) => {
                    e.preventDefault();
                    setLocale(locale);
                }}
                >{m.lang({}, { locale })}
            </Button>
        {/each}
    </nav>
</footer>

<style>
    footer {
        margin-top: 16px;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }
</style>
