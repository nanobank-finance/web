import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import secureStorage from 'utils/secureStorage';
import nanobyte from 'nanobyte-provider';
import { nanobyte_api_key } from 'layout/MainLayout/Header/HeaderContent/Profile';
import { Form, InputNumber, Tooltip, DatePicker } from 'antd';
import ModalButton from './ModalButton';

const PayNowButton = ({ loanId, user, loadLoanDetails }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handlePayNow = async () => {
        try {
            const walletSessionKey = secureStorage.get('walletSessionKey');
            const paymentDetails = {
                price: '1.00',
                currency: 'NANO',
                label: 'Loan Payment',
                message: 'Thank you for choosing Nano Swap!',
                metadata: {
                    loanId: loanId
                }
            };

            const data = {
                paymentDetails: paymentDetails,
                sessionKey: walletSessionKey,
                apiKey: nanobyte_api_key
            };

            console.log(data);
            const paymentData = await nanobyte.requestPayment(nanobyte_api_key, walletSessionKey, paymentDetails);
            console.log(paymentData);

            // Start transaction verification
            const interval = setInterval(async () => {
                const status = await verifyPayment(paymentData.paymentId);
                if (status === 'completed') {
                    clearInterval(interval);

                    // Once payment is complete, notify the backend with transaction id
                    await fetch(`http://localhost:8000/loan/${loanId}/payment/${paymentData.paymentId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${user.token}`,
                            'X-User-Uid': `${user.uid}`
                        }
                    });

                    // Refresh loan details
                    loadLoanDetails();
                }
            }, 5000);
        } catch (error) {
            console.log(error);
        }
    };

    const modalContent = (
        <Form form={form} layout="vertical">
            <Form.Item name="asking" label="Amount Requested" rules={[{ required: true, message: 'Please input the asking amount' }]}>
                <InputNumber min={0} />
            </Form.Item>
        </Form>
    );

    const handleOk = () => {
        const values = form.getFieldsValue();
        form.validateFields()
            .then((values) => {
                form.resetFields();
                createApplication(values);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <ModalButton
            buttonText="Accept Offer"
            modalTitle="Accept Offer"
            modalContent={modalContent}
            onOk={handleOk}
            loading={loading}
        />
    );
};

export default PayNowButton;
