
import React from "react"
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Legend,
} from "bizcharts"
import DataSet from "@antv/data-set"
export default class Line extends React.Component {
    render() {
        const data = [
            {
                month: "Jan",
                管理层: 7,
                员工: 39,
                所有用户: 59
            },
            {
                month: "Feb",
                管理层: 6,
                员工: 42,
                所有用户: 59
            },
            {
                month: "Mar",
                管理层: 9,
                员工: 50,
                所有用户: 69
            },
            {
                month: "Apr",
                管理层: 14,
                员工: 60,
                所有用户: 85
            },
            {
                month: "May",
                管理层: 4,
                员工: 95,
                所有用户: 129
            },
            {
                month: "Jun",
                管理层: 5,
                员工: 122,
                所有用户: 140
            },
            {
                month: "Jul",
                管理层: 2,
                员工: 150,
                所有用户: 162
            },
            {
                month: "Aug",
                管理层: 5,
                员工: 136,
                所有用户: 159
            },
            {
                month: "Sep",
                管理层: 3,
                员工: 102,
                所有用户: 147
            },
            {
                month: "Oct",
                管理层: 8,
                员工: 103,
                所有用户: 129
            },
            {
                month: "Nov",
                管理层: 9,
                员工: 66,
                所有用户: 109
            },
            {
                month: "Dec",
                管理层: 5,
                员工: 48,
                所有用户: 70
            }
        ]
        const ds = new DataSet()
        const dv = ds.createView().source(data)
        dv.transform({
            type: "fold",
            fields: ["管理层", "员工", "所有用户"],
// 展开字段集
            key: "city",
// key 字段
            value: "temperature" // value 字段
        })
        const cols = {
            month: {
                range: [0, 1]
            }
        }
        return (
            <div style={{float: 'right', width: 700, height: 300}}>
                <div>
                    <h3>活跃用户</h3>
                </div>
                <Chart height={250} data={dv} scale={cols} forceFit>
                    <Legend/>
                    <Axis name="month"/>
                    <Axis
                        name="temperature"
                        label={{
                            formatter: val => `${val}位`
                        }}
                    />
                    <Tooltip
                        crosshairs={{
                            type: "y"
                        }}
                    />
                    <Geom
                        type="line"
                        position="month*temperature"
                        size={2}
                        color={"city"}
                        shape={"smooth"}
                    />
                    <Geom
                        type="point"
                        position="month*temperature"
                        size={4}
                        shape={"circle"}
                        color={"city"}
                        style={{
                            stroke: "#fff",
                            lineWidth: 1
                        }}
                    />
                </Chart>
            </div>
        )
    }

}
