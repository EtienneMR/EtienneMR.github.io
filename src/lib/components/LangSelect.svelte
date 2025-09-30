<script lang="ts">
    import { m } from "$lib/paraglide/messages.js";
    import { locales, getLocale, baseLocale } from "$lib/paraglide/runtime";
    import Button from "./Button.svelte";
</script>

<footer>
    <nav>
        {#each locales.filter((l) => l != getLocale()) as locale}
            <Button
                href={"/" + (locale == baseLocale ? "" : locale)}
                data-sveltekit-reload
            >
                {m.lang({}, { locale })}
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
