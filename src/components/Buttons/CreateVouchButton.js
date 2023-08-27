import React, { useState } from 'react';
import { Form, InputNumber, Tooltip, DatePicker } from 'antd';
import dayjs from 'dayjs';
import ModalButton from './ModalButton';

const CreateApplicationButton = ({ user, afterCreate }) => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const addKeys = (items) => {
        // Add key prop to each item in the array
        return items.map((item, index) => {
            return { ...item, key: index };
        });
    };

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

    const handleOk = () => {
        const values = form.getFieldsValue();
        const asking = values.asking; // TODO: validate asking
        form.validateFields()
            .then((values) => {
                form.resetFields();
                createApplication(values);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
        afterCreate();
    };

    const modalContent = (
        <Form form={form} layout="vertical">
            <Form.Item name="asking" label="Amount Requested" rules={[{ required: true, message: 'Please input the asking amount' }]}>
                <InputNumber min={0} />
            </Form.Item>
        </Form>
    );

    return <ModalButton buttonText="Vouch For Borrower" modalTitle="Create Voucher" modalContent={modalContent} onOk={handleOk} />;
};

export default CreateApplicationButton;
