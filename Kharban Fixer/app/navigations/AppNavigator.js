import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Welcome from "../screens/Welcome/Welcome";
import Login from "../screens/Login/Login";
import OTPScreen from "../screens/Login/OTPScreen";
import TnCScreen from "../screens/Login/TnCScreen";
import Registration from "../screens/Login/Registration";
import UploadScreen from "../screens/Login/UploadScreen";
import Home from "../screens/Home/Home";
// import HomeStackNav from "./HomeStack";
// import DrawerNav from "./DrawerNav";
import Congrats from "../screens/Congrats/Congrats";
import CompleteJob from "../screens/Home/CompleteJob";
import ServiceDetail from "../screens/Home/ServiceDetail";
import MenuScreen from "../screens/Home/MenuScreen";
import EditProfile from "../screens/MenuPages/EditProfile";
import Orders from "../screens/MenuPages/Orders";
import Finance from "../screens/MenuPages/Finance";
import HelpPage from "../screens/MenuPages/HelpPage";
import AboutApp from "../screens/MenuPages/AboutApp";
import ShareApp from "../screens/MenuPages/ShareApp";
import OrderDetails from "../screens/MenuPages/OrderDetails";
import Notification from "../screens/MenuPages/Notification";
import ReceiptAccept from "../screens/Home/ReceiptAccept";
import ReceiptReject from "../screens/Home/ReceiptReject";
import CountryModal from "../screens/Login/CountryModal";
const RootStack = createStackNavigator(
  {
    Welcome: Welcome,
    Login: Login,
    OTPScreen: OTPScreen,
    TnCScreen: TnCScreen,
    Registration: Registration,
    CountryModal: CountryModal,
    UploadScreen: UploadScreen,
    Congrats: Congrats,
    CompleteJob: CompleteJob,
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
    ReceiptAccept: ReceiptAccept,
    ReceiptReject: ReceiptReject,
  },
  {
    initialRouteName: "Welcome",
    mode: "card",
    headerMode: "none",
  }
);

export default AppNavigator = createAppContainer(RootStack);
