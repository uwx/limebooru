<script lang="ts">
    import { page } from "$app/state";
    import TagList from "$lib/components/TagList.svelte";
    import { Button, Col, Container, Row } from "@sveltestrap/sveltestrap";

    import type { PageProps } from './$types';
    import { trpc } from "$lib/trpc/client";
    import { goto } from "$app/navigation";

    let { data: post }: PageProps = $props();

    async function deletePost() {
        if (!confirm('Are you sure you want to delete this post?')) return;

        const id = post.result.id;
        if (await trpc(page).deletePost.mutate(id)) {
            await goto('/');
        } else {
            alert('Could not delete post! Maybe it was already deleted?');
        }
    }


    function prettifyRating(rating: string) {
        switch (rating) {
            case 'g':
                return 'General';
            case 's':
                return 'Safe';
            case 'q':
                return 'Questionable';
            case 'e':
                return 'Explicit';
            default:
                return 'Unknown';
        }
    }
</script>

<Container fluid>
    <Row>
        <Col xs="2">
            <TagList tags={post.tags} />

            <ul>
                <li>Rating: {prettifyRating(post.result.rating)}</li>
                <li>Source: {post.result.sourceUrl ?? 'N/A'}</li>
                <li>Pixiv ID: {post.result.pixivId ?? 'N/A'}</li>
            </ul>

            <Button onclick={() => deletePost()}>Delete</Button>
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