"use client";

import React from 'react'
import { Treemap, ResponsiveContainer } from "recharts";
const data = [
    {
        period: "2025-09-29T00:00:00Z",
        createdBy: "gCRpy5kovs",
        userName: "harisbashir",
        userRequests: 2
    },
    {
        period: "2025-09-29T00:00:00Z",
        createdBy: "uAaXF8NPEW",
        userName: "sagartesting",
        userRequests: 1
    },
    {
        period: "2025-09-30T00:00:00Z",
        createdBy: "uAaXF8NPEW",
        userName: "sagartesting",
        userRequests: 18
    },
    {
        period: "2025-10-01T00:00:00Z",
        createdBy: "uAaXF8NPEW",
        userName: "sagartesting",
        userRequests: 14
    },
    {
        period: "2025-10-02T00:00:00Z",
        createdBy: "uAaXF8NPEW",
        userName: "sagartesting",
        userRequests: 1
    },
    {
        period: "2025-10-02T00:00:00Z",
        createdBy: "xQ9q6cmmdj",
        userName: "nabeela",
        userRequests: 3
    }
];

const treeData = [
    {
        name: "Users",
        children: data.map(d => ({
            name: `${d.userName} (${new Date(d.period).toLocaleDateString()})`,
            size: d.userRequests,
            period: d.period,
            user: d.userName
        }))
    }
];

const CustomizedContent = (props: any) => {
    const { depth, x, y, width, height, name, size } = props;
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: depth === 1 ? "#8884d8" : "#82ca9d",
                    stroke: "#fff",
                    strokeWidth: 2
                }}
                rx={12}
            />
            {width > 80 && height > 40 && (
                <text x={x + 10} y={y + 20} fill="#fff" fontSize={14}>
                    {name}
                </text>
            )}
            {width > 80 && height > 60 && (
                <text x={x + 10} y={y + 40} fill="#fff" fontSize={12}>
                    Requests: {size}
                </text>
            )}
        </g>
    );
};


const RequestPerPeriodComponent = () => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <Treemap
                data={treeData}
                dataKey="size"
                stroke="#fff"
                fill="#8884d8"
                content={<CustomizedContent />}
            />
        </ResponsiveContainer>
    )
}

export default RequestPerPeriodComponent
