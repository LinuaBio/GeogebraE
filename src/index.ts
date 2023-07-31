import {
    Plugin, Protyle
} from "siyuan";
import "@/index.scss";
import "@/libs/deployggb.js";
import { deleteCharacterBeforeCursor, loadJSFile, openDialog } from '@/libs/method'
import ImageMenu from '@/page/image-menu.svelte'

export default class PluginSample extends Plugin {
    async onload() {
        loadJSFile('/plugins/GeogebraE/deployggb.js', ()=>{
            console.log('JavaScript 文件已加载')
        })
        this.eventBus.on("open-menu-image", this.ImageMenuEvent);
        const self = this

        self.protyleSlash = [{
            filter: ["geogebra", "dkge", "打开"],
            html: `
            <div class="b3-list-item__first">
                <div class="color__square">G</div>
                <span class="b3-list-item__text">${this.i18n.openGeogebra}</span>
            </div>`,
            id: "openGeogebra",
            callback(protyle: Protyle) {
                deleteCharacterBeforeCursor()
                let id = protyle.protyle.breadcrumb.id
                openDialog(id,()=>{})
            }
        }];
    }
    
    async onunload() {
        this.eventBus.off("open-menu-image", this.ImageMenuEvent);
    }

    private ImageMenuEvent({ detail }: any) {
        // console.log(detail);
        var imageMenu = document.getElementsByClassName("b3-menu__items")[0];
        new ImageMenu({
            target: imageMenu,
            props: {
                detail: detail 
            }
        });
        document.getElementsByClassName("b3-menu")[0].className = "b3-menu fn__none";
    }
}