    function setVh() {
    const vh=window.innerHeight*0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  window.addEventListener("resize", setVh);
  setVh();