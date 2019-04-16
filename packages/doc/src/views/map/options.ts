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
    <fm-map vid="esri_map" ></fm-map>
</div>
`;

let css = `
.demo {
    width:100%;
}`;

export default {
    template,
    css,
    code
}
