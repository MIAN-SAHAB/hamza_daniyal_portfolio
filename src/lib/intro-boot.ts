export const INTRO_KEY = "hd:intro-played";

/** Devices that skip the preloader: its pointer-parallax play is desktop-only, and on phones it only delays content. */
const NO_PRELOADER_QUERY = "(max-width: 767px), (hover: none)";

/** Inline, pre-hydration script: mark returning visitors (and phones) so the preloader never flashes. */
export const introBootScript = `try{if(sessionStorage.getItem("${INTRO_KEY}")||matchMedia("${NO_PRELOADER_QUERY}").matches){document.documentElement.dataset.intro="done"}else{document.documentElement.classList.add("is-loading")}}catch(e){}`;
