import { useState, useEffect } from 'react';

// material-ui
import { Grid } from '@mui/material';

// ant design
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Skeleton } from 'antd';

// project import
import MainCard from 'components/MainCard';

// react
import { useNavigate } from 'react-router-dom';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

const { Meta } = Card;
const LoadingCards = (walletData) => {
    // https://ant.design/components/card/#
    const loading = true;
    return (
        <Grid container>
            <Card style={{ width: 300, marginTop: 16 }} loading={loading}>
                <Meta title="Card title" description="This is the description" />
            </Card>

            <Card style={{ width: 300, marginTop: 16 }} loading={loading}>
                <Meta title="Card title" description="This is the description" />
            </Card>
        </Grid>
    );
};

const Cards = (params) => {
    const filtered = params.walletData.filter((wallet) => wallet.type == params.walletType);
    const mapped = filtered.map((wallet) => {
        return (
            <Grid container key={Math.random()}>
                <Card
                    style={{
                        width: 300,
                        marginTop: 16
                    }}
                    actions={[<SettingOutlined key="setting" />, <EditOutlined key="edit" />, <EllipsisOutlined key="ellipsis" />]}
                >
                    <Skeleton loading={false} avatar active>
                        <Meta title={wallet.name} description={wallet.address} />
                    </Skeleton>
                </Card>
            </Grid>
        );
    });

    return mapped;
};

const WalletDefault = () => {
    const [walletData, setWalletData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const idToken = sessionStorage.getItem('idToken');
        fetch('http://127.0.0.1:8000/wallets', {
            method: 'GET',
            mode: 'cors',
            headers: {
                Authorization: 'Bearer ' + idToken
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setWalletData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    return (
        <Grid container>
            {/* row 1 */}
            <MainCard title="Personal Wallets" style={{ margin: '1%' }}>
                <Grid item xs={12} md={7} lg={8}>
                    {loading ? <LoadingCards /> : <Cards walletData={walletData} walletType={1} />}
                </Grid>
            </MainCard>

            {/* row 2 */}
            <MainCard title="Payment Wallets" style={{ margin: '1%' }}>
                <Grid item xs={12} md={7} lg={8}>
                    {loading ? <LoadingCards /> : <Cards walletData={walletData} walletType={2} />}
                </Grid>
            </MainCard>

            {/* row 3 */}
            <MainCard title="Yield Wallets" style={{ margin: '1%' }}>
                <Grid item xs={12} md={7} lg={8}>
                    {loading ? <LoadingCards /> : <Cards walletData={walletData} walletType={3} />}
                </Grid>
            </MainCard>
        </Grid>
    );
};

export default WalletDefault;
