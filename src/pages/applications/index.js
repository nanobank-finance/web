import { useState, useEffect, useRef, useContext } from 'react';

// ant design
import { Table } from 'antd';

// project import
import { useAuth } from 'pages/authentication/auth-forms/AuthProvider';
import load_endpoint from 'utils/load_endpoint';
import CreateApplicationButton from 'components/CreateLoanButton';

const columns = [
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

const Applications = () => {
    const [dataLoading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const { user, loading } = useAuth();

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

    return (
        <div>
            <CreateApplicationButton
                user={user}
                afterCreate={() => {
                    /* TODO: logic if needed after creating a loan, like refreshing the data */
                }}
            />
            <Table columns={columns} dataSource={[]} />
        </div>
    );
};

export default Applications;
