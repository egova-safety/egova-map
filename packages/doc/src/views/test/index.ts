import { component, View } from "@egova/flagwind-web";
import MonacoEditor from "vue-monaco";
import "./index.less";

@component({
    template: require("./index.html"),
    components: {
        MonacoEditor
    }
})
export default class TestView extends View {

    public editor: any;

    public code = `
    var options = {
        data : function(){
            return {
                firstName: '大漠',
                lastName: 'w3cplus',
                alias: '大漠_w3cplus'
            }
        },
        watch: {
        },
        created: function () {
                console.log('onCreated-1');
        },
        methods: {
        }
    }
    return options;
    `;

    public html = `
    <div class="demo">
      <div >{{firstName}}</div>
    </div>
    `;

    public css = `
    .demo {
        color: red;
    }`;

    public get style() {
        let cssStyle = this.css;
        return `<style type="text/css" >${cssStyle}</style>`;
    }

    public result: any = "";

    public options: any = {
        automaticLayout: true
    };

    public onRun() {
        // tslint:disable-next-line:no-eval
        let opt = (new Function(this.code))();
        opt.template = this.html;
        let comType = View.component("u-demo", opt);
        let comValue = new comType();
        comValue.$mount("#demo");
    }

    public onMounted(editor: any) {
        this.editor = editor;
    }

    public onCodeChange(editor: any) {
        console.log(editor.getValue());
    }
}
