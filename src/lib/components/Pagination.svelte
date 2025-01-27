<script lang="ts">
    // https://svelte.dev/repl/84a8d64a6f1e49feba8f6a491ecc55f5?version=3.35.0

    import { Pagination, PaginationItem, PaginationLink } from '@sveltestrap/sveltestrap';

    type T = $$Generic;

    export let rows: T[];
    export let perPage: number;
    export let totalShownPages = 3;

    export let top = false;
    export let bottom = true;

    let trimmedRows: T[] = [];

    $: totalRows = rows.length;
    $: currentPage = 0;
    $: totalPages = Math.ceil(totalRows / perPage);
    $: start = currentPage * perPage;
    $: end = currentPage === totalPages - 1 ? totalRows - 1 : start + perPage - 1;

    $: trimmedRows = rows.slice(start, end + 1);

    $: { totalRows; (currentPage = 0); }
    // $: currentPage, start, end;

    $: lastPage = totalPages - 1;

    let options: number[];

    $: {
        // https://github.com/TahaSh/svelte-paginate/blob/master/src/lib/generateNavigationOptions.ts#L50
        /*!
MIT License

Copyright (c) 2022 Taha Shashtari

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
        */
        let firstBoundary = Math.floor(totalShownPages / 2);
        let lastBoundary = totalPages - Math.floor(totalShownPages / 2) - firstBoundary;
        if (currentPage <= firstBoundary) {
            options = Array(totalShownPages)
                .fill(null)
                .map((_, index) => index);
        } else if (currentPage >= lastBoundary) {
            options = Array(totalShownPages)
                .fill(null)
                .map((_, index) => lastBoundary + index - 1);
        } else if (currentPage >= firstBoundary && currentPage <= lastBoundary) {
            options = Array(totalShownPages)
                .fill(null)
                .map((_, index) => currentPage - (firstBoundary - 1) + (index - 1));
        }
    }

    function goFirst(event: Event) {
        event.preventDefault();
        currentPage = 0;
    }
    function goPrev(event: Event) {
        event.preventDefault();
        currentPage = Math.max(currentPage - 1, 0);
    }
    function goNext(event: Event) {
        event.preventDefault();
        currentPage = Math.min(currentPage + 1, lastPage);
    }
    function goLast(event: Event) {
        event.preventDefault();
        currentPage = lastPage;
    }
    function go(event: Event, page: number) {
        event.preventDefault();
        currentPage = Math.min(Math.max(page, 0), lastPage);
    }
    /*
    function* range(from: number, to: number, mod = 1) {
        let i = from;

        while (mod < 0 ? i >= to : i < to) {
            yield i;
            i += mod;
        }
    }
    */
</script>

{#if totalRows && totalRows > perPage}
    <h5>{start + 1} - {end + 1} of {totalRows} entries</h5>
{:else}
    <h5>{totalRows} entries</h5>
{/if}

{#if top && totalRows && totalRows > perPage}
    <Pagination size="lg" aria-label="Page navigation example">
        <PaginationItem disabled={currentPage === 0}>
            <PaginationLink first href="#" on:click={goFirst} />
        </PaginationItem>
        <PaginationItem disabled={currentPage === 0}>
            <PaginationLink previous href="#" on:click={goPrev} />
        </PaginationItem>
        {#each options as option}
            <PaginationItem active={currentPage == option}>
                <PaginationLink on:click={(e) => go(e, option)} href="#">{option + 1}</PaginationLink>
            </PaginationItem>
        {/each}
        <PaginationItem disabled={currentPage === lastPage}>
            <PaginationLink next href="#" on:click={goNext} />
        </PaginationItem>
        <PaginationItem disabled={currentPage === lastPage}>
            <PaginationLink last href="#" on:click={goLast} />
        </PaginationItem>
    </Pagination>
{/if}

{#each trimmedRows as row}
    <slot {row} />
{/each}

{#if bottom && totalRows && totalRows > perPage}
    <Pagination size="lg" aria-label="Page navigation example">
        <PaginationItem disabled={currentPage === 0}>
            <PaginationLink first href="#" on:click={goFirst} />
        </PaginationItem>
        <PaginationItem disabled={currentPage === 0}>
            <PaginationLink previous href="#" on:click={goPrev} />
        </PaginationItem>
        {#each options as option}
            <PaginationItem active={currentPage == option}>
                <PaginationLink on:click={(e) => go(e, option)} href="#">{option + 1}</PaginationLink>
            </PaginationItem>
        {/each}
        <PaginationItem disabled={currentPage === lastPage}>
            <PaginationLink next href="#" on:click={goNext} />
        </PaginationItem>
        <PaginationItem disabled={currentPage === lastPage}>
            <PaginationLink last href="#" on:click={goLast} />
        </PaginationItem>
    </Pagination>
{/if}
