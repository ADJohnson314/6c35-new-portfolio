<svelte:head>
  <title>Ayden Johnson: Personal site and 6.C35 portfolio</title>
</svelte:head>

<script>
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";

    import { onMount } from "svelte";

  let githubData = null;
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch("https://api.github.com/users/ADJohnson314");
      githubData = await response.json();
    } catch (err) {
      error = err;
    }
    loading = false;
  });
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
{#if loading}
    <p>Loading...</p>
{:else if error}
    <p class="error">Something went wrong: {error.message}</p>
{:else}
    <section>
        <h2>My GitHub Stats</h2>
        <dl>
            <dt>Followers</dt>
            <dd>{githubData.followers}</dd>
            <dt>Following</dt>
            <dd>{githubData.following}</dd>
            <dt>Public Repositories</dt>
            <dd>{githubData.public_repos}</dd>
        </dl>
    </section>
{/if}



