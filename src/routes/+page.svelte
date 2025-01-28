<script lang="ts">
    import PageRenderer from "$lib/components/PageRenderer.svelte";

    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

<PageRenderer searchResults={data} />
