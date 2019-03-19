/*!
 * Authors:
 *      jason <jasonsoop@gmail.com>
 *
 * Licensed under the MIT License.
 * Copyright (C) 2010-present Flagwind Inc. All rights reserved.
 */

import { MutationTree } from "vuex";
import flagwind from "flagwind-core";
import ArgumentException = flagwind.ArgumentException;
import * as models from "@s/models";
import State from "./state";

export function ADD(state: State, value: models.ILayerOptions): void {
    if (!value.layerType) {
        throw new ArgumentException("layerType is invalid.");
    }

    // 根据路径查找父菜单
    let item = state.findItem(value.layerType);

    if (item) {
        item = value;
    } else {
        state.items.push(value);
    }
}

export function REMOVE(state: State, layerType: string): void {
    if (!layerType) {
        throw new ArgumentException("path is invalid.");
    }

    let item = state.findItem(layerType);

    if (!item) {
        // 如果没有根据路径找到菜单项，则直接退出
        return;
    }

    let items = state.items;

    // 移除菜单项
    items.splice(items.indexOf(item), 1);
}

export default <MutationTree<State>>{
    ADD,
    REMOVE
};
