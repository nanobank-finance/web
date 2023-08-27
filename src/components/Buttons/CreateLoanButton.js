import React, { useState } from 'react';
import { Form, InputNumber, Tooltip, DatePicker } from 'antd';
import dayjs from 'dayjs';
import ModalButton from './ModalButton';

const CreateLoanButton = ({ user, afterCreate, borrower, principal }) => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [expiryDate, setExpiryDate] = useState(null);
    const [maturityDate, setMaturityDate] = useState(null);
    const [startDate, setStartDate] = useState(null);

    const handleOfferExpiryDateChange = (dates) => {
        if (dates && dates.length > 0) {
            setExpiryDate(dates[0]);
        } else {
            setExpiryDate(null);
        }
    };

    const handleMaturityDateChange = (dates) => {
        if (dates && dates.length > 0) {
            setMaturityDate(dates[0]);
        } else {
            setMaturityDate(null);
        }
    };

    const handleStartDateChange = (dates) => {
        if (dates && dates.length > 0) {
            setStartDate(dates[0]);
        } else {
            setStartDate(null);
        }
    };

    const handleOk = async () => {
        setLoading(true);
        const values = form.getFieldsValue();
        const startDate = dayjs(values.start);
        const expiryDate = dayjs(values.expiry);
        const maturityDate = dayjs(values.maturity);

        if (expiryDate.isAfter(startDate)) {
            Modal.error({
                title: 'Error',
                content: 'The start date must be after the offer expiry date.'
            });
            return;
        }

        if (startDate.isAfter(maturityDate)) {
            Modal.error({
                title: 'Error',
                content: 'The start date must be before the maturity date.'
            });
            return;
        }

        form.validateFields()
            .then(async (values) => {
                form.resetFields();
                await createLoanOffer(values, user);
                setLoading(false);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                setLoading(false);
            });
    };

    const createLoanOffer = async (values, user) => {
        console.log(values);
        const loanOffer = {
            borrower: borrower,
            principal: principal,
            interest: values.interest / 100.0,
            payments: values.payments,
            start: dayjs(values.start).valueOf(),
            expiry: dayjs(values.expiry).valueOf(),
            maturity: dayjs(values.maturity).valueOf()
        };

        try {
            const response = await fetch('http://localhost:8000/loan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                    'X-User-Uid': `${user.uid}`
                },
                body: JSON.stringify(loanOffer)
            });

            const result = await response.json();
            console.log(result);
            navigation.navigate(`/loan/${result.metadata.loan}`);
        } catch (error) {
            console.log(error);
        }
    };

    const modalContent = (
        <Form form={form} layout="vertical">
            <Form.Item
                name="start"
                label={<Tooltip title="Date that the loan starts">Start Date</Tooltip>}
                rules={[{ required: true, message: 'Required' }]}
            >
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={handleStartDateChange} />
            </Form.Item>
            <Form.Item
                name="maturity"
                label={<Tooltip title="Date that the borrower's final loan payment is due">Maturity Date</Tooltip>}
                rules={[{ required: true, message: 'Required' }]}
            >
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={handleMaturityDateChange} />
            </Form.Item>
            <Form.Item
                name="payments"
                label={<Tooltip title="Number of payment intervals for the borrower">Number of Payments</Tooltip>}
                rules={[{ required: true, message: 'Required' }]}
            >
                <InputNumber min={0} />
            </Form.Item>
            <Form.Item
                name="interest"
                label={<Tooltip title="Amount of interest on the loan">Interest Rate</Tooltip>}
                initialValue={5}
                rules={[
                    { required: true, message: 'Required' },
                    {
                        validator: (_, value) =>
                            value > 0 ? Promise.resolve() : Promise.reject(new Error('Interest Rate must be greater than 0'))
                    }
                ]}
            >
                <InputNumber
                    min={0.01}
                    max={100}
                    step={0.01}
                    precision={2}
                    formatter={(value) => `${Number(value).toFixed(2)}%`}
                    parser={(value) => value.replace('%', '')}
                />
            </Form.Item>
            <Form.Item
                name="expiry"
                label={<Tooltip title="Date that the offer will expire">Offer Expiry</Tooltip>}
                rules={[{ required: true, message: 'Required' }]}
            >
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={handleOfferExpiryDateChange} />
            </Form.Item>
        </Form>
    );

    return (
        <ModalButton
            buttonText="Create Loan Offer"
            modalTitle="Create Loan Offer"
            modalContent={modalContent}
            onOk={handleOk}
            loading={loading}
        />
    );
};

export default CreateLoanButton;
