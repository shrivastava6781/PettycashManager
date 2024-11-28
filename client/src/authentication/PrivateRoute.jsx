// // PrivateRoute.js
// import React from 'react';
// import { Route, useNavigate } from 'react-router-dom';
// import { useAuth } from '../authentication/AuthContext'; // Adjust the path

// const PrivateRoute = ({ element, ...rest }) => {
//   const { isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   React.useEffect(() => {
//     if (!isAuthenticated) {
//       // Redirect to the signin page
//       navigate('/signin', { replace: true });
//     }
//   }, [isAuthenticated, navigate]);

//   return isAuthenticated ? (
//     <Route {...rest} element={element} />
//   ) : null;
// };

// export default PrivateRoute;
