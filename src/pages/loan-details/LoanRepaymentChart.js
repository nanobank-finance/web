import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';

const defaultOptions = {
    chart: {
        type: 'line',
        height: 350
    },
    xaxis: {
        type: 'datetime'
    },
    stroke: {
        curve: 'smooth'
    }
};

const LoanRepaymentChart = ({ data }) => {
    const [options, setOptions] = useState(defaultOptions);
    const [series, setSeries] = useState([]);

    useEffect(() => {
        if (data) {
            setSeries([
                {
                    name: 'Amount Due',
                    data: data.map(({ x, y }) => ({ x: x.getTime(), y }))
                },
                {
                    name: 'Cumulative Amount',
                    data: data.map(({ x, yCumulative }) => ({ x: x.getTime(), y: yCumulative }))
                }
            ]);
        }
    }, [data]);

    return <ReactApexChart options={options} series={series} type="line" />;
};

LoanRepaymentChart.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            x: PropTypes.instanceOf(Date),
            y: PropTypes.number,
            yCumulative: PropTypes.number
        })
    )
};

export default LoanRepaymentChart;
