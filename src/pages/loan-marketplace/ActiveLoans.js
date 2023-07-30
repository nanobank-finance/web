import { useState, useEffect, useRef, useContext } from 'react';

// ant design
import { Table } from 'antd';

// project import
import { useAuth } from 'pages/authentication/auth-forms/AuthProvider';
import { load_endpoint, columns } from 'pages/my-loans';

const ActiveLoans = () => {
    const [dataLoading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const { user, loading } = useAuth();

    useEffect(() => {
        load_endpoint(
            user,
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
            <Table columns={columns} dataSource={[]} />
        </div>
    );
};

export default ActiveLoans;
