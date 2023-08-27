// components/ModalButton.js
import React, { useState } from 'react';
import { Button, Modal } from 'antd';

const ModalButton = ({ buttonText, modalTitle, modalContent, onOk, onCancel, buttonType = 'primary' }) => {
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
            <Button type={buttonType} onClick={handleModalShow}>
                {buttonText}
            </Button>
            <Modal title={modalTitle} visible={isModalVisible} onOk={handleModalOk} onCancel={handleModalHide}>
                {modalContent}
            </Modal>
        </>
    );
};

export default ModalButton;
