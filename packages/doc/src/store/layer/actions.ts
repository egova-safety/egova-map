/*!
 * Authors:
 *      jason <jasonsoop@gmail.com>
 * 
 * Licensed under the MIT License.
 * Copyright (C) 2010-present Flagwind Inc. All rights reserved. 
 */

import * as models from "@s/models";
import { ActionTree, ActionContext } from "vuex";
import State from "./state";

export function add(store: ActionContext<State, any>, value: models.IMenuItem): void
{
    store.commit("ADD", value);
}

export function remove(store: ActionContext<State, any>, layerType: string): void
{
    store.commit("REMOVE", layerType);
}

export default <ActionTree<State, any>>
{
    add,
    remove
};
