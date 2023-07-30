import { useState, useEffect } from 'react';

// material-ui
import { Grid } from '@mui/material';

// ant design
import { Tabs, Table } from 'antd';

// project import
import { useAuth } from 'pages/authentication/auth-forms/AuthProvider';

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

const load_endpoint = (url, success_callback, failure_callback) => {
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

const VoucherActivity = () => {
    const [dataLoading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const { user, loading } = useAuth();

    useEffect(() => {
        load_endpoint(
            'http://127.0.0.1:8000/vouch/user/self?perspective=voucher&recent=True',
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

const VoucheeActivity = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        load_endpoint(
            'http://127.0.0.1:8000/vouch/user/self?perspective=vouchee&recent=True',
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

const LendingActivity = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        load_endpoint(
            'http://127.0.0.1:8000/loans/user/self/accepted?perspective=lender&recent=True',
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

const BorrowingActivity = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        load_endpoint(
            'http://127.0.0.1:8000/loans/user/self/accepted?perspective=borrower&recent=True',
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

const PaymentActivity = () => {
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

const ApplicationActivity = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    useEffect(() => {
        load_endpoint(
            'http://127.0.0.1:8000/loan/application/user/self?recent=True',
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

const CreditRating = () => {
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
                        label: `Voucher Activity`,
                        key: '1',
                        children: <VoucherActivity></VoucherActivity>
                    },
                    {
                        label: `Vouchee Activity`,
                        key: '2',
                        children: <VoucheeActivity></VoucheeActivity>
                    },
                    {
                        label: `Lending Activity`,
                        key: '3',
                        children: <LendingActivity></LendingActivity>
                    },
                    {
                        label: `Borrowing Activity`,
                        key: '4',
                        children: <BorrowingActivity></BorrowingActivity>
                    },
                    {
                        label: `Payment Activity`,
                        key: '5',
                        children: <PaymentActivity></PaymentActivity>
                    },
                    {
                        label: `Loan Application Activity`,
                        key: '6',
                        children: <ApplicationActivity></ApplicationActivity>
                    },
                    {
                        label: `NanoSwap Credit Rating`,
                        key: '7',
                        children: <CreditRating></CreditRating>
                    }
                ]}
            />
        </Grid>
    );
};

export default DashboardDefault;
