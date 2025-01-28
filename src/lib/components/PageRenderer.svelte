<script lang="ts">
    import { goto } from "$app/navigation";
    import type { router, RouterOutputs } from "$lib/trpc/router";
    import { Col, Container, Row } from "@sveltestrap/sveltestrap";
    import TagList from "./TagList.svelte";

    const props: { searchResults: RouterOutputs['search'] } = $props();

    // SQL funkiness, i could make a better query but fuck it
    // const total = $derived(props.pictures.find(e => e.total) ?? 0);

    const tags = $derived(
        props.searchResults.tagPostCounts
            .sort((a, b) => {
                const postCount = (b.postCount ?? 0) - (a.postCount ?? 0);
                if (postCount !== 0) return postCount;

                return a.name.localeCompare(b.name);
            })
            .slice(0, 30)
    );
</script>

<Container fluid>
    <Row>
        <Col xs="2">
            <TagList tags={tags} />
        </Col>
        <Col>
            <div class="grid">
                {#each props.searchResults.pictures as picture}
                <a class="post-preview" role="button" href="/post/{picture.id}">
                    <picture>
                        <img
                            src="/thumbnails/{picture.id}"
                            class="post-preview-image"
                            alt="post #{picture.id}"
                            draggable="false"
                            title="{picture.tags.map(e => e.name).join(' ')}"
                        />
                    </picture>
                </a>
                {/each}
            </div>
        </Col>
    </Row>
</Container>

<style lang="scss">
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }

    .post-preview {
        display: block;
        text-align: center;
        padding: 0.5rem;
    }

    .post-preview-image {
        max-height: 180px;
        max-width: 180px;
    }
</style>
