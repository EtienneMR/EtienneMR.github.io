<script>
    let { children, ...props } = $props();
</script>

<a {...props}>
    {@render children?.()}
</a>

<style>
    a {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        color: inherit;
        padding: 10px 14px;
        border-radius: 10px;
        background: var(--border);
        border: 1px solid var(--border);
        font-size: 0.95rem;
        transition: transform 0.12s ease;
    }
    a:hover {
        transform: translateY(-4px);
    }
</style>
