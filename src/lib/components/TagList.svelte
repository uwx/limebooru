<script lang="ts">
    const {
        tags,
    }: {
        tags: {
            name: string;
            id: number;
            postCount: number | null;
        }[];
    } = $props();

    const tagsSorted = $derived(tags.toSorted((a, b) => (b.postCount ?? 0) - (a.postCount ?? 0)));
</script>

<ul>
    {#each tagsSorted as tag (tag.id)}
        <li><a href="/search?q={tag.name}">{tag.name}</a> ({tag.postCount ?? 0})</li>
    {/each}
</ul>
