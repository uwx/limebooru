<script lang="ts">
    import { page } from "$app/state";
    import TagList from "$lib/components/TagList.svelte";
    import { Col, Container, Row } from "@sveltestrap/sveltestrap";

    import type { PageProps } from './$types';

    let { data: post }: PageProps = $props();
</script>

<Container fluid>
    <Row>
        <Col xs="2">
            <TagList tags={post.tags} />

            <ul>
                <li>Rating: {post.result.rating}</li>
                <li>Source: {post.result.sourceUrl ?? 'N/A'}</li>
                <li>Pixiv ID: {post.result.pixivId ?? 'N/A'}</li>
            </ul>
        </Col>
        <Col>
            <picture>
                <img
                    src="/images/{post.result.id}"
                    class="post-preview-image"
                    alt="post #{post.result.id}"
                    title="{post.tags.map(e => e.name).join(' ')}"
                />
            </picture>
        </Col>
    </Row>
</Container>