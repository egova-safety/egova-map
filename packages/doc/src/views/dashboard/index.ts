import { component, View } from "@egova/flagwind-web";
import "./index.less";
import * as models from "../../models";
@component({ template: require("./index.html") })
export default class Dashboard extends View {
    protected menu: models.IMenuItem = {
        name: "empty",
        title: "",
        visible: false
    };

    protected isCollapsed: boolean = false;

    protected rotateIcon() {
        return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    }
    protected menuitemClasses() {
        return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    }

    /**
     * 获取需要展示的菜单列表。
     * @protected
     * @property
     * @returns Array<models.IMenuItem>
     */
    protected get menus(): Array<models.IMenuItem> {
        return this.$store.getters["menu/items"];
    }

    /**
     * 获取当前需要高亮的菜单路径。
     * @protected
     * @property
     * @returns string
     */
    protected get activePath(): string {
        let path: string = this.$route.path;
        let index: number = path.lastIndexOf("/");

        if (index !== 0) {
            path = path.substring(0, path.lastIndexOf("/"));
        }

        return path;
    }

    protected created(): void {
        let list = this.getMenuItem(this.activePath, this.menus);
        if (list && list.length > 0) {
            this.menu = list[0];
        }
    }

    /**
     * 当选择菜单项时调用。
     * @protected
     * @param  {string} path 菜单路径。
     */
    protected onMenuItemSelect(path: string) {
        let list = this.getMenuItem(path, this.menus);
        if (list && list.length > 0) {
            this.menu = list[0];
        }
        if (path !== this.$route.path) {
            this.$router.push(path);
        }
    }

    protected collapsedSider() {
        (<any>this.$refs.side).toggleCollapse();
    }

    protected onRouteTo(path: string) {
        alert(path);
        this.$router.push(path);
    }

    protected getMenuItem(
        path: string,
        menus: Array<models.IMenuItem>
    ): Array<models.IMenuItem> | undefined {
        let list: Array<any> | undefined = undefined;
        for (let i = 0; i < menus.length; i++) {
            list = [];
            let g = menus[i];
            if (g.path === path) {
                list.push(g);
                return list;
            }

            if (g.children && g.children.length > 0) {
                list.push(g);
                let tmp = this.getMenuItem(path, g.children);
                if (tmp && tmp.length > 0) {
                    list.concat(...tmp);
                    return list;
                } else {
                    list = [];
                }
            }
        }
        return list;
    }
}
