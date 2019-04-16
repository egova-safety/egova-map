let code = `
var options = {
    data : function(){
        return {

        }
    },
    watch: {
    },
    created: function () {

    },
    mounted: function () {

    },
    methods: {
    }
}
return options;
`;

let template = `
<div class="demo">

</div>
`;

let css = `
.demo {
    color: red;
}`;

let theme: String = "vs";

export default {
    template,
    css,
    code,
    theme
}
