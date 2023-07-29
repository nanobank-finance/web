import { useState, useEffect } from 'react';

// ant design
import { Table, Button, Modal, Tooltip } from 'antd';
import moment from 'moment';

// project import
import { useAuth } from 'pages/authentication/auth-forms/AuthProvider';
import ImageComponent from 'components/ImageUUID';

// react
import { useNavigate } from 'react-router-dom';

const OffersToMe = () => {
    const [dataLoading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const { user, loading } = useAuth();
    const [record, setRecord] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loanDetails, setLoanDetails] = useState(null);
    const navigate = useNavigate();

    const handleButtonClick = async (record) => {
        console.log('Button was clicked for record: ', record);

        // Navigate to LoanDetails page
        navigate(`/loans/${record.loan}`);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
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
                {loanDetails && (
                    <div>
                        <p>
                            <strong>Principal Amount:</strong> {loanDetails.principalAmount}
                        </p>
                        <p>
                            <strong>Offer Expiry:</strong> {moment(loanDetails.offerExpiry).format('LL')}
                        </p>
                        <h4>Loan Image:</h4>
                        <ImageComponent ipfsLink={loanDetails.metadata.loanImageLink} size="large" />
                        <h4>Repayment Schedule:</h4>
                        {loanDetails.repaymentSchedule.map((payment) => (
                            <div key={payment.paymentId}>
                                <p>
                                    <strong>Payment ID:</strong> {payment.paymentId}
                                </p>
                                <p>
                                    <strong>Amount Due:</strong> {payment.amountDue}
                                </p>
                                <p>
                                    <strong>Due Date:</strong> {moment(payment.dueDate).format('LL')}
                                </p>
                                <ImageComponent ipfsLink={payment.imageLink} size="small" />
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
            <Table columns={loanOfferColumns} dataSource={items} />
        </div>
    );
};

export default OffersToMe;
