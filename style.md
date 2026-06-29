<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Nexus Lab | Science Simulation Platform</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github-dark.min.css" rel="stylesheet">
<style>
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');

        :root {
            --safety-red: #ff0000;
            --carbon: #ffffff;
            --carbon-light: #ffffff;
            --on-carbon: #000000;
            --heavy-black: #000000;
        }

        body {
            background-color: var(--carbon);
            color: var(--on-carbon);
            font-family: 'Geist', sans-serif;
            scroll-behavior: smooth;
        }

        .brutalist-border {
            border: 2px solid var(--heavy-black);
        }

        .bento-card {
            border: 2px solid var(--heavy-black);
            background: var(--carbon-light);
            transition: all 0.1s steps(2);
            cursor: pointer;
        }

        .bento-card:hover {
            transform: translate(-4px, -4px);
            box-shadow: 4px 4px 0px var(--heavy-black);
        }

        .nav-dropdown {
            opacity: 0;
            visibility: hidden;
            transform: translateY(0);
            transition: all 0.1s steps(2);
        }

        .nav-item:hover .nav-dropdown {
            opacity: 1;
            visibility: visible;
        }

        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24;
        }

        ::-webkit-scrollbar {
            width: 12px;
        }
        ::-webkit-scrollbar-track {
            background: var(--carbon);
        }
        ::-webkit-scrollbar-thumb {
            background: var(--heavy-black);
            border: 3px solid var(--carbon);
        }

        .sim-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(255, 255, 255, 0.98);
            z-index: 100;
            backdrop-filter: blur(4px);
        }

        .sim-overlay.active {
            display: flex;
        }
    </style>
<script id="tailwind-config">tailwind.config = {darkMode: "class", theme: {extend: {colors: {primary: "#ff0000", "on-primary": "#ffffff", background: "#ffffff", surface: "#ffffff", "on-surface": "#000000", outline: "#000000", "physics-indigo": "#000000", "biology-green": "#000000", "chemistry-cyan": "#000000", "on-secondary-fixed-variant": "#000000", "outline-variant": "#000000", "tertiary-fixed-dim": "#ff0000", "secondary-fixed-dim": "#000000", "on-tertiary": "#ffffff", "on-surface-variant": "#000000", error: "#ff0000", "on-secondary-container": "#000000", "on-tertiary-container": "#ffffff", "on-primary-fixed": "#ffffff", "on-error": "#ffffff", "surface-dim": "#f5f5f5", "surface-container-high": "#ffffff", "on-error-container": "#ffffff", "primary-container": "#ff0000", "on-tertiary-fixed-variant": "#ffffff", "on-background": "#000000", "tertiary-fixed": "#ff0000", "surface-bright": "#ffffff", "on-primary-container": "#ffffff", "secondary-fixed": "#000000", "inverse-on-surface": "#ffffff", "on-secondary": "#ffffff", "inverse-surface": "#000000", "primary-fixed-dim": "#ff0000", "on-primary-fixed-variant": "#ffffff", "surface-container-highest": "#000000", "error-container": "#ff0000", "surface-tint": "#ff0000", "surface-container": "#ffffff", "surface-container-lowest": "#ffffff", "on-tertiary-fixed": "#ffffff", "secondary-container": "#000000", "on-secondary-fixed": "#ffffff", tertiary: "#ff0000", "tertiary-container": "#ff0000", "surface-variant": "#ffffff", "primary-fixed": "#ff0000", "inverse-primary": "#ff0000", secondary: "#000000", "surface-container-low": "#ffffff"}, borderRadius: {DEFAULT: "0", lg: "0", xl: "0", full: "0"}, spacing: {unit: "4px", xl: "48px", xs: "4px", sm: "8px", md: "16px", "container-max": "1440px", gutter: "16px", lg: "24px", "sidebar-width": "240px"}, fontFamily: {"body-sm": ["Geist"], "headline-sm": ["Geist"], "headline-lg": ["Geist"], "body-md": ["Geist"], "label-mono": ["JetBrains Mono"], display: ["Geist"], "headline-lg-mobile": ["Geist"], headline: ["Geist"], body: ["Geist"], label: ["Jetbrains Mono"]}, fontSize: {"label-mono": ["12px", {lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "700"}], "headline-lg-mobile": ["20px", {lineHeight: "28px", fontWeight: "800"}], "body-md": ["14px", {lineHeight: "20px", fontWeight: "400"}], display: ["36px", {lineHeight: "44px", letterSpacing: "-0.04em", fontWeight: "900"}], "headline-lg": ["24px", {lineHeight: "32px", letterSpacing: "-0.02em", fontWeight: "800"}], "body-sm": ["13px", {lineHeight: "18px", fontWeight: "400"}], "headline-sm": ["18px", {lineHeight: "24px", fontWeight: "700"}]}}}};</script>
</head>
<body class="flex flex-col min-h-screen p-md gap-md" style="overflow: auto;">
<!-- Detail View Overlay -->
<div class="sim-overlay items-center justify-center p-md" id="detail-overlay">
<div class="brutalist-border bg-white w-full max-w-5xl max-h-[921px] overflow-y-auto flex flex-col md:flex-row">
<div class="md:w-1/2 border-r-2 border-black relative">
<img alt="Simulation Preview" class="w-full h-full object-cover grayscale" id="detail-image" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq6IjxYGhOOtOj5T-8JF5v2BLuVTAoo-ToZnrVQLs_YbmlGFOO_wkg9GCjWRA18Oooxr0c_XMDDPliMmBeTk4BjdgJLQZk_Ha-eYWDRZTAS9N9li2sK9uTFnxR0K7Mk8z3XpWgg0XKSOs4IWdtm6Ey81wnzJQ9eERESuW20MMgVtYfQaIvTBjsAKMTMsVwS0zkCd-0w2MTXdzDPLJTdKQ12JxEVXAgxmJshhimnpWNOPShi9uPSXOnr0odeExI_DhYPM8efeu98dc">
<button class="absolute top-md left-md bg-black text-white p-sm brutalist-border flex items-center gap-xs font-label-mono text-xs font-bold hover:bg-primary transition-colors" onclick="closeDetail()">
<span class="material-symbols-outlined text-sm">arrow_back</span> BACK TO HUB
            </button>
