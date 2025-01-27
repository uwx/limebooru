<script>
    import { Col, Container, Row } from "@sveltestrap/sveltestrap";

</script>
<Container fluid>
    <Row>
        <Col xs="2">
            Tags go here
        </Col>
        <Col>
            <div class="grid">
                {#each [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10] as i}
                <div class="post-preview">
                    <picture>
                        <source type="image/jpeg" srcset="https://cdn.donmai.us/180x180/52/d0/52d0e64de961b56b0dd5f687d8c53c71.jpg 1x, https://cdn.donmai.us/360x360/52/d0/52d0e64de961b56b0dd5f687d8c53c71.jpg 2x">
                        <img
                            src="https://cdn.donmai.us/180x180/52/d0/52d0e64de961b56b0dd5f687d8c53c71.jpg"
                            width="129"
                            height="180"
                            class="post-preview-image"
                            title=""
                            alt="post #8770773"
                            draggable="false"
                            data-title="2girls @_@ ahoge bare_shoulders bead_bracelet beads beanie black_choker black_eyes black_pantyhose black_shirt black_shorts black_skirt bracelet breasts choker closed_mouth clothing_cutout covered_navel cowboy_shot crop_top crop_top_overhang cutoffs denim denim_shorts detached_sleeves drill_hair embarrassed frilled_choker frills fymrie green_hair hair_bun hand_up hat heart heart_cutout heart_necklace highleg highleg_leotard highres jewelry large_breasts leotard long_hair long_sleeves looking_at_viewer microskirt midriff multiple_girls navel necklace original panty_straps pantyhose pink_hair ribbed_leotard shirt short_shorts shorts sideboob simple_background skindentation skirt sleeveless sleeveless_shirt spaghetti_strap spoken_blush spoken_heart standing stomach sweatdrop thigh_strap thighband_pantyhose thighs torn_clothes torn_pantyhose torn_shorts twin_drills twintails two-tone_shirt underboob underboob_cutout very_long_hair white_background white_hat white_leotard rating:s score:2"
                        />
                    </picture>
                </div>
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
        text-align: center;
        padding: 0.5rem;
    }
</style>
