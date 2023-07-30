import { useState, useEffect } from 'react';

// material-ui
import { Grid } from '@mui/material';

// ant design
import { Tabs, Table, InputNumber, Button, Modal, Form, Tooltip } from 'antd';
import moment from 'moment';

// project import
import { useAuth } from 'pages/authentication/auth-forms/AuthProvider';
import ImageComponent from 'components/ImageUUID';
import MyApplications from './MyApplications';
import Borrowing from './Borrowing';
import Lending from './Lending';
import OffersFromMe from './OffersFromMe';
import OffersToMe from './OffersToMe';

// react
import { useNavigate } from 'react-router-dom';

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
                console.log(error);
                // failure_callback(error);
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
                        label: `Active Borrowing`,
                        key: '1',
                        children: <Borrowing></Borrowing>
                    },
                    {
                        label: `Active Lending`,
                        key: '2',
                        children: <Lending></Lending>
                    },
                    {
                        label: `Open Loan Applications`,
                        key: '3',
                        children: <MyApplications></MyApplications>
                    },
                    {
                        label: `Loan Offers Received`,
                        key: '4',
                        children: <OffersToMe></OffersToMe>
                    },
                    {
                        label: `Loan Offers Sent`,
                        key: '5',
                        children: <OffersFromMe></OffersFromMe>
                    }
                ]}
            />
        </Grid>
    );
};

export default DashboardDefault;
export { load_endpoint, columns };
