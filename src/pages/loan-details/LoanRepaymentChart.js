import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';

const defaultOptions = {
    chart: {
        type: 'line',
        height: 350,
        stacked: false
    },
    stroke: {
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
            columnWidth: '10%'
        }
    },
    xaxis: {
        type: 'datetime'
    },
    yaxis: {
        labels: {
            formatter: (value) => {
                return value.toFixed(2); // Sets the float precision of y-axis labels to 2 decimal places
            }
        }
    }
};

const LoanRepaymentChart = ({ data }) => {
    const [options, setOptions] = useState(defaultOptions);
    const [series, setSeries] = useState([]);

    useEffect(() => {
        if (data) {
            setSeries([
                {
                    name: 'Payment Due',
                    data: data.map(({ x, y }) => ({ x: x, y: y })),
                    type: 'column'
                },
                {
                    name: 'Cumulative Interest Paid',
                    data: data.map(({ x, interest }) => ({ x: x.getTime(), y: interest })),
                    type: 'line'
                },
                {
                    name: 'Cumulative Debt',
                    data: data.map(({ x, yCumulative }) => ({ x: x.getTime(), y: yCumulative })),
                    type: 'line'
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
            interest: PropTypes.number,
            yCumulative: PropTypes.number
        })
    )
};

export default LoanRepaymentChart;
