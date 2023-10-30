import React, { useState } from 'react';
import { Button, Modal, Spin } from 'antd';

const ModalButton = ({ buttonText, modalTitle, modalContent, onOk, onCancel, buttonType = 'primary', loading }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleModalShow = () => {
        setIsModalVisible(true);
    };

    const handleModalHide = () => {
        setIsModalVisible(false);
        if (onCancel) onCancel();
    };

    const handleModalOk = () => {
        if (onOk) onOk();
        setIsModalVisible(false);
    };

    return (
        <>
            <Button type={buttonType} onClick={handleModalShow} loading={loading}>
                {buttonText}
            </Button>
            <Modal title={modalTitle} visible={isModalVisible} onOk={handleModalOk} onCancel={handleModalHide} confirmLoading={loading}>
                {/* <Spin spinning={loading}>{modalContent}</Spin> */}
                {modalContent}
            </Modal>
        </>
    );
};

export default ModalButton;
