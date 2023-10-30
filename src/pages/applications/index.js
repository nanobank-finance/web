import { useState, useEffect, useRef, useContext } from 'react';

// ant design
import { Table } from 'antd';

// project import
import { useAuth } from 'pages/authentication/auth-forms/AuthProvider';
import load_endpoint from 'utils/load_endpoint';
import CreateApplicationButton from 'components/Buttons/CreateApplicationButton';
import CreateLoanButton from 'components/Buttons/CreateLoanButton';
import CreateVouchButton from 'components/Buttons/CreateVouchButton';
import CreditCheckButton from 'components/Buttons/CreditCheckButton';

const Applications = () => {
    const [dataLoading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const { user, loading } = useAuth();

    const columns = [
        {
            title: 'Application ID',
            dataIndex: 'application',
            key: 'application'
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
            title: 'Review Credit',
            dataIndex: '',
            key: 'x',
            render: (text, record) => (
                <CreditCheckButton
                    user={user}
                    afterCreate={() => {
                        /* TODO: logic if needed after creating a loan, like refreshing the data */
                    }}
                />
            ),
            key: 'action'
        },
        {
            title: 'Give Vouch',
            dataIndex: '',
            key: 'x',
            render: (text, record) => (
                <CreateVouchButton
                    user={user}
                    afterCreate={() => {
                        /* TODO: logic if needed after creating a loan, like refreshing the data */
                    }}
                />
            ),
            key: 'action'
        },
        {
            title: 'Give Offer',
            dataIndex: '',
            key: 'x',
            render: (text, record) => (
                <CreateLoanButton
                    user={user}
                    afterCreate={() => {
                        /* TODO: logic if needed after creating a loan, like refreshing the data */
                    }}
                    borrower={record.borrower}
                    principal={record.amount_asking}
                />
            ),
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
                alert(`Error: ${error.message || 'An error occurred!'}`);
            }
        );
    }, []);

    return (
        <div>
            <h1>Loan Applications</h1>
            <CreateApplicationButton
                user={user}
                afterCreate={() => {
                    /* TODO: logic if needed after creating a loan, like refreshing the data */
                }}
            />
            <Table columns={columns} dataSource={items} />
        </div>
    );
};

export default Applications;
