console.log("IT’S ALIVE!");

function $$ (selector, context = document) {
	return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");

// // let currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname);

// // currentLink?.classList.add("current");

// let pages = [
// 	{url: ".", title: "Home"},
// 	{url: "projects", title: "Projects"},
//     {url: "contact", title: "Contact"},
// 	{url: "resume", title: "Resume"},
//     {url: "https://github.com/ADJohnson314", title: "Github"}
// ];

// let nav = document.createElement("nav");
// document.body.prepend(nav);

// for (let p of pages) {
// 	let url = p.url;
// 	let title = p.title;
// 	// Create link and add it to nav
// 	let a = document.createElement("a");
//     a.href = url;
//     a.textContent = title;
//     if (a.host === location.host && a.pathname === location.pathname) {
//         a.classList.add("current");
//     }
//     if (a.host !== location.host) {
//         a.classList.add("target=");
//         a.target="_blank";
//     }
//     nav.append(a);
// }

let root = document.documentElement;
let colorScheme = localStorage.colorScheme ?? "light dark";
root.style.setProperty("color-scheme", colorScheme);
