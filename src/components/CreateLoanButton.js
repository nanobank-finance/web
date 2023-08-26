import React from 'react';
import { Form, InputNumber, Tooltip, DatePicker } from 'antd';
import dayjs from 'dayjs';
import ModalButton from './ModalButton';

const CreateLoanButton = ({ user, afterCreate }) => {
    const [form] = Form.useForm();

    const addKeys = (items) => {
        // Add key prop to each item in the array
        return items.map((item, index) => {
            return { ...item, key: index };
        });
    };

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

    const handleOfferOk = () => {
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
            .then((values) => {
                form.resetFields();
                createLoanOffer(values, user);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
        afterCreate();
    };

    const modalContent = (
        <Form form={form} layout="vertical">
            <Form.Item
                name="start"
                label={<Tooltip title="Date that the loan starts">Start Date</Tooltip>}
                rules={[{ required: true, message: 'Required' }]}
            >
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={handleStartDateChange} value={expiryDate ? [expiryDate] : []} />
            </Form.Item>
            <Form.Item
                name="maturity"
                label={<Tooltip title="Date that the borrower's final loan payment is due">Maturity Date</Tooltip>}
                rules={[{ required: true, message: 'Required' }]}
            >
                <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={handleMaturityDateChange}
                    value={maturityDate ? [maturityDate] : []}
                />
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
                <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={handleOfferExpiryDateChange}
                    value={expiryDate ? [expiryDate] : []}
                />
            </Form.Item>
        </Form>
    );

    return (
        <ModalButton buttonText="Create New Application" modalTitle="Create Loan Offer" modalContent={modalContent} onOk={handleOfferOk} />
    );
};

export default CreateLoanButton;
