<script>
    export let data = {};
    export let hLevel = 2;
</script>  
<article>
    <svelte:element this={"h" + hLevel}>{data.title}</svelte:element>
    <img src={"../" + data.image} alt="">
    <div>
        <p>{data.description}</p>
        <svelte:element this={"h" + (hLevel + 2)}>c. {data.year}</svelte:element>
    </div>
</article>
<style>
    article {
        display: grid;
        grid-template-rows: subgrid;
        grid-row: span 3;
        padding: 0.5em;
    }

    h2 {
        text-align: center;
    }

    h3 {
        text-align: center;
    }
</style>