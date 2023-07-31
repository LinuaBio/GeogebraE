<script lang="ts">
  import { readLSB } from "@/libs/lsb";
  import {
    openDialog,
  } from "@/libs/method";

  export let detail;
  let scr = detail.element.getElementsByTagName("img")[0].src;
  function openGeogebra() {
    openDialog(detail.element.parentElement.parentElement.dataset.nodeId, (ggbApplet)=>{
      readLSB(scr, (data) => {
      // console.log(data);
      ggbApplet.setBase64(data)
    })
    });
  }
</script>

<button class="b3-menu__item" on:click={openGeogebra}>
  <div class="b3-menu__icon">G</div>
  <span class="b3-menu__label">用GeogebraE打开</span>
</button>