</div>
<div class="md:w-1/2 p-xl space-y-lg flex flex-col bg-white">
<div class="space-y-sm">
<div class="inline-block px-md py-xs font-label-mono text-[10px] uppercase font-bold text-white bg-black" id="detail-tag">QUANTUM</div>
<h2 class="font-display text-5xl font-black uppercase tracking-tighter text-black" id="detail-title">SUBATOMIC COLLIDER</h2>
</div>
<p class="font-body-md text-lg text-black" id="detail-desc">Model high-energy particle collisions and observe decay patterns in real-time within a simulated vacuum chamber.</p>
<div class="space-y-md flex-grow">
<h4 class="font-label-mono text-xs font-bold uppercase underline text-black">System Parameters</h4>
<div class="grid grid-cols-2 gap-sm">
<div class="brutalist-border p-sm bg-white">
<span class="block font-label-mono text-[10px] opacity-60 uppercase text-black">Complexity</span>
<span class="font-label-mono text-sm uppercase font-bold text-black">Level 09</span>
</div>
<div class="brutalist-border p-sm bg-white">
<span class="block font-label-mono text-[10px] opacity-60 uppercase text-black">Runtime</span>
<span class="font-label-mono text-sm uppercase font-bold text-black">Real-time</span>
</div>
</div>
</div>
<button class="bg-primary text-white font-label-mono font-black uppercase text-lg px-xl py-md brutalist-border hover:bg-black transition-colors">
                Initialize Simulation
            </button>
