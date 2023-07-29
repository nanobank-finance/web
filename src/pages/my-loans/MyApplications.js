import { useState, useEffect } from 'react';

// material-ui
import { Grid } from '@mui/material';

// ant design
import { Table, InputNumber, Button, Modal, Form } from 'antd';
import moment from 'moment';

// project import
import { useAuth } from 'pages/authentication/auth-forms/AuthProvider';

// react
import { useNavigate } from 'react-router-dom';

const MyApplications = () => {
    const [dataLoading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const { user, loading } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
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

export default MyApplications;
