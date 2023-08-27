import { lazy } from 'react';
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import PrivateRoute from 'routes/PrivateRoutes';

const CheckPage = Loadable(lazy(() => import('pages/check')));
const OnboardPage = Loadable(lazy(() => import('pages/onboard')));
const Credit = Loadable(lazy(() => import('pages/credit')));
const LoanDetails = Loadable(lazy(() => import('pages/loan-details')));
const Loans = Loadable(lazy(() => import('pages/loans')));
const Applications = Loadable(lazy(() => import('pages/applications')));
const Vouches = Loadable(lazy(() => import('pages/vouches')));

const MainRoutes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: 'check',
                element: (
                    <PrivateRoute>
                        <CheckPage />
                    </PrivateRoute>
                )
            },
            {
                path: 'onboard',
                element: (
                    <PrivateRoute>
                        <OnboardPage />
                    </PrivateRoute>
                )
            },
            {
                path: 'loans',
                element: (
                    <PrivateRoute>
                        <Loans />
                    </PrivateRoute>
                )
            },
            {
                path: 'applications',
                element: (
                    <PrivateRoute>
                        <Applications />
                    </PrivateRoute>
                )
            },
            {
                path: 'vouches',
                element: (
                    <PrivateRoute>
                        <Vouches />
                    </PrivateRoute>
                )
            },
            {
                path: 'credit',
                element: (
                    <PrivateRoute>
                        <Credit />
                    </PrivateRoute>
                )
            },
            {
                path: 'loan/:loanId',
                element: (
                    <PrivateRoute>
                        <LoanDetails />
                    </PrivateRoute>
                )
            }
        ]
    }
];

export default MainRoutes;