</div>
</div>
</div>
<!-- Strict Nav -->
<nav class="brutalist-border bg-white h-16 sticky top-md z-50">
<div class="flex justify-between items-center h-full px-md max-w-container-max mx-auto">
<div class="flex items-center gap-sm cursor-pointer border-r-2 border-black h-full pr-lg" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
<img alt="Nexus Lab Logo" class="h-8 w-8 object-contain" src="https://lh3.googleusercontent.com/aida/AP1WRLtD5gxtWAONp_GyiqQAeXy5A_z5F4LbS5NJZY8dSup2sMw3bp9tpia6ZGG4IhGM5yuRaPBJoLXkNPVGiPCIIu_7mbEhMK3tMWBP40jCliluSjh-ZNiR2x2vI7SE74CyZeVvp4EMgeGVypLvQ_Vw8_fJOHlbO8Y3RxkeYDyhbTc4f7tNpc5FJmut1bUHMCmOf3EKSuADkWFRWMmd4oaIFNIAsJqfU6XDbQvpz8YMo3QJ3zcnu0XnVlj-tLQ">
<span class="font-label-mono text-xl font-black uppercase tracking-tighter text-black">Nexus Lab</span>
</div>
<div class="hidden md:flex items-center h-full">
<button class="px-lg font-label-mono text-sm uppercase font-black bg-primary text-white h-full flex items-center border-r-2 border-black" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">Home</button>
<div class="nav-item relative h-full flex items-center border-r-2 border-black px-lg cursor-pointer hover:bg-black hover:text-white group">
<button class="font-label-mono text-sm uppercase font-black" onclick="filterGrid('physics')">Physics</button>
<div class="nav-dropdown absolute top-[62px] left-[-2px] w-64 brutalist-border bg-white p-sm shadow-[4px_4px_0px_black]">
<ul class="space-y-xs font-label-mono text-xs uppercase">
<li class=""><button class="block w-full text-left p-sm hover:bg-primary hover:text-white font-bold" onclick="filterGrid('physics', 'Quantum')">Quantum Mechanics</button></li>
<li class=""><button class="block w-full text-left p-sm hover:bg-primary hover:text-white font-bold" onclick="filterGrid('physics', 'Relativity')">Relativity</button></li>
<li class=""><button class="block w-full text-left p-sm hover:bg-primary hover:text-white font-bold" onclick="filterGrid('physics')">All Physics</button></li>
</ul>
</div>
</div>
<div class="nav-item relative h-full flex items-center border-r-2 border-black px-lg cursor-pointer hover:bg-black hover:text-white">
<button class="font-label-mono text-sm uppercase font-black" onclick="filterGrid('chemistry')">Chemistry</button>
<div class="nav-dropdown absolute top-[62px] left-[-2px] w-64 brutalist-border bg-white p-sm shadow-[4px_4px_0px_black]">
<ul class="space-y-xs font-label-mono text-xs uppercase">
<li class=""><button class="block w-full text-left p-sm hover:bg-primary hover:text-white font-bold" onclick="filterGrid('chemistry', 'Covalent')">Molecular/Covalent</button></li>
<li class=""><button class="block w-full text-left p-sm hover:bg-primary hover:text-white font-bold" onclick="filterGrid('chemistry', 'Crystal')">Crystal Structures</button></li>
<li class=""><button class="block w-full text-left p-sm hover:bg-primary hover:text-white font-bold" onclick="filterGrid('chemistry')">All Chemistry</button></li>
</ul>
</div>
</div>
<div class="nav-item relative h-full flex items-center border-r-2 border-black px-lg cursor-pointer hover:bg-black hover:text-white">
<button class="font-label-mono text-sm uppercase font-black" onclick="filterGrid('biology')">Biology</button>
<div class="nav-dropdown absolute top-[62px] left-[-2px] w-64 brutalist-border bg-white p-sm shadow-[4px_4px_0px_black]">
<ul class="space-y-xs font-label-mono text-xs uppercase">
<li class=""><button class="block w-full text-left p-sm hover:bg-primary hover:text-white font-bold" onclick="filterGrid('biology', 'Cellular')">Cellular Biology</button></li>
<li class=""><button class="block w-full text-left p-sm hover:bg-primary hover:text-white font-bold" onclick="filterGrid('biology', 'Genomic')">Genetics/CRISPR</button></li>
<li class=""><button class="block w-full text-left p-sm hover:bg-primary hover:text-white font-bold" onclick="filterGrid('biology')">All Biology</button></li>
</ul>
</div>
</div>
</div>
<div class="flex items-center gap-md h-full pl-lg border-l-2 border-black">
<div class="relative hidden sm:block">
<input class="bg-transparent border-2 border-black px-md py-xs font-label-mono text-xs uppercase w-48 focus:ring-0 focus:border-primary outline-none text-black" placeholder="SEARCH..." type="text">
</div>
<button class="hover:text-primary text-black"><span class="material-symbols-outlined">settings</span></button>
<button class="hover:text-primary text-black"><span class="material-symbols-outlined">account_circle</span></button>
</div>
</div>
</nav>
<!-- Hero Block -->
<header class="brutalist-border bg-white p-xl text-center flex flex-col items-center justify-center relative overflow-hidden min-h-screen" id="hero-section">
<div class="absolute top-0 left-0 p-sm border-b-2 border-r-2 border-black font-label-mono text-[10px] bg-black text-white uppercase font-bold">
        System Status: Nominal
    </div>
