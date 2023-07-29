// ant design
import { Table, Button, Form, InputNumber, Modal, DatePicker, Tooltip } from 'antd';
import dayjs from 'dayjs';

// project import
import { useAuth } from 'pages/authentication/auth-forms/AuthProvider';
import secureStorage from 'utils/secureStorage';

// react
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const MarketApplications = () => {
    const rootRef = useRef(null);
    const [isOfferModalVisible, setIsOfferModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [dataLoading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [expiryDate, setExpiryDate] = useState(null);
    const [maturityDate, setMaturityDate] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [record, setRecord] = useState(null);
    const [transactionStatus, setTransactionStatus] = useState(null);
    const { user, loading } = useAuth();
    const navigation = useNavigate();

    const handleOfferCancel = () => {
        setIsOfferModalVisible(false);
    };

    const handleOfferOk = () => {
        const values = form.getFieldsValue();
        const startDate = dayjs(values.start);
        const expiryDate = dayjs(values.expiry);
        const maturityDate = dayjs(values.maturity);

        if (expiryDate.isAfter(startDate)) {
            Modal.error({
                title: 'Error',
                content: 'The start date must be after the offer expiry date.'
            });
            return;
        }

        if (startDate.isAfter(maturityDate)) {
            Modal.error({
                title: 'Error',
                content: 'The start date must be before the maturity date.'
            });
            return;
        }

        form.validateFields()
            .then((values) => {
                form.resetFields();
                createLoanOffer(values, user);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const createLoanOffer = async (values, user) => {
        console.log(values);
        const borrower = record.borrower; // Pull borrower from record
        const principal = record.amount_asking; // Pull principal from record
        const startDate = dayjs(values.start).valueOf();
        const expiryDate = dayjs(values.expiry).valueOf();
        const maturityDate = dayjs(values.maturity).valueOf();
        const walletSessionKey = secureStorage.get('walletSessionKey');

        const loanOffer = {
            borrower,
            principal,
            interest: values.interest / 100.0, // Convert to a percentage
            payments: values.payments,
            start: startDate,
            expiry: expiryDate,
            maturity: maturityDate
        };

        try {
            // Send the loan offer to the backend
            const response = await fetch('http://localhost:8000/loan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                    'X-User-Uid': `${user.uid}`
                },
                body: JSON.stringify(loanOffer)
            });

            const result = await response.json();

            navigation.navigate(`/loan/${result.metadata.loan}`);
        } catch (error) {
            console.log(error);
        }
    };

    const handleButtonClick = (record) => {
        console.log('Button was clicked for record: ', record);
        setRecord(record); // set the record
        setIsOfferModalVisible(true); // show the modal
    };

    const loanApplicationColumns = [
        {
            title: 'Application ID',
            dataIndex: 'application',
            key: 'application'
        },
        {
            title: 'Borrower',
            dataIndex: 'borrower',
            key: 'borrower'
        },
        {
            title: 'Asking',
            dataIndex: 'amount_asking',
            key: 'amount_asking'
        },
        {
            title: 'Created',
            dataIndex: 'created',
            key: 'created'
        },
        {
            title: 'Closed',
            dataIndex: 'closed',
            render: (text, record) => (record.closed ? 'Yes' : 'No'),
            key: 'closed'
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) => <Button onClick={() => handleButtonClick(record)}>Fund</Button>,
            key: 'action'
        }
    ];

    useEffect(() => {
        load_endpoint(
            user,
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

    const addKeys = (items) => {
        // Add key prop to each item in the array
        return items.map((item, index) => {
            return { ...item, key: index };
        });
    };

    const handleOfferExpiryDateChange = (dates) => {
        if (dates && dates.length > 0) {
            setExpiryDate(dates[0]);
        } else {
            setExpiryDate(null);
        }
    };

    const handleMaturityDateChange = (dates) => {
        if (dates && dates.length > 0) {
            setMaturityDate(dates[0]);
        } else {
            setMaturityDate(null);
        }
    };

    const handleStartDateChange = (dates) => {
        if (dates && dates.length > 0) {
            setStartDate(dates[0]);
        } else {
            setStartDate(null);
        }
    };

    return (
        <div ref={rootRef}>
            <Modal
                title="Create Loan Offer"
                visible={isOfferModalVisible}
                onOk={handleOfferOk}
                onCancel={handleOfferCancel}
                destroyOnClose={true}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="start"
                        label={<Tooltip title="Date that the loan starts">Start Date</Tooltip>}
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            onChange={handleStartDateChange}
                            value={expiryDate ? [expiryDate] : []}
                        />
                    </Form.Item>
                    <Form.Item
                        name="maturity"
                        label={<Tooltip title="Date that the borrower's final loan payment is due">Maturity Date</Tooltip>}
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            onChange={handleMaturityDateChange}
                            value={maturityDate ? [maturityDate] : []}
                        />
                    </Form.Item>
                    <Form.Item
                        name="payments"
                        label={<Tooltip title="Number of payment intervals for the borrower">Number of Payments</Tooltip>}
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item
                        name="interest"
                        label={<Tooltip title="Amount of interest on the loan">Interest Rate</Tooltip>}
                        initialValue={5}
                        rules={[
                            { required: true, message: 'Required' },
                            {
                                validator: (_, value) =>
                                    value > 0 ? Promise.resolve() : Promise.reject(new Error('Interest Rate must be greater than 0'))
                            }
                        ]}
                    >
                        <InputNumber
                            min={0.01}
                            max={100}
                            step={0.01}
                            precision={2}
                            formatter={(value) => `${Number(value).toFixed(2)}%`}
                            parser={(value) => value.replace('%', '')}
                        />
                    </Form.Item>
                    <Form.Item
                        name="expiry"
                        label={<Tooltip title="Date that the offer will expire">Offer Expiry</Tooltip>}
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            onChange={handleOfferExpiryDateChange}
                            value={expiryDate ? [expiryDate] : []}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Table columns={loanApplicationColumns} dataSource={addKeys(items)} />
        </div>
    );
};

export default MarketApplications;
