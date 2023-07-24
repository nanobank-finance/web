import React from 'react';
import { Typography, Grid, Paper } from '@material-ui/core';
import { XYPlot, XAxis, YAxis, VerticalBarSeries, LineSeries } from 'react-vis';

import { useParams } from 'react-router-dom';
import { useAuth } from 'pages/authentication/auth-forms/AuthProvider';
import { useState, useEffect } from 'react';
import ImageComponent from 'components/ImageUUID';
import LoanRepaymentChart from 'pages/loan-details/LoanRepaymentChart';

const LoanDetails = () => {
    const { loanId } = useParams();
    const { user } = useAuth();

    const [loanData, setLoanData] = useState(null);

    useEffect(() => {
        const loadLoanDetails = async () => {
            const result = await fetch(`http://127.0.0.1:8000/loan?loan_id=${loanId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                    'X-User-Uid': user.uid
                }
            }).then((res) => res.json());

            setLoanData(result);
        };

        loadLoanDetails();
    }, [loanId]);

    if (!loanData) {
        return <div>Loading...</div>;
    }

    console.log(loanData);

    const paymentData = loanData.repaymentSchedule.map((payment, index) => {
        // Assuming the amountDue for each payment includes both principal and interest,
        // we compute the cumulative total paid up to the current index
        const cumulativePaid = loanData.repaymentSchedule.slice(0, index + 1).reduce((sum, p) => sum + p.amountDue, 0);

        // The cumulative principal paid is the initial loan amount divided by the number of total payments, times the number of payments made
        const cumulativePrincipalPaid = (loanData.principalAmount / loanData.repaymentSchedule.length) * (index + 1);

        // The cumulative interest paid is the difference between the cumulative total paid and the cumulative principal paid
        const cumulativeInterestPaid = cumulativePaid - cumulativePrincipalPaid;

        // The remaining debt is the total of all payments minus the cumulative total paid
        const remainingDebt = loanData.repaymentSchedule.reduce((sum, p) => sum + p.amountDue, 0) - cumulativePaid;

        return {
            x: new Date(payment.dueDate),
            y: payment.amountDue,
            interest: cumulativeInterestPaid,
            yCumulative: remainingDebt
        };
    });

    console.log(paymentData);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper>
                    <Grid container>
                        <Grid item xs={3}>
                            <ImageComponent ipfsLink={loanData.metadata.loanImageLink} size="large" />
                        </Grid>
                        <Grid item xs={9}>
                            <Typography variant="h5">Principal Amount: {loanData.principalAmount}</Typography>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <Paper>
                    <Typography variant="h6">Repayment Schedule</Typography>
                    <LoanRepaymentChart data={paymentData} />
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
                            {loanData.repaymentSchedule.map((payment) => (
                                <tr key={payment.paymentId}>
                                    <td>
                                        <ImageComponent ipfsLink={payment.imageLink} />
                                    </td>
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