<div class="max-w-4xl space-y-lg">
<div class="inline-block brutalist-border px-md py-xs font-label-mono text-xs uppercase bg-black text-white font-black">
            v4.2.0 Experimental Labs Active
        </div>
<h1 class="font-display text-5xl md:text-8xl font-black uppercase leading-none tracking-tighter text-black">
            Interactive Science at the <span class="text-primary">Edge of Discovery</span>
</h1>
<p class="font-body-md text-xl max-w-2xl mx-auto text-black font-medium">
            Explore high-fidelity mathematical simulations designed for researchers and educators. 
            Experience the mechanics of the universe through data-driven visualization.
        </p>
<div class="flex flex-wrap justify-center gap-md pt-lg">
<button class="bg-primary text-white font-label-mono font-black uppercase text-xl px-xl py-md brutalist-border hover:bg-black transition-colors" onclick="document.getElementById('sim-grid-header').scrollIntoView({behavior: 'smooth'})">
                Explore Simulations
            </button>
</div>
</div>
</header>
<!-- Main Grid Section -->
<main class="flex flex-col gap-md">
<!-- Filters Bar -->
<div class="brutalist-border bg-white p-md flex flex-col md:flex-row justify-between items-center gap-md" id="sim-grid-header">
<div>
<h2 class="font-label-mono text-2xl font-black uppercase text-black">Available Modules</h2>
<p class="font-label-mono text-[10px] uppercase font-bold text-black">Filter: <span class="text-primary" id="active-filter">All Disciplines</span></p>
</div>
<div class="flex flex-wrap gap-xs">
<button class="filter-chip brutalist-border px-lg py-sm font-label-mono text-xs font-black uppercase bg-primary text-white" onclick="filterGrid('all')">ALL</button>
<button class="filter-chip brutalist-border px-lg py-sm font-label-mono text-xs font-black uppercase bg-white text-black hover:bg-black hover:text-white" onclick="filterGrid('physics')">PHYSICS</button>
<button class="filter-chip brutalist-border px-lg py-sm font-label-mono text-xs font-black uppercase bg-white text-black hover:bg-black hover:text-white" onclick="filterGrid('chemistry')">CHEMISTRY</button>
<button class="filter-chip brutalist-border px-lg py-sm font-label-mono text-xs font-black uppercase bg-white text-black hover:bg-black hover:text-white" onclick="filterGrid('biology')">BIOLOGY</button>
</div>
</div>
<!-- Bento Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md transition-opacity duration-200" id="sim-grid">
<!-- Physics -->
<div class="bento-card flex flex-col active" data-category="physics" data-topic="Quantum" onclick="openDetail(this)" tabindex="0">
<div class="aspect-square border-b-2 border-black relative group overflow-hidden">
<img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq6IjxYGhOOtOj5T-8JF5v2BLuVTAoo-ToZnrVQLs_YbmlGFOO_wkg9GCjWRA18Oooxr0c_XMDDPliMmBeTk4BjdgJLQZk_Ha-eYWDRZTAS9N9li2sK9uTFnxR0K7Mk8z3XpWgg0XKSOs4IWdtm6Ey81wnzJQ9eERESuW20MMgVtYfQaIvTBjsAKMTMsVwS0zkCd-0w2MTXdzDPLJTdKQ12JxEVXAgxmJshhimnpWNOPShi9uPSXOnr0odeExI_DhYPM8efeu98dc">
<div class="absolute top-0 left-0 bg-black text-white font-label-mono text-[10px] px-sm py-1 font-black uppercase border-r-2 border-b-2 border-black">Quantum</div>
</div>
<div class="p-md flex-grow flex flex-col justify-between bg-white">
<div>
<h3 class="font-label-mono text-lg font-black uppercase leading-tight mb-sm text-black">Subatomic Collider</h3>
<p class="font-body-sm text-xs text-black leading-relaxed">Model high-energy particle collisions and observe decay patterns in real-time within a simulated vacuum chamber.</p>
</div>
<div class="mt-md pt-md border-t-2 border-black/10 flex flex-wrap gap-xs">
<span class="font-label-mono text-[10px] border border-black px-xs uppercase font-bold">LHC-V4</span>
<span class="font-label-mono text-[10px] border border-black px-xs uppercase font-bold">DATA-INTENSIVE</span>
</div>
</div>
</div>
<!-- Chemistry -->
<div class="bento-card flex flex-col" data-category="chemistry" data-topic="Covalent" onclick="openDetail(this)" tabindex="0">
<div class="aspect-square border-b-2 border-black relative group overflow-hidden">
<img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArTXdgXxD5nXjIQWbhd823PPk1GAZn5tkPkKAQgWTPKoue2XR9S7w0sfAdcDltOLYYr0wTfsZhsUQdA8hDmakplvcIWqA7KNG8roYjnuAov8mrJ8vN_aBY1X8_IMY5TzMV5B3d1QOhuqhYOHacezTwtpzVxKcMvgAiHWzqSEyKnzpNm6391HJkH-_D71Q-ao3awewYIEqHyP9BLRo-ziqouDwF4vB-UTXzgaNgr-fRbqgtO7UwE2zVRZ4L79mCpHbW5gYcniCk90k">
<div class="absolute top-0 left-0 bg-black text-white font-label-mono text-[10px] px-sm py-1 font-black uppercase border-r-2 border-b-2 border-black">Covalent</div>
</div>
<div class="p-md flex-grow flex flex-col justify-between bg-white">
<div>
<h3 class="font-label-mono text-lg font-black uppercase leading-tight mb-sm text-black">Molecular Workbench</h3>
<p class="font-body-sm text-xs text-black leading-relaxed">Construct complex hydrocarbons and simulate thermal reaction kinetics in three-dimensional space.</p>
</div>
<div class="mt-md pt-md border-t-2 border-black/10 flex flex-wrap gap-xs">
<span class="font-label-mono text-[10px] border border-black px-xs uppercase font-bold">3D ENGINE</span>
<span class="font-label-mono text-[10px] border border-black px-xs uppercase font-bold">ACADEMIC</span>
</div>
</div>
</div>
<!-- Biology -->
<div class="bento-card flex flex-col" data-category="biology" data-topic="Cellular" onclick="openDetail(this)" tabindex="0">
<div class="aspect-square border-b-2 border-black relative group overflow-hidden">
<img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFGlg8U-9f9I-MXsHavQYGZ21u-Jjw42B1pfB2aRpdZaTIgmMOUhL-ouuV_vZU0YpFugyOCqe4MZgpukvx0WEVw_sIkL0-1SVpcgpx1TABZ3SrSfKFsE6cCzwM_mioMxrRDSBJ_vS0mtFH2k4cpT22GzqnUNgExTWJfgETuwG_b-HlNTq-DEGMHuFvCunmsmTUfzeja0DVGbjwqDCUa0peGUyH89o0I--4B8MAjRfJgRMkH5t7oYwE800ulW0KhYCP6kzpF7Inp2Q">
<div class="absolute top-0 left-0 bg-black text-white font-label-mono text-[10px] px-sm py-1 font-black uppercase border-r-2 border-b-2 border-black">Cellular</div>
</div>
<div class="p-md flex-grow flex flex-col justify-between bg-white">
<div>
<h3 class="font-label-mono text-lg font-black uppercase leading-tight mb-sm text-black">Cytosis Navigator</h3>
<p class="font-body-sm text-xs text-black leading-relaxed">Navigate the intracellular environment and interact with organelles to understand metabolic pathways.</p>
</div>
<div class="mt-md pt-md border-t-2 border-black/10 flex flex-wrap gap-xs">
<span class="font-label-mono text-[10px] border border-black px-xs uppercase font-bold">RT-BIO</span>
</div>
</div>
</div>
<!-- Physics -->
<div class="bento-card flex flex-col" data-category="physics" data-topic="Relativity" onclick="openDetail(this)" tabindex="0">
<div class="aspect-square border-b-2 border-black relative group overflow-hidden">
<img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAz4C10iaiol5xA24XGom3J_8G35pvSKHxHBVBCNYS-xJ1n43mzij8uUA40bl6vVy1KBymQbe7tniQIMnTHtl62i7uhuY7beXgeCNFbTdTlg5u-nbpL8k_-kycMnyXeggDe_7Rd8AOcLzxYmPsiT1ApknZkpFs5Wcu8U51084pgF41EMD5FWwnNbrv9UAEtebu27LXemlF9PnR2CVOSQaJ3fGfsGp6-YLIUoPvumH6aLSlv-plXqtAXwNfy0MaFyVladN17LMMOfMk">
<div class="absolute top-0 left-0 bg-black text-white font-label-mono text-[10px] px-sm py-1 font-black uppercase border-r-2 border-b-2 border-black">Relativity</div>
</div>
<div class="p-md flex-grow flex flex-col justify-between bg-white">
<div>
<h3 class="font-label-mono text-lg font-black uppercase leading-tight mb-sm text-black">Event Horizon Visualizer</h3>
<p class="font-body-sm text-xs text-black leading-relaxed">A general relativity simulator focused on gravitational lensing and photon sphere orbits.</p>
</div>
<div class="mt-md pt-md border-t-2 border-black/10 flex flex-wrap gap-xs">
<span class="font-label-mono text-[10px] border border-black px-xs uppercase font-bold">GPU-ACCEL</span>
</div>
</div>
</div>
<!-- Chemistry -->
<div class="bento-card flex flex-col" data-category="chemistry" data-topic="Crystal" onclick="openDetail(this)" tabindex="0">
<div class="aspect-square border-b-2 border-black relative group overflow-hidden">
<img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdBnLavwqE2nrD_6lJ5kxKa4DqcvzTYWZ49xmHqOQbpiSyh6uXxta3fPUPRXjC8O_ng9w2anQ2yMmS8XV24BuGB1B1Nt49U_m9T_ZHfWnzKGagaagZz1_IQWNpQDuDDvvjk3glpwfXNbS4RYoLWojaerZ70fGEf-jLulAKEHxcSyFABwErZmCZlrzJPCLGHCXqwnUnKmQSOSj4a8LQladB1lMEyE8MPh9SwKE2tKr0RMKdPbTqsr4ifiQDqsSTTL4DqCjnpjOwzlQ">
<div class="absolute top-0 left-0 bg-black text-white font-label-mono text-[10px] px-sm py-1 font-black uppercase border-r-2 border-b-2 border-black">Crystal</div>
</div>
<div class="p-md flex-grow flex flex-col justify-between bg-white">
<div>
<h3 class="font-label-mono text-lg font-black uppercase leading-tight mb-sm text-black">Lattice Architect</h3>
<p class="font-body-sm text-xs text-black leading-relaxed">Examine crystal lattice formations and calculate structural integrity under varied environmental pressures.</p>
</div>
<div class="mt-md pt-md border-t-2 border-black/10 flex flex-wrap gap-xs">
<span class="font-label-mono text-[10px] border border-black px-xs uppercase font-bold">SOLID-STATE</span>
</div>
</div>
</div>
<!-- Biology -->
<div class="bento-card flex flex-col" data-category="biology" data-topic="Genomic" onclick="openDetail(this)" tabindex="0">
<div class="aspect-square border-b-2 border-black relative group overflow-hidden">
<img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGpaI5W_bTUpCMZdRR4HNhNt5Wrr58S4lRxaDeIxGjgrcLpugI8XD8uR_7nh-Ze6PoznR1NbV4RGp6RcjZveO4lNpmZ9CwYeFxdf2MzPmT9SkcKonFhbuq8CnRS8X26IUWSq6yVeUjNbzWPmQjoy0xBrCmeOqhu8qUKaaz083FsL8TAtSIf2uKAU58SGeb2PrgnYLza184MLxdyzu5CD6kC5gudBt_bKX-Fhf344oWPxQEy8FClS7xQDcoUd6zetxra3zzuDbAca0">
<div class="absolute top-0 left-0 bg-black text-white font-label-mono text-[10px] px-sm py-1 font-black uppercase border-r-2 border-b-2 border-black">Genomic</div>
</div>
<div class="p-md flex-grow flex flex-col justify-between bg-white">
<div>
<h3 class="font-label-mono text-lg font-black uppercase leading-tight mb-sm text-black">CRISPR Sandbox</h3>
<p class="font-body-sm text-xs text-black leading-relaxed">Experiment with sequence splicing and observe immediate phenotype expressions in virtual specimens.</p>
</div>
<div class="mt-md pt-md border-t-2 border-black/10 flex flex-wrap gap-xs">
<span class="font-label-mono text-[10px] border border-black px-xs uppercase font-bold">HPC-GEN</span>
</div>
</div>
</div>
</div>
<!-- Load More -->
<div class="brutalist-border bg-white p-xl flex justify-center">
<button class="bg-black text-white brutalist-border px-xl py-md font-label-mono font-black uppercase hover:bg-primary transition-colors flex items-center gap-sm">
<span class="material-symbols-outlined text-[18px]">cached</span>
            Load Experimental Data
        </button>
