// assets
import {
    AppstoreAddOutlined,
    AntDesignOutlined,
    BarcodeOutlined,
    BgColorsOutlined,
    FontSizeOutlined,
    LoadingOutlined
} from '@ant-design/icons';

// icons
const icons = {
    FontSizeOutlined,
    BgColorsOutlined,
    BarcodeOutlined,
    AntDesignOutlined,
    LoadingOutlined,
    AppstoreAddOutlined
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
    id: 'utilities',
    title: 'Utilities',
    type: 'group',
    children: [
        {
            id: 'util-marketplace',
            title: 'Loans',
            type: 'item',
            url: '/loans',
            icon: icons.FontSizeOutlined
        },
        {
            id: 'util-my-loans',
            title: 'Applications',
            type: 'item',
            url: '/applications',
            icon: icons.BgColorsOutlined
        },
        {
            id: 'util-bill-pay',
            title: 'Vouches',
            type: 'item',
            url: '/vouches',
            icon: icons.BarcodeOutlined
        }
    ]
};

export default utilities;
