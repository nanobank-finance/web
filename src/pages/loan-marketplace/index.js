import { useState, useEffect } from 'react';

// material-ui
import {
    Avatar,
    AvatarGroup,
    Box,
    Grid,
    List,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    Stack,
    Typography
} from '@mui/material';

// ant design
import { Tabs, Table, Input, Button, Space } from 'antd';

// project import
import OrdersTable from './OrdersTable';
import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

// assets
import { GiftOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

// firebase
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    getRedirectResult,
    sendEmailVerification,
    signInWithPopup,
    GoogleAuthProvider,
    TwitterAuthProvider,
    GithubAuthProvider
} from 'firebase/auth';

// react
import { useNavigate } from 'react-router-dom';

// the firebase auth api key is intended to be public
// https://stackoverflow.com/a/37484053
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
    apiKey: 'AIzaSyBQ8rb3jkIsusGKhGwGm-ri9VAjoof1OKA',
    authDomain: 'nanocryptobank.firebaseapp.com',
    projectId: 'nanocryptobank',
    storageBucket: 'nanocryptobank.appspot.com',
    messagingSenderId: '950014241040',
    appId: '1:950014241040:web:16e7f8fa0f59bcaf7b5d95',
    measurementId: 'G-H4F5Z43EKN'
};

// avatar style
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

// action style
const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

// sales report status
const status = [
    {
        value: 'today',
        label: 'Today'
    },
    {
        value: 'month',
        label: 'This Month'
    },
    {
        value: 'year',
        label: 'This Year'
    }
];

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

const load_endpoint = (url, success_callback, failure_callback) => {
    fetch(url)
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

const ActiveLoans = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        load_endpoint(
            'http://127.0.0.1:8000/loans/accepted?recent=True',
            (result) => {
                setItems(result);
                setLoading(false);
            },
            (error) => {
                setLoading(false);
            }
        );
    }, []);

    return (
        <div>
            <Table columns={columns} dataSource={items} />
        </div>
    );
};

const LoanOffers = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        load_endpoint(
            'http://127.0.0.1:8000/loans/open?recent=True',
            (result) => {
                setItems(result);
                setLoading(false);
            },
            (error) => {
                setLoading(false);
            }
        );
    }, []);

    return (
        <div>
            <Table columns={columns} dataSource={items} />
        </div>
    );
};

const Applications = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        load_endpoint(
            'http://127.0.0.1:8000/loan/application?recent=True',
            (result) => {
                setItems(result);
                setLoading(false);
            },
            (error) => {
                setLoading(false);
            }
        );
    }, []);

    return (
        <div>
            <Table columns={columns} dataSource={items} />
        </div>
    );
};

const Vouches = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        load_endpoint(
            'http://127.0.0.1:8000/vouch?recent=True',
            (result) => {
                setItems(result);
                setLoading(false);
            },
            (error) => {
                setLoading(false);
            }
        );
    }, []);

    return (
        <div>
            <Table columns={columns} dataSource={items} />
        </div>
    );
};

const DashboardDefault = () => {
    const [value, setValue] = useState('today');
    const [slot, setSlot] = useState('week');
    const navigate = useNavigate();
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    auth.useDeviceLanguage();
    const user = auth.getCurrentUser;
    console.log(user);

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
                        children: <Applications></Applications>
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