</div>
</main>
<!-- Footer -->
<footer class="brutalist-border bg-black p-xl mt-md text-white">
<div class="grid grid-cols-1 md:grid-cols-2 gap-xl max-w-container-max mx-auto">
<div class="space-y-md">
<div class="flex items-center gap-sm">
<img alt="Nexus Lab Logo" class="h-8 w-8 invert" src="https://lh3.googleusercontent.com/aida/AP1WRLtD5gxtWAONp_GyiqQAeXy5A_z5F4LbS5NJZY8dSup2sMw3bp9tpia6ZGG4IhGM5yuRaPBJoLXkNPVGiPCIIu_7mbEhMK3tMWBP40jCliluSjh-ZNiR2x2vI7SE74CyZeVvp4EMgeGVypLvQ_Vw8_fJOHlbO8Y3RxkeYDyhbTc4f7tNpc5FJmut1bUHMCmOf3EKSuADkWFRWMmd4oaIFNIAsJqfU6XDbQvpz8YMo3QJ3zcnu0XnVlj-tLQ">
<span class="font-label-mono text-2xl font-black uppercase tracking-tighter">Nexus Lab</span>
</div>
<p class="font-body-sm text-sm opacity-80 max-w-sm">
                Advancing scientific literacy through high-fidelity digital instrumentation. 
                Part of the Global Open Research Initiative.
            </p>
