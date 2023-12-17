import React, { useState } from 'react';
import { Bar } from "react-chartjs-2";

function ChartJSBar(){

    const [data, setData] = useState({
        labels: [1977, 1988, 1999, 2009, 2019],
        datasets: [{
            label: "Users Gained",
            data: [1977, 1988, 1999, 2009, 2019]
        }]
    })

    return <Bar data={data} />
}

export default ChartJSBar