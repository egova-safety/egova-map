import { component, View } from "@egova/flagwind-web";
import * as code from "@s/codes/map";

@component({ template: require("./index.html")  })
export default class Intro extends View {
  protected code: object = code;
}
