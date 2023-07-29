import { useState, useEffect } from 'react';

// ant design
import { Table } from 'antd';

// project import
import { useAuth } from 'pages/authentication/auth-forms/AuthProvider';
import { load_endpoint, columns } from 'pages/my-loans';

// react
import { useNavigate } from 'react-router-dom';

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

export default Borrowing;
