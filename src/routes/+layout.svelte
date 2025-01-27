<script lang="ts">
    import Header from '$lib/components/Header.svelte';
    import { Container } from '@sveltestrap/sveltestrap';

    let { children } = $props();
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" />
</svelte:head>

<div class="app">
    <Header />

    <main>
        {@render children()}
    </main>

    <footer>
        <Container>
            <p>limebooru created by <a href="https://github.com/uwx">uwx</a></p>
        </Container>
    </footer>
</div>
