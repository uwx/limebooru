<script lang="ts">
    import { page } from '$app/state';
    import { Button, Col, Container, Form, FormGroup, Input, Label, Nav, NavItem, NavLink, Row } from '@sveltestrap/sveltestrap';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let searchTerm = $state('');

    onMount(() => {
        if (page.route.id === '/search') {
            searchTerm = page.url.searchParams.get('q') ?? '';
        }
    });
</script>

<header>
    <Container>
        <Nav class="nav-main">
            <NavItem>
                <NavLink href="/">Home</NavLink>
            </NavItem>
            <NavItem>
                <Form
                    on:submit={event => {
                        event.preventDefault();
                        goto('/search?' + new URLSearchParams({ q: searchTerm }));
                    }}
                    inline
                >
                    <Row class="gx-1">
                        <Col class="search-col">
                            <Input
                                type="search"
                                name="search"
                                placeholder="1girl"
                                bind:value={searchTerm}
                            />
                        </Col>
                        <Col>
                            <Button type="submit" class="search-btn">Search</Button>
                        </Col>
                    </Row>
                </Form>
            </NavItem>
        </Nav>
    </Container>
</header>

<style lang="scss">
    :global {
        .nav-main {
            padding: 0.4rem;
        }
    }
</style>