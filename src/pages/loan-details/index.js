import React from 'react';
import { Typography, Grid, Paper } from '@material-ui/core';
import { XYPlot, XAxis, YAxis, VerticalBarSeries, LineSeries } from 'react-vis';

import ImageComponent from './ImageComponent';

const LoanDetails = ({ loanData }) => {
    const { principalAmount, repaymentSchedule, metadata } = loanData;

    const paymentData = repaymentSchedule.map((payment, index) => ({
        x: new Date(payment.dueDate),
        y: payment.amountDue,
        yCumulative: principalAmount - repaymentSchedule.slice(0, index + 1).reduce((sum, p) => sum + p.amountDue, 0)
    }));

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper>
                    <Grid container>
                        <Grid item xs={3}>
                            <ImageComponent ipfsLink={metadata.loanImageLink} size='large' />
                        </Grid>
                        <Grid item xs={9}>
                            <Typography variant="h4">Loan ID: {metadata.loan}</Typography>
                            <Typography variant="h5">Principal Amount: {principalAmount}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper>
                    <Typography variant="h6">Repayment Schedule</Typography>
                    <XYPlot
                        xType="time"
                        width={1000}
                        height={500}>
                        <XAxis title="Due Date" />
                        <YAxis title="Amount Due" />
                        <VerticalBarSeries data={paymentData.map(({ x, y }) => ({ x, y }))} />
                        <LineSeries data={paymentData.map(({ x, yCumulative }) => ({ x, y: yCumulative }))} />
                    </XYPlot>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper>
                    <Typography variant="h6">Payment Details</Typography>
                    <table>
                        <thead>
                            <tr>
                                <th>ID Image</th>
                                <th>Amount Due</th>
                                <th>Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {repaymentSchedule.map(payment => (
                                <tr key={payment.paymentId}>
                                    <td><ImageComponent ipfsLink={payment.imageLink} /></td>
                                    <td>{payment.amountDue}</td>
                                    <td>{new Date(payment.dueDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default LoanDetails;
