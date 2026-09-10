export default {
    title: "flo",
    url: "https://audiflo.github.io/flo/",
    logo: { alt: "flo", href: "./" },
    theme: {
        name: "ruby",
        defaultMode: "system",
        enableModeToggle: true,
        positionMode: "top",
        codeHighlight: true,
        copyWidgets: { enabled: true, raw: true, context: true },
    },
    layout: {
        footer: {
            style: "complete",
            description: "A modern lossless and lossy audio codec with native and WebAssembly APIs.",
            branding: true,
            columns: [
                {
                    title: "Resources",
                    links: [
                        { text: "Getting Started", url: "./getting-started" },
                        { text: "Rust API", url: "./rust-api" },
                        { text: "JavaScript API", url: "./javascript-api" },
                    ],
                },
                {
                    title: "Project",
                    links: [
                        { text: "Live Demo", url: "./demo/", external: true },
                        { text: "GitHub", url: "https://github.com/Audiflo/flo" },
                        { text: "Issues", url: "https://github.com/Audiflo/flo/issues" },
                    ],
                },
            ],
        },
    },
    plugins: {
        search: { semantic: false, showConfidence: false },
        seo: {
            defaultDescription: "flo is a modern lossless and lossy audio codec with Rust and WebAssembly APIs.",
            openGraph: { defaultImage: "" },
            twitter: { cardType: "summary_large_image" },
        },
        sitemap: { defaultChangefreq: "weekly", defaultPriority: 0.8 },
        mermaid: {},
        git: {},
        llms: { fullContext: true },
    },
    search: true,
    minify: true,
    autoTitleFromH1: true,
    copyCode: true,
    pageNavigation: true,
    navigation: [
        { title: "Home", path: "/", icon: "home" },
        {
            title: "Getting Started",
            icon: "rocket",
            collapsible: false,
            children: [
                { title: "Getting Started", path: "/getting-started", icon: "play" },
                { title: "CLI Reference", path: "/cli-reference", icon: "terminal" },
            ],
        },
        {
            title: "API Reference",
            icon: "code",
            collapsible: false,
            children: [
                { title: "Rust API", path: "/rust-api", icon: "box" },
                { title: "JavaScript / WASM", path: "/javascript-api", icon: "cpu" },
            ],
        },
        {
            title: "Format and Features",
            icon: "file-text",
            collapsible: false,
            children: [
                { title: "File Format", path: "/file-format", icon: "binary" },
                { title: "Metadata", path: "/metadata-guide", icon: "tag" },
                { title: "Streaming", path: "/streaming", icon: "wind" },
            ],
        },
        {
            title: "Project",
            icon: "layers",
            collapsible: false,
            children: [
                { title: "Architecture", path: "/architecture", icon: "git-branch" },
                { title: "No-std and WASM", path: "/no-std", icon: "cpu" },
            ],
        },
        { title: "Live Demo", path: "/demo/", icon: "eye", external: true },
        { title: "GitHub", path: "https://github.com/Audiflo/flo", icon: "github", external: true },
    ],
    footer: "Built with [docmd](https://docmd.io). [View on GitHub](https://github.com/Audiflo/flo).",
    editLink: {
        enabled: true,
        baseUrl: "https://github.com/Audiflo/flo/edit/main/",
        text: "Edit this page",
    },
};