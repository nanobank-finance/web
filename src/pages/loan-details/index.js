import React, { useState, useEffect } from 'react';
import { Typography, Grid, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useAuth } from 'pages/authentication/auth-forms/AuthProvider';
import ImageComponent from 'components/ImageUUID';
import LoanRepaymentChart from 'pages/loan-details/LoanRepaymentChart';

const LoanStatusType = {
    PENDING_ACCEPTANCE: 1,
    EXPIRED_UNACCEPTED: 2,
    ACCEPTED: 3
};

const useCountdown = (endDate) => {
    const [timeLeft, setTimeLeft] = useState();

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const timeDifference = endDate - now;
            const seconds = Math.floor((timeDifference / 1000) % 60);
            const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
            const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    return timeLeft;
};

const LoanDetails = () => {
    const { loanId } = useParams();
    const { user } = useAuth();

    const [loanData, setLoanData] = useState(null);

    const offerExpiryDate = loanData ? new Date(loanData.offerExpiry) : new Date('2099-01-01');
    const timeLeft = useCountdown(offerExpiryDate);

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

    const paymentData = loanData.repaymentSchedule.map((payment, index) => {
        const cumulativePaid = loanData.repaymentSchedule.slice(0, index + 1).reduce((sum, p) => sum + p.amountDue, 0);
        const cumulativePrincipalPaid = (loanData.principalAmount / loanData.repaymentSchedule.length) * (index + 1);
        const cumulativeInterestPaid = cumulativePaid - cumulativePrincipalPaid;
        const remainingDebt = loanData.repaymentSchedule.reduce((sum, p) => sum + p.amountDue, 0) - cumulativePaid;

        return {
            x: new Date(payment.dueDate),
            y: payment.amountDue,
            interest: cumulativeInterestPaid,
            yCumulative: remainingDebt
        };
    });

    const totalRepayment = loanData.repaymentSchedule.reduce((sum, payment) => sum + payment.amountDue, 0);
    const interestRate = (totalRepayment - loanData.principalAmount) / loanData.principalAmount;
    const offerExpired = new Date() > new Date(loanData.offerExpiry);
    const headerTitle = loanData.metadata.loan_status === LoanStatusType.PENDING_ACCEPTANCE ? 'Loan Offer' : 'Loan Details';
    const acceptButtonVisible = loanData.metadata.loan_status === LoanStatusType.PENDING_ACCEPTANCE && !offerExpired;

    return (
        <Box pt={2} px={2}>
            <Grid item xs={12}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                        <ImageComponent ipfsLink={loanData.metadata.loanImageLink} size="medium" />
                    </Grid>
                    <Grid item>
                        <Typography variant="h4">{headerTitle}</Typography>
                        <Typography variant="h5">Principal Amount: {loanData.principalAmount}</Typography>
                        <Typography variant="h5">Interest Rate: {interestRate.toFixed(2)}%</Typography>
                        {!offerExpired && timeLeft && (
                            <Typography variant="h6">
                                Offer expires in:
                                {`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`}
                            </Typography>
                        )}
                        {offerExpired && <Typography variant="h6">Offer Expired</Typography>}
                        {acceptButtonVisible && (
                            <Button variant="contained" color="primary">
                                Accept Offer
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Typography variant="h6">Repayment Schedule</Typography>
                <Grid item xs={12}>
                    <Paper>
                        <Box m={500}>
                            <Box m={500}>
                                <LoanRepaymentChart data={paymentData} />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                <Typography variant="h6">Payment Details</Typography>
                <Grid item xs={12}>
                    <Paper>
                        <Box m={500}>
                            <Box m={500}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID Image</TableCell>
                                                <TableCell>Amount Due</TableCell>
                                                <TableCell>Due Date</TableCell>
                                                <TableCell>
                                                    {loanData.metadata.loan_status === LoanStatusType.ACCEPTED ? 'Make Payment' : ''}
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loanData.repaymentSchedule.map((payment) => (
                                                <TableRow key={payment.paymentId}>
                                                    <TableCell>
                                                        <Box m={1}>
                                                            <ImageComponent ipfsLink={payment.imageLink} size="medium" />
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{payment.amountDue}</TableCell>
                                                    <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        {loanData.metadata.loan_status === LoanStatusType.ACCEPTED ? (
                                                            <Button variant="contained" color="primary">
                                                                Pay Now
                                                            </Button>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoanDetails;
