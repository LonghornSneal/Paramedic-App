// Updates the CSS --vh custom property to represent 1% of the viewport height (fixes mobile 100vh issues).
  
function setVh() { const vh=window.innerHeight*0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`); }
  window.addEventListener("resize", setVh);
  setVh();
  