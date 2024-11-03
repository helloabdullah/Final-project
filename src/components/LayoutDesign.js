import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
import { UserOutlined, UnorderedListOutlined, MessageOutlined, MailOutlined, } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Sider } = Layout;
export default function LayoutDesign() {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState('0')
    const navigate = useNavigate(); 

    // Layout components data
    const items = [
        { key: '1', icon: <UserOutlined />, label: 'Users' },
        { key: '2', icon: <UnorderedListOutlined />, label: 'Table Bookings' },
        { key: '3', icon: <UnorderedListOutlined />, label: 'Orders' },
        { key: '4', icon: <UnorderedListOutlined />, label: 'Order History' },
        { key: '5', icon: <MessageOutlined />, label: 'User Feedback' },
        { key: '6', icon: <MailOutlined />, label: 'Users Email', },
        { key: '7', icon: <UnorderedListOutlined />, label: 'Menu List' },
        { key: '8', icon: <UnorderedListOutlined />, label: 'Add New Item' }
    ]

    const handleSelectedMenu = (key) => {
        setSelectedKey(key);
        switch (key) {
            case '1':
                navigate('users');
                break;
            case '2':
                navigate('table-bookings');
                break;
            case '3':
                navigate('orders');
                break;
            case '4':
                navigate('order-history');
                break;
            case '5':
                navigate('user-feedback');
                break;
            case '6':
                navigate('users-email');
                break;
            case '7':
                navigate('menu-list');
                break;
            case '8':
                navigate('add-new-item');
                break;
            default:
            // navigate('/');
        }
    };

    return (
        <>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" selectedKeys={[selectedKey]} mode="inline" items={items} onClick={({ key }) => handleSelectedMenu(key)} />
            </Sider>
       
        </>
    )
}
