<script>
    import icon from "$lib/assets/icons/38x38.png";
    import { m } from "$lib/paraglide/messages.js";
    import Nav from "./Nav.svelte";
</script>

<main>
    <h1>
        <img alt={m.iconAlt()} src={icon} /> Etienne_MR
    </h1>
    <p>{m.status()}</p>
    <Nav />
    <hr />
    <p>{m.paragraph()}</p>
</main>

<style>
    main {
        position: relative;
        z-index: 2;
        width: 100%;
        max-width: 760px;
        padding: 34px;
        background: linear-gradient(
            180deg,
            var(--card-gradient-start),
            var(--card-gradient-end)
        );
        border-radius: 14px;
        box-shadow:
            var(--card-shadow),
            inset 0 1px 0 var(--border);
        backdrop-filter: blur(6px) saturate(120%);
        border: 1px solid var(--border);
        overflow: visible;
    }
    @media (max-width: 520px) {
        main {
            padding: 20px;
        }
    }

    h1 {
        margin: 0 0 6px 0;
        font-size: 34px;
        font-weight: bold;
        display: flex;
        gap: 12px;
    }
    img {
        border-radius: 25%;
        image-rendering: pixelated;
    }
    p {
        margin: 0 0 8px 0;
        color: var(--muted);
    }
    hr {
        border-color: var(--border);
        margin: 22px 0;
    }
</style>
