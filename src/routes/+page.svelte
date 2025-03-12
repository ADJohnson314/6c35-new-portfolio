<svelte:head>
  <title>Ayden Johnson: Personal site and 6.C35 portfolio</title>
</svelte:head>
<script>
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";
</script>
<h1>Ayden Johnson</h1>
<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quotidie futurum me imaginari ubi tecum esse possum. In manu mea stylus qui carmen scribet de me et tu.</p>
<img src="images/Windows Beach Background.jpg" alt="A rock formation on a beach">
<h2>Latest Projects</h2>
<div class="projects">
    {#each projects.slice(0, 3) as p}
    <Project data={p} hLevel="3" />
    {/each}
</div>
{#await fetch("https://api.github.com/users/ADJohnson314")}
  <p>Loading...</p>
{:then response}
  {#await response.json()}
    <p>Decoding...</p>
  {:then data}
    <section>
      <h2>My GitHub Stats</h2>
      <dl>
        <dt>Followers:</dt>
        <dd>{data.followers}</dd>
        <dt>Following:</dt>
        <dd>{data.following}</dd>
        <dt>Public Repositories:</dt>
        <dd>{data.public_repos}</dd>
      </dl>
    </section>
  {:catch error}
    <p class="error">Something went wrong: {error.message}</p>
  {/await}
{:catch error}
  <p class="error">Something went wrong: {error.message}</p>
{/await}