<div class="flex gap-md">
<a class="border-2 border-white p-xs hover:bg-primary hover:border-primary" href="#"><span class="material-symbols-outlined">terminal</span></a>
<a class="border-2 border-white p-xs hover:bg-primary hover:border-primary" href="#"><span class="material-symbols-outlined">database</span></a>
<a class="border-2 border-white p-xs hover:bg-primary hover:border-primary" href="#"><span class="material-symbols-outlined">api</span></a>
</div>
</div>
<div class="grid grid-cols-2 gap-md">
<div class="space-y-sm">
<h4 class="font-label-mono text-xs font-black uppercase text-primary underline">Resources</h4>
<ul class="space-y-xs font-label-mono text-[10px] uppercase font-bold">
<li class=""><a class="hover:text-primary" href="#">Documentation</a></li>
<li class=""><a class="hover:text-primary" href="#">Methodology</a></li>
<li class=""><a class="hover:text-primary" href="#">Lab Protocols</a></li>
</ul>
</div>
<div class="space-y-sm">
<h4 class="font-label-mono text-xs font-black uppercase text-primary underline">Compliance</h4>
<ul class="space-y-xs font-label-mono text-[10px] uppercase font-bold">
<li class=""><a class="hover:text-primary" href="#">Privacy Policy</a></li>
<li class=""><a class="hover:text-primary" href="#">Terms of Service</a></li>
<li class=""><a class="hover:text-primary" href="#">WCAG 2.1 AA</a></li>
</ul>
</div>
</div>
</div>
<div class="mt-xl pt-md border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-sm">
<span class="font-label-mono text-[10px] uppercase opacity-60 font-bold">© 2024 Science Simulation Platform. WCAG 2.1 AA Compliant.</span>
<div class="font-label-mono text-[10px] uppercase font-black bg-primary text-white px-md py-1">
            SYSTEM STATE: NOMINAL | LATENCY: 22MS
        </div>
