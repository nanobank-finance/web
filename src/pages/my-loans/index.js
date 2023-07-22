import { useState, useEffect } from 'react';

// material-ui
import { Grid } from '@mui/material';

// ant design
import { Tabs, Table, InputNumber, Button, Modal, Form, Tooltip } from 'antd';
import moment from 'moment';

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

const loanApplicationColumns = [
    {
        title: 'Application ID',
        dataIndex: 'application'
    },
    {
        title: 'Borrower',
        dataIndex: 'borrower'
    },
    {
        title: 'Asking',
        dataIndex: 'amount_asking'
    },
    {
        title: 'Created',
        dataIndex: 'created'
    },
    {
        title: 'Closed',
        dataIndex: 'closed',
        render: (text, record) => (record.closed ? 'Yes' : 'No')
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

const Borrowing = () => {
    const [dataLoading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const { user, loading } = useAuth();

    useEffect(() => {
        load_endpoint(
            user,
            'http://127.0.0.1:8000/loans/user/self/accepted?perspective=borrower&recent=True',
            (result) => {
                // setItems(result);
                setLoading(false);
            },
            (error) => {
                setLoading(false);
            }
        );
    }, []);

    return (
        <div>
            <Table columns={columns} dataSource={[]} /> {/* items */}
        </div>
    );
};

const Lending = () => {
    const [dataLoading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const { user, loading } = useAuth();

    useEffect(() => {
        load_endpoint(
            'http://127.0.0.1:8000/loans/user/self/accepted?perspective=lender&recent=True',
            (result) => {
                // setItems(result);
                setLoading(false);
            },
            (error) => {
                setLoading(false);
            }
        );
    }, []);

    return (
        <div>
            <Table columns={columns} dataSource={[]} /> {/* items */}
        </div>
    );
};

const Applications = () => {
    const [dataLoading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const { user, loading } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const createApplication = (values) => {
        console.log(values);
        fetch('http://localhost:8000/loan/application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
                'X-User-Uid': `${user.uid}`
            },
            body: JSON.stringify(values)
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result);
                    setIsModalVisible(false);
                },
                (error) => {
                    console.log(error);
                }
            );
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                form.resetFields();
                createApplication(values); //TODO: implement this function
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        load_endpoint(
            user,
            'http://127.0.0.1:8000/loan/application/user/self?recent=True',
            (result) => {
                setItems(result);
                console.log(result);
                setLoading(false);
            },
            (error) => {
                setLoading(false);
            }
        );
    }, []);

    return (
        <div>
            <Button type="primary" onClick={showModal}>
                New Application
            </Button>
            <Modal title="New Application" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="asking"
                        label="Amount Requested"
                        rules={[{ required: true, message: 'Please input the asking amount' }]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                </Form>
            </Modal>
            <Table columns={loanApplicationColumns} dataSource={items} />
        </div>
    );
};

const OffersToMe = () => {
    const [dataLoading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const { user, loading } = useAuth();
    const [record, setRecord] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleButtonClick = (record) => {
        console.log('Button was clicked for record: ', record);
        setRecord(record); // set the record
        setIsModalVisible(true); // show the modal
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        // const values = form.getFieldsValue();
        // const startDate = dayjs(values.start);
        // const expiryDate = dayjs(values.expiry);
        // const maturityDate = dayjs(values.maturity);

        // if (expiryDate.isAfter(startDate)) {
        //     Modal.error({
        //         title: 'Error',
        //         content: 'The start date must be after the offer expiry date.'
        //     });
        //     return;
        // }

        // if (startDate.isAfter(maturityDate)) {
        //     Modal.error({
        //         title: 'Error',
        //         content: 'The start date must be before the maturity date.'
        //     });
        //     return;
        // }

        // form.validateFields()
        //     .then((values) => {
        //         form.resetFields();
        //         createLoanOffer(values, user);
        //     })
        //     .catch((info) => {
        //         console.log('Validate Failed:', info);
        //     });
        return;
    };

    const loanOfferColumns = [
        {
            title: 'Loan ID',
            dataIndex: 'loan'
        },
        {
            title: 'Borrower',
            dataIndex: 'borrower'
        },
        {
            title: 'Lender',
            dataIndex: 'lender'
        },
        {
            title: 'Principal',
            dataIndex: 'principal'
        },
        {
            title: 'Created',
            dataIndex: 'created',
            render: (text) => (
                <Tooltip title={text}>
                    <span>{moment(text).format('LL')}</span>
                </Tooltip>
            )
        },
        {
            title: 'Offer Expiry',
            dataIndex: 'offer_expiry',
            render: (text) => (
                <Tooltip title={text}>
                    <span>{moment(text).format('LL')}</span>
                </Tooltip>
            )
        },
        {
            title: 'Accepted',
            dataIndex: 'accepted',
            render: (text, record) => (record.closed ? 'Yes' : 'No')
        },
        {
            title: 'Number of Payments',
            dataIndex: 'payments'
        },
        {
            title: 'Loan Status',
            dataIndex: 'loan_status'
        },
        {
            title: 'Details',
            dataIndex: '',
            key: 'x',
            render: (text, record) => <Button onClick={() => handleButtonClick(record)}>Details</Button>,
            key: 'action'
        }
    ];

    useEffect(() => {
        load_endpoint(
            user,
            'http://127.0.0.1:8000/loans/user/self/open?perspective=borrower',
            (result) => {
                if (result.length > 0) {
                    setItems(result);
                }
                setLoading(false);
            },
            (error) => {
                setLoading(false);
            }
        );
    }, []);

    return (
        <div>
            <Modal title="Offer Details" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} destroyOnClose={true}>
                <div />
            </Modal>
            <Table columns={loanOfferColumns} dataSource={items} />
        </div>
    );
};

const OffersFromMe = () => {
    const [dataLoading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const { user, loading } = useAuth();

    useEffect(() => {
        load_endpoint(
            user,
            'http://127.0.0.1:8000/loans/user/self/open?perspective=lender&recent=True',
            (result) => {
                // setItems(result);
                setLoading(false);
            },
            (error) => {
                setLoading(false);
            }
        );
    }, []);

    return (
        <div>
            <Table columns={columns} dataSource={[]} /> {/* items */}
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
                        children: <Applications></Applications>
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
