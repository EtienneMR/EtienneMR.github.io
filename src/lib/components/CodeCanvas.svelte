<script lang="ts">
    import CodeCanvas from "$lib/CodeCanvas";
</script>

<canvas {@attach CodeCanvas.asAttachment} aria-hidden="true"></canvas>

<style>
    * {
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
    }
</style>
