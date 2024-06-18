<script lang="ts">
    import Home from "./Home.svelte";

    type CurrentPage = "Home";
    let currentPage: CurrentPage = "Home";
</script>

{#if currentPage == "Home"}
    <Home />
{:else}
    <h1>
        Something must've went HORRIBLY wrong!
        <span style="color: var(--red)">
            {currentPage}
        </span>
    </h1>
{/if}
