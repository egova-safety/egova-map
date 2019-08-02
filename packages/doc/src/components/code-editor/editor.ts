/*!
 * Authors:
 *      jason <jasonsoop@gmail.com>
 *
 * Licensed under the MIT License.
 * Copyright (C) 2010-present Flagwind Inc. All rights reserved.
 */

import { component, Component, View, config, watch } from "@egova/flagwind-web";
import MonacoEditor from "vue-monaco";
import "./editor.less";
import opts from "./options";

/**
 * 表示一个呈现代码块的组件。
 * @class
 * @description  通过设置`lang`配置项，可以呈现不同的编程语言。
 * @version 1.0.0
 */

@component({
    template: require("./editor.html"),
    components: { MonacoEditor }
})
export default class Editor extends Component {

    @config({ default: opts.theme })
    public theme: String = opts.theme;

    // @config({ default: 500 })
    // public height: number = 500;

    @config({ default: false })
    public immediate: boolean;

    @config({ default: opts.code })
    public code: string;

    @config({ default: opts.template })
    public template: string;

    @config({ default: opts.css })
    public css: string;

    public iCode: string = "";
    public iCss: string = "";
    public iTemplate: string = "";
    public rElement: HTMLDivElement;

    public child: Component;

    @watch("code", { immediate: true })
    public onCodeChanged(nv: string, ov: string) {
        this.iCode = nv;
    }
    @watch("template", { immediate: true })
    public onTemplateChanged(nv: string, ov: string) {
        this.iTemplate = nv;
    }
    @watch("css", { immediate: true })
    public onCssChanged(nv: string, ov: string) {
        this.iCss = nv;
    }

    public get style() {
        let cssStyle = this.iCss;
        return `<style type="text/css" >${cssStyle}</style>`;
    }

    // tslint:disable-next-line:member-ordering
    public options: any = {
        automaticLayout: true
    };

    public mounted() {
        if (this.immediate) {
            this.onRunScript();
        }
    }

    public onRunScript() {
        try {
            let opt = (new Function(this.iCode))();
            opt.template = this.iTemplate;
            let comType = View.component("u-code-demo", opt);
            let pElement: HTMLElement = <HTMLElement>this.$refs["demo"];

            if (this.rElement) {
                pElement.childNodes.forEach(g => {
                    pElement.removeChild(g);
                });
                this.rElement.remove();
            }

            this.rElement = document.createElement("div");
            this.rElement.id = ("demo" + new Date().getTime());

            pElement.appendChild(this.rElement);
            let child = new comType();
            child.$mount(this.rElement);

        } catch (err) {
            console.error(err);
        }
    }
}
