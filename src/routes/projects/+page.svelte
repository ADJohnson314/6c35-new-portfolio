<svelte:head>
  <title>Projects - Ayden Johnson: Personal site and 6.C35 portfolio</title>
</svelte:head>
<script>
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";
    import Pie from '$lib/Pie.svelte';
    import * as d3 from 'd3';

    let query = "";
    $: filteredProjects = projects.filter(project => {
        let values = Object.values(project).join("\n").toLowerCase();
        return values.includes(query.toLowerCase());
    });

    // Make sure the variable definition is *outside* the block
    let pieData;

    $: {
        // Initialize to an empty object every time this runs
        pieData = {};
        
        // Calculate rolledData and pieData based on filteredProjects here
        let rolledData = d3.rollups(filteredProjects, v => v.length, d => d.year);

        // We don't need 'let' anymore since we already defined pieData
        pieData = rolledData.map(([year, count]) => {
            return { value: count, label: year };
        });
    }

    let selectedYearIndex = -1;
    let selectedYear;
    $: selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;

    $: filteredByYear = filteredProjects.filter(project => {
        if (selectedYear) {
            return project.year === selectedYear;
        }

        return true;
    });

</script>

<h1>{ projects.length } Projects</h1>
<Pie data={pieData} bind:selectedIndex={selectedYearIndex} />
<p>{selectedYear}</p>
<input type="search" bind:value={query}
       aria-label="Search projects" placeholder="🔍 Search projects…" />
<div class="projects">
    {#each filteredByYear as p}
        <Project data={p} />
    {/each}
</div>

<style>
    input {
        width: 100%;
    }
</style>