import distance from "@turf/distance";
import { Point } from "./map.model";

export class MapUtils {
    /**
     * 求两点之间的距离
     * @param from 起点
     * @param to 终点
     */
    public static getLength(
        from: Point,
        to: Point,
        units: "miles" | "nauticalmiles" | "degrees" | "radians" | "inches" | "yards" | "meters" | "metres" | "kilometers" | "kilometres" = "kilometers"
    ): number {
        let distance1 = distance([from.x, from.y], [to.x, to.y], {
             units: units
        });
        return distance1;
    }

    /**
     * 增密
     * @param start 始点
     * @param end 终点
     * @param n 增加的点数
     */
    public static density(start: Point, end: Point, n: number) {
        const resList = [];
        if (n === 0) {
            resList.push(start);
            resList.push(end);
            return resList;
        }
        const xDiff = (end.x - start.x) / n;
        const yDiff = (end.y - start.y) / n;
        for (let j = 0; j < n; j++) {
            resList.push(
                new Point(start.x + j * xDiff, start.y + j * yDiff)
            );
        }
        resList.push({ x: end.x, y: end.y });
        return resList;
    }

    /**
     * 求多点之间连线的距离
     * @param points 多点集
     * @param count 抽点次数
     */
    public static distance(
        points: Array<Point>,
        count: number | null = 100
    ) {
        if (count == null) {
            count = points.length;
        }
        let interval = 1;
        if (points.length > count) {
            interval = Math.max(Math.floor(points.length / count), 1);
        }
        let length = 0,
            i = 0;
        for (i = 0; i <= points.length - interval; i = i + interval) {
            let start = points[i];
            let end = points[i + interval];
            if (start && end) {
                length += MapUtils.getLength(start, end);
            }
        }
        if (i < points.length - 1) {
            length += MapUtils.getLength(
                points[i],
                points[points.length - 1]
            );
        }

        return length;
    }
}
