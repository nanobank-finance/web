import { useState, useEffect, useRef, useContext } from 'react';

// material-ui
import { Grid } from '@mui/material';

// ant design
import { Tabs, Table, Button, Form, InputNumber, Modal, DatePicker, Tooltip } from 'antd';
import dayjs from 'dayjs';

// project import
import { useAuth } from 'pages/authentication/auth-forms/AuthProvider';
import secureStorage from 'utils/secureStorage';
import ActiveLoans from './ActiveLoans';
import LoanOffers from './LoanOffers';
import Vouches from './Vouches';

// react
import { useNavigate } from 'react-router-dom';
import MarketApplications from './MarketApplications';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const columns = [
    {
        title: 'Borrower',
        dataIndex: 'borrower'
    },
    {
        title: 'Lender',
        dataIndex: 'lender'
    },
    {
        title: 'Created',
        dataIndex: 'created'
    },
    {
        title: 'Principal',
        dataIndex: 'principal'
    },
    {
        title: 'Payment Count',
        dataIndex: 'payments'
    }
];

const load_endpoint = (user, url, success_callback, failure_callback) => {
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
            'X-User-Uid': `${user.uid}`
        }
    })
        .then((res) => res.json())
        .then(
            (result) => {
                success_callback(result);
            },
            (error) => {
                failure_callback(error);
            }
        );
};

const DashboardDefault = () => {
    const [value, setValue] = useState('today');
    const [slot, setSlot] = useState('week');
    const navigate = useNavigate();

    return (
        <Grid container>
            {/* row 3 */}
            <Tabs
                defaultActiveKey="1"
                onChange={console.log}
                items={[
                    {
                        label: `Active Loans`,
                        key: '1',
                        children: <ActiveLoans></ActiveLoans>
                    },
                    {
                        label: `Loan Offers`,
                        key: '2',
                        children: <LoanOffers></LoanOffers>
                    },
                    {
                        label: `Loan Applications`,
                        key: '3',
                        children: <MarketApplications></MarketApplications>
                    },
                    {
                        label: `Credit Vouches`,
                        key: '4',
                        children: <Vouches></Vouches>
                    }
                ]}
            />
        </Grid>
    );
};

export default DashboardDefault;
