<script lang="ts">
    import { CodeCanvas } from "$lib/CodeCanvas";
    let canvas: HTMLCanvasElement;

    $effect(() => {
        const anim = new CodeCanvas(canvas);
        anim.start();
    });
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
    canvas {
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
    }
</style>
