import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Home from "../screens/Home/Home";
import ServiceDetail from "../screens/Home/ServiceDetail";
import CompleteJob from "../screens/Home/CompleteJob";
import MenuScreen from "../screens/Home/MenuScreen";
import EditProfile from "../screens/MenuPages/EditProfile";
import Orders from "../screens/MenuPages/Orders";
import Finance from "../screens/MenuPages/Finance";
import HelpPage from "../screens/MenuPages/HelpPage";
import AboutApp from "../screens/MenuPages/AboutApp";
import ShareApp from "../screens/MenuPages/ShareApp";
import Notification from "../screens/MenuPages/Notification";
import OrderDetails from "../screens/MenuPages/OrderDetails";

const HomeStack = createStackNavigator(
  {
    Home: Home,
    ServiceDetail: ServiceDetail,
    CompleteJob: CompleteJob,
    MenuScreen: MenuScreen,
    EditProfile: EditProfile,
    Orders: Orders,
    Finance: Finance,
    HelpPage: HelpPage,
    AboutApp: AboutApp,
    ShareApp: ShareApp,
    Notification: Notification,
    OrderDetails: OrderDetails,
  },
  {
    initialRouteName: "Home",
    mode: "card",
    headerMode: "none",
  }
);

export default HomeStackNav = createAppContainer(HomeStack);
