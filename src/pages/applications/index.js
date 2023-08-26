import { useState, useEffect, useRef, useContext } from 'react';

// ant design
import { Table } from 'antd';

// project import
import { useAuth } from 'pages/authentication/auth-forms/AuthProvider';
import load_endpoint from 'utils/load_endpoint';
import CreateLoanButton from 'components/CreateLoanButton';

const columns = [];

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
            <CreateLoanButton
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
