<svelte:head>
  <title>Meta - Ayden Johnson: Personal site and 6.C35 portfolio</title>
</svelte:head>
<script>
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import {
    computePosition,
    autoPlacement,
    offset,
  } from '@floating-ui/dom';
  import Bar from '$lib/Bar.svelte';


  let width = 1000, height = 600;
  let data = [];
  let commits = [];
  let margin = {top: 10, right: 10, bottom: 30, left: 20};
  let commitTooltip;
  let tooltipPosition = {x: 0, y: 0};
  let rScale = [];
  let clickedCommits = [];

  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left
  };
  usableArea.width = usableArea.right - usableArea.left;
  usableArea.height = usableArea.bottom - usableArea.top;

  let xAxis, yAxis;
  $: {
    d3.select(xAxis).call(d3.axisBottom(xScale));
    d3.select(yAxis).call(d3.axisLeft(yScale));
    d3.select(yAxis).call(d3.axisLeft(yScale).tickFormat(d => String(d % 24).padStart(2, "0") + ":00"));
  }

  let yAxisGridlines;
  $: {
    d3.select(yAxisGridlines).call(
      d3.axisLeft(yScale)
        .tickFormat("")
        .tickSize(-usableArea.width)
    );
  }

  let hoveredIndex = -1;
  $: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};


  $: minDate = d3.min(commits.map(d => d.date));
  $: maxDate = d3.max(commits.map(d => d.date));
  $: maxDatePlusOne = new Date(maxDate);
  $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);

  $: xScale = d3.scaleTime()
                .domain([minDate, maxDatePlusOne])
                .range([usableArea.left, usableArea.right])
                .nice();

  $: yScale = d3.scaleLinear()
                .domain([24, 0])
                .range([usableArea.bottom, usableArea.top]);

  $: allTypes = Array.from(new Set(data.map(d => d.type)));
  $: selectedLines = (clickedCommits.length > 0 ? clickedCommits : commits).flatMap(d => d.lines);
  $: selectedCounts = d3.rollup(
      selectedLines,
      v => v.length,
      d => d.type
  );
  $: languageBreakdown = allTypes.map(type => [type, selectedCounts.get(type) || 0]);


  onMount(async () => {
    data = await d3.csv("/loc.csv", row => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + "T00:00" + row.timezone),
      datetime: new Date(row.datetime)
    }));

    commits = d3.groups(data, d => d.commit).map(([commit, lines]) => {
      let first = lines[0];
      let {author, date, time, timezone, datetime} = first;
      let ret = {
        id: commit,
        url: "https://github.com/vis-society/lab-7/commit/" + commit,
        author, date, time, timezone, datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length
      };

      // Like ret.lines = lines
      // but non-enumerable so it doesn’t show up in JSON.stringify
      Object.defineProperty(ret, "lines", {
        value: lines,
        configurable: true,
        writable: true,
        enumerable: false,
      });

      return ret;
    });

    // console.log(commits);
    commits = d3.sort(commits, d => -d.totalLines);
    let extent = d3.extent(commits, (c) => c.totalLines);
    rScale = d3.scaleSqrt(extent, [2, 30])
  });

  async function dotInteraction (index, evt) {
    let hoveredDot = evt.target;
    if (evt.type === "mouseenter") {
      hoveredIndex = index;
      tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
        strategy: "fixed", // because we use position: fixed
        middleware: [
          offset(5), // spacing from tooltip to dot
          autoPlacement() // see https://floating-ui.com/docs/autoplacement
        ],
      });        }
    else if (evt.type === "mouseleave") {
      hoveredIndex = -1
    }
    else if (evt.type === "click") {
      let commit = commits[index]
      if (!clickedCommits.includes(commit)) {
        // Add the commit to the clickedCommits array
        clickedCommits = [...clickedCommits, commit];
      }
      else {
          // Remove the commit from the array
          clickedCommits = clickedCommits.filter(c => c !== commit);
      }
    }
  }
</script>

<h1>Meta</h1>
<section>
  <dl class="stats">
    <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
    <dd>{data.length}</dd>
  </dl>
  <dl class="stats">
    <dt>Total commits</dt>
    <dd>{commits.length}</dd>
  </dl>
  <dl class="stats">
    <dt>Max lines</dt>
    <dd>{Math.max(...commits.map(a => a.totalLines))}</dd>
  </dl>
</section>
<h3>Commits by time of day</h3>
<svg viewBox="0 0 {width} {height}">
  <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this={yAxisGridlines} />
  <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
  <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
	<g class="dots">
    {#each commits as commit, index }
      <circle
        on:mouseenter={evt => dotInteraction(index, evt)}
        on:mouseleave={evt => dotInteraction(index, evt)}
        on:click={ evt => dotInteraction(index, evt) }
        class:selected={ clickedCommits.includes(commit) }
        cx={ xScale(commit.datetime) }
        cy={ yScale(commit.hourFrac) }
        r="{ rScale(commit.totalLines) }"
        fill="steelblue"
      />
    {/each}
    </g>   
</svg>
<Bar data={languageBreakdown} width={width} />  
<dl class="info tooltip" hidden={hoveredIndex === -1} style="top: {tooltipPosition.y}px; left: {tooltipPosition.x}px" bind:this={commitTooltip}>
  <dt>Commit</dt>
  <dd><a href="{ hoveredCommit.url }" target="_blank">{ hoveredCommit.id }</a></dd>

  <dt>Date</dt>
  <dd>{ hoveredCommit.datetime?.toLocaleString("en", {dateStyle: "full"}) }</dd>

  <dt>Time</dt>
  <dd>{ hoveredCommit.time }</dd>

  <dt>Author</dt>
  <dd>{ hoveredCommit.author }</dd>

  <dt>Lines edited</dt>
  <dd>{ hoveredCommit.totalLines }</dd>
</dl>

<style>
	svg {
		overflow: visible;
	}

  .gridlines {
    stroke-opacity: .2;
  }

  dl.info {
    display: grid;
    grid-template-columns: auto auto;

    transition-duration: 500ms;
	  transition-property: opacity, visibility;

    &[hidden]:not(:hover, :focus-within) {
      opacity: 0;
      visibility: hidden;
    }
  }

  dl.tooltip {
    position: fixed;
    top: 1em;
    left: 1em;
    background-color: white;
    box-shadow: 10px 5px 5px rgb(0, 0, 0, 0.1);
    border-radius: 3px;
    color: black;
    padding: 0.5em;
  }

  circle {
	  transition: 200ms;
    transform-origin: center;
    transform-box: fill-box;
    fill-opacity: 50%;

    &:hover {
      transform: scale(1.5);
      fill-opacity: 100%;
    }
  }

  .selected {
    fill: var(--color-accent);
  }

</style>
