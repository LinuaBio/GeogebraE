<script lang="ts">
  import { RenderingGE, download, InsetBlock, Save } from "@/libs/method";
  export let id;
  export let self;
  let fullScreen = false;
  let geogebraBox = document.getElementsByClassName("b3-dialog__body")[0];
  let toolbarHeight = document
    .getElementById("toolbar")
    .offsetHeight.toString();
  let position = {
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
  };
  function handleClick(e) {
    e.preventDefault();
    const targetId = e.target.id;
    const actions = {
      ToImage: () => download(false, () => {}),
      InsetBlock: () => InsetBlock(id),
      Save: () => Save(self),
      FullScreen: () => FullScreen(),
    };

    if (actions[targetId]) {
      actions[targetId]();
    } else {
      RenderingGE(targetId, geogebraBox.clientWidth, geogebraBox.clientHeight, ()=>{});
    }
  }

  function FullScreen() {
    let element = document.getElementsByClassName(
      "b3-dialog__container"
    )[0] as HTMLElement;
    if (fullScreen) {
      element.style.cssText = `
            height: ${position.height};
            width: ${position.width};
            top: ${position.top};
            left: ${position.left};
          `;
      fullScreen = false;
    } else {
      position = {
        height: element.style.height,
        width: element.style.width,
        top: element.style.top,
        left: element.style.left,
      };
      element.style.cssText = `
            top: ${toolbarHeight}px;
            left: 0;
            width: 100%;
            height: 100%;
          `;
      fullScreen = true;
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="menuBar">
  <div style="padding-right: 18px;">Geogebra</div>
  <div class="dropdown">
    <div class="menuBarItem" id="Model">Model</div>
    <div class="dropdown-content" on:click={handleClick}>
      <div class="dropdown-item" id="Graphing">Graphing</div>
      <div class="dropdown-item" id="Geometry">Geometry</div>
      <div class="dropdown-item" id="3D">3D</div>
      <div class="dropdown-item" id="Classic">Classic</div>
      <div class="dropdown-item" id="Suite">Suite</div>
      <div class="dropdown-item" id="Scientific">Scientific</div>
      <div class="dropdown-item" id="notes">notes</div>
    </div>
  </div>
  <div class="dropdown">
    <div class="menuBarItem" id="Function">Function</div>
    <div class="dropdown-content" on:click={handleClick}>
      <div class="dropdown-item" id="ToImage">ToImage</div>
      <div class="dropdown-item" id="InsetBlock">InsetBlock</div>
    </div>
  </div>
  <div class="menuBarItem" id="FullScreen" on:click={handleClick}>
    FullScreen
  </div>
  <!-- <div class="menuBarItem" id="Save">Save</div> -->
</div>
