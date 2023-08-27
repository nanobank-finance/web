import { useState, useEffect, useRef, useContext } from 'react';

// ant design
import { Table, Button } from 'antd';

// project import
import { useAuth } from 'pages/authentication/auth-forms/AuthProvider';
import load_endpoint from 'utils/load_endpoint';

const Loans = () => {
    const [dataLoading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const { user, loading } = useAuth();

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
        },
        {
            title: 'Loan Status',
            dataIndex: 'loan_status',
            render: (loan_status) => {
                switch (loan_status) {
                    case 1:
                        return 'Pending Acceptance';
                    case 2:
                        return 'Expired Unaccepted';
                    case 3:
                        return 'Accepted';
                    case 4:
                        return 'Draft';
                    default:
                        return 'Unknown';
                }
            }
        },
        {
            title: 'Action',
            key: 'x',
            render: (text, record) => (
                <Button type="primary" onClick={() => history.push(`/loan/${record.key}`)}>
                    View Details
                </Button>
            )
        }
    ];

    useEffect(() => {
        load_endpoint(
            user,
            'http://127.0.0.1:8000/loans?recent=True',
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

export default Loans;
