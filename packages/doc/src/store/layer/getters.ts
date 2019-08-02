/*!
 * Authors:
 *      jason <jasonsoop@gmail.com>
 * 
 * Licensed under the MIT License.
 * Copyright (C) 2010-present Flagwind Inc. All rights reserved. 
 */

import * as models from "@s/models";
import { GetterTree } from "vuex";
import State from "./state";

export function items(state: State): Array<models.ILayerOptions>
{
    return state.items;
}

export function item(state: State): Function
{
    return (layerType: string) =>
    {
        return state.findItem(layerType);
    };
}

export default <GetterTree<State, any>>
{
    items,
    item
};
