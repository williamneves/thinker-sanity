import { useRoutes } from "react-router-dom";
import SideMenu from '../layouts/side-menu/Main';
import Page1 from '../views/page-1/Main';
import Page2 from '../views/page-2/Main';
import { ProtectedRoute } from './ProtectedRoute';
import { Login, Validation, Register } from '../views/';

function Router() {
  const routes = [
		{
			path: '/',
			element: (
				<ProtectedRoute>
					<SideMenu />
				</ProtectedRoute>
			),
			children: [
				{
					path: '/',
					element: <Page1 />,
				},
				{
					path: 'page-2',
					element: <Page2 />,
				},
				{
					path: 'validation',
					element: <Validation />,
				},
			],
		},
		{
			path: '/login',
			element: <Login />,
		},
		{
			path: '/register',
			element: <Register />,
		},
	];

  return useRoutes(routes);
}

export default Router;
