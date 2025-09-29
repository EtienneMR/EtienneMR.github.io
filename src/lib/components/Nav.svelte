<script>
    import Button from "./Button.svelte";
</script>

<nav>
    <Button
        href="https://github.com/EtienneMR"
        target="_blank"
        rel="noopener noreferrer"
    >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M12 .5C5.7.5.9 5.3.9 11.6c0 4.7 3 8.6 7.2 10c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.3-3.5-1.3-.5-1.3-1.1-1.6-1.1-1.6-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.3 1.1 2.9.9.1-.7.4-1.1.7-1.4-2.4-.3-4.9-1.2-4.9-5.2 0-1.2.4-2.2 1-3-.1-.3-.4-1.5.1-3.1 0 0 .8-.3 2.8 1a9.7 9.7 0 012.6-.3c.9 0 1.8.1 2.6.3 2-1.3 2.8-1 2.8-1 .5 1.6.2 2.8.1 3.1.6.8 1 1.8 1 3 0 4-2.6 4.9-5 5.2.5.4.9 1 .9 2v3c0 .3.2.6.7.5 4.2-1.3 7.2-5.2 7.2-10C23.1 5.3 18.3.5 12 .5z"
                fill="currentColor"
            ></path>
        </svg> GitHub
    </Button>
    <Button href="mailto:etienne@etiennemr.fr">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M2 6.5v11A2.5 2.5 0 004.5 20h15a2.5 2.5 0 002.5-2.5v-11A2.5 2.5 0 0019.5 4h-15A2.5 2.5 0 002 6.5zm3.4-.5h11.2l-5.6 5.14L5.4 6z"
                fill="currentColor"
            ></path>
        </svg> Email
    </Button>
</nav>

<style>
    svg {
        width: 16px;
        height: 16px;
        display: inline-block;
        vertical-align: middle;
    }
    nav {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 18px;
    }
</style>