</div>
</footer>
<script>
    function filterGrid(category, topic = null) {
        const grid = document.getElementById('sim-grid');
        const cards = grid.querySelectorAll('.bento-card');
        const chips = document.querySelectorAll('.filter-chip');
        const filterLabel = document.getElementById('active-filter');
        const header = document.getElementById('sim-grid-header');
        
        header.scrollIntoView({behavior: 'smooth'});

        grid.style.opacity = '0';
        
        setTimeout(() => {
            cards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                const cardTopic = card.getAttribute('data-topic');
                
                let matchesCategory = (category === 'all' || cardCat === category);
                let matchesTopic = (topic === null || cardTopic === topic);

                if (matchesCategory && matchesTopic) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
            
            chips.forEach(chip => {
                if (chip.innerText.toLowerCase() === category.toLowerCase() || (category === 'all' && chip.innerText === 'ALL')) {
                    chip.classList.add('bg-primary', 'text-white');
                    chip.classList.remove('bg-white', 'text-black');
                } else {
                    chip.classList.remove('bg-primary', 'text-white');
                    chip.classList.add('bg-white', 'text-black');
                }
            });

            let labelText = category.charAt(0).toUpperCase() + category.slice(1);
            if (category === 'all') labelText = 'All Disciplines';
            if (topic) labelText += ` > ${topic}`;
            
            filterLabel.innerText = labelText;
            grid.style.opacity = '1';
        }, 150);
    }

    function openDetail(card) {
        const overlay = document.getElementById('detail-overlay');
        const title = card.querySelector('h3').innerText;
        const desc = card.querySelector('p').innerText;
        const img = card.querySelector('img').src;
        const tag = card.querySelector('.absolute').innerText;

        document.getElementById('detail-title').innerText = title;
        document.getElementById('detail-desc').innerText = desc;
        document.getElementById('detail-image').src = img;
        
        const detailTag = document.getElementById('detail-tag');
        detailTag.innerText = tag;

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDetail() {
        document.getElementById('detail-overlay').classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDetail();
    });
</script>




</body></html>