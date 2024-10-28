import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "./pages/public/Layout";
import NotFound from "./pages/NotFound";
import { LayoutAuth, Login, Otp, Register } from "./pages/public/Auth";
import Home from "./pages/public/Home";
import { getCurrentThunk } from "./redux/actions";
import { useAppDispatch } from "./hooks/useApp";
import LayoutAdmin from "./pages/admin/Layout";
import LayoutVendor from "./pages/vendor/Layout";
import { pathAdmin, pathUser, pathVendor } from "./path";

import CreateVendor from '@/pages/admin/vendor/create'
import ManageVendor from '@/pages/admin/vendor/manage'
import ManageUser from '@/pages/admin/user/manage'
import { CreateCategory, ManageCategory } from '@/pages/admin/category'
import { CreateCategoryOfVendor } from "./pages/vendor/category";
import UpdateRole from "./pages/public/UpdateRole";

function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getCurrentThunk())
  },[])
  return (
    <>
      <Routes>
        <Route path={pathUser.PUBLIC} element={<PublicLayout />}>
          <Route path={pathUser.HOME} element={<Home />} />
        </Route>
        <Route path={pathUser.AUTH} element={<LayoutAuth />}>
          <Route path={pathUser.LOGIN} element={<Login />} />
          <Route path={pathUser.REGISTER} element={<Register />} />
          <Route path={pathUser.VERIFYOTP} element={<Otp />} />
        </Route>
        <Route path={pathAdmin.ADMIN} element={<LayoutAdmin />}>
          <Route path={pathAdmin.CREATE_VENDORS} element={<CreateVendor />} />
          <Route path={pathAdmin.MANAGE_VENDORS} element={<ManageVendor />} />
          <Route path={pathAdmin.MANAGE_USERS} element={<ManageUser />} />
          <Route path={pathAdmin.CREATE_CATEGORIES} element={<CreateCategory />} />
          <Route path={pathAdmin.MANAGE_CATEGORIES} element={<ManageCategory />} />
        </Route>
        <Route path={pathVendor.VENDOR} element={<LayoutVendor />}>
          <Route path={pathVendor.CREATE_CATEGORY} element={<CreateCategoryOfVendor />} />
          
        </Route>
        <Route path={pathUser.UP_TO_SELLER} element={<UpdateRole />} />
        
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
