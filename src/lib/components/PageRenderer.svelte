<script lang="ts">
    import type { router, RouterOutputs } from '$lib/trpc/router';
    import { Col, Container, Pagination, PaginationItem, PaginationLink, Row } from '@sveltestrap/sveltestrap';
    import TagList from './TagList.svelte';
    import { page } from '$app/state';

    const { searchResults }: { searchResults: RouterOutputs['search'] } = $props();

    const searchParams = $derived(page.url.searchParams);
    const pageNumber = $derived(searchParams.has('page') ? +searchParams.get('page')! : 1);
    const total = $derived(searchResults.total ?? 0);
    const pageCount = $derived(Math.ceil(total / 30));

    const tags = $derived(
        searchResults.tagPostCounts
            .sort((a, b) => {
                const postCount = (b.postCount ?? 0) - (a.postCount ?? 0);
                if (postCount !== 0) return postCount;

                return a.name.localeCompare(b.name);
            })
            .slice(0, 30),
    );

    function getPaginationLink(searchParams: URLSearchParams, pageNumber: number) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('page', pageNumber.toString());

        const url = new URL(page.url);
        url.search = `?${newSearchParams.toString()}`;
        return url.toString();
    }
</script>

<Container fluid>
    <Row>
        <Col xs="2">
            <TagList {tags} />
        </Col>
        <Col>
            <div class="grid">
                {#each searchResults.pictures as picture (picture.id)}
                    <a class="post-preview" role="button" href="/post/{picture.id}">
                        <picture>
                            <img
                                src="/thumbnails/{picture.id}"
                                class="post-preview-image"
                                alt="post #{picture.id}"
                                draggable="false"
                                title={picture.tags.map((e) => e.name).join(' ')}
                            />
                        </picture>
                    </a>
                {/each}
            </div>
            <Pagination size="lg" aria-label="Page navigation example">
                <PaginationItem disabled={pageNumber === 1}>
                    <PaginationLink first    href={getPaginationLink(searchParams, 1)} />
                </PaginationItem>
                <PaginationItem disabled={pageNumber === 1}>
                    <PaginationLink previous href={getPaginationLink(searchParams, Math.max(1, pageNumber - 1))} />
                </PaginationItem>
                <PaginationItem active disabled>
                    <PaginationLink>{pageNumber}</PaginationLink> 
                </PaginationItem>
                <PaginationItem disabled={pageNumber === pageCount}>
                    <PaginationLink next     href={getPaginationLink(searchParams, Math.min(pageCount, pageNumber + 1))} />
                </PaginationItem>
                <PaginationItem disabled={pageNumber === pageCount}>
                    <PaginationLink last     href={getPaginationLink(searchParams, pageCount)} />
                </PaginationItem>
            </Pagination>
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
