export const INTRO_KEY = "hd:intro-played";

/** Inline, pre-hydration script: mark returning visitors so the preloader never flashes. */
export const introBootScript = `try{if(sessionStorage.getItem("${INTRO_KEY}")){document.documentElement.dataset.intro="done"}else{document.documentElement.classList.add("is-loading")}}catch(e){}`;
