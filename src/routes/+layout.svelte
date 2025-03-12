<script>
    import { page } from "$app/stores";
    import "../style.css";
    let pages = [
    { url: "/", title: "Home" },
    { url: "/projects", title: "Projects" },
    { url: "/contact", title: "Contact" },
    { url: "/resume", title: "Resume" },
    {url: "https://github.com/ADJohnson314", title: "Github"},
    ];
</script>
    <nav>
        {#each pages as p}
            <a
            href={p.url}
            class:current={$page.route.id === p.url}
            target={p.url.startsWith("http") ? "_blank" : null}
            >
                {p.title}
            </a>      
        {/each}
    </nav>
<slot />
<style>
    nav {
        display: flex;
        margin-bottom: 8px;
        --border-color: oklch(50% 10% 200 / 40%);
        border-bottom: 1px solid var(--border-color);
    }

    a {
        flex: 1;
        text-decoration: none;
        color: inherit;
        text-align: center;
        padding: 0.5em;
    }

    .current {
        border-bottom: 0.4em solid var(--border-color);
    }
</style>