import Header from './Header';
import MainNavigation from './MainNavigation';
import CategoryNav from './CategoryNav';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <CategoryNav />
      <MainNavigation />
      {children}
    </div>
  );
};

export default Layout;  