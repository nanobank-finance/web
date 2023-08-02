import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Tooltip, Input } from 'antd';
import moment from 'moment';
import { useAuth } from 'pages/authentication/auth-forms/AuthProvider';
import { load_endpoint } from 'pages/my-loans';
import { useNavigate } from 'react-router-dom';

const OffersFromMe = () => {
    const [dataLoading, setDataLoading] = useState(false);
    const [items, setItems] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [modalVisible, setModalVisible] = useState(false);
    const [depositAddress, setDepositAddress] = useState('');
    const [selectedPrincipal, setSelectedPrincipal] = useState(0);

    useEffect(() => {
        setDataLoading(true);
        load_endpoint(
            user,
            'http://127.0.0.1:8000/loans/user/self/draft?perspective=lender',
            (result) => {
                if (result.length > 0) {
                    setItems(result);
                }
                setDataLoading(false);
            },
            (error) => {
                console.log(error);
                setDataLoading(false);
            }
        );
    }, [user]);

    const columns = [
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
            render: (text) => 'DRAFT'
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button
                    type="primary"
                    onClick={() => {
                        setDepositAddress(record.borrower_deposit_wallet);
                        setModalVisible(true);
                        setSelectedPrincipal(record.principal);
                    }}
                >
                    Submit Offer
                </Button>
            )
        }
    ];

    const handleModalOk = () => {
        setModalVisible(false);
    };

    const handleModalCancel = () => {
        setModalVisible(false);
    };

    const checkPaymentCompleted = () => {
        const paymentCheckURL = 'http://127.0.0.1:8000/payments/completed?address=' + depositAddress;

        load_endpoint(
            user,
            paymentCheckURL,
            (result) => {
                if (result) {
                    alert('Payment has been completed');
                } else {
                    alert('Payment not yet completed');
                }
            },
            (error) => {
                console.log(error);
            }
        );
    };

    const copyAddressToClipboard = () => {
        navigator.clipboard.writeText(depositAddress);
    };

    return (
        <div>
            <Table columns={columns} dataSource={items} loading={dataLoading} rowKey="loan" />
            <Modal title="Submit Offer" visible={modalVisible} onOk={handleModalOk} onCancel={handleModalCancel}>
                <p>To submit this offer, please deposit the required amount to the following address:</p>
                <Input
                    value={depositAddress}
                    readOnly
                    addonAfter={
                        <Button type="link" onClick={copyAddressToClipboard}>
                            Copy
                        </Button>
                    }
                />
                <p>
                    Amount to deposit: <strong>{selectedPrincipal}</strong>
                </p>
                <Button onClick={checkPaymentCompleted}>Check if payment is completed</Button>
            </Modal>
        </div>
    );
};

export default OffersFromMe;
