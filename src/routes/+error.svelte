<script>
    import { page } from "$app/state";
    import Button from "$lib/components/Button.svelte";
</script>

<div class="error">
    <span class="status">{page.status}</span>
    <div class="message">
        <h1>{page.error?.message}</h1>
    </div>
</div>
<Button href="/">Retour à l'accueil</Button>

<style>
    .error {
        display: flex;
        align-items: stretch;
        margin-bottom: 32px;
    }

    .status {
        font-size: 48px;
        line-height: 1;
        position: relative;
    }

    .message {
        border-left: 1px solid var(--muted);
        padding-left: 16px;
        margin-left: 16px;
        display: flex;
        align-items: center;
    }

    .message h1 {
        font-weight: normal;
        font-size: 16px;
        margin: 0;
    }
</style